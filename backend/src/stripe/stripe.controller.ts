import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { SubscriptionPlan } from '../subscriptions/subscription.entity';

interface CheckoutSessionDto {
  plan: SubscriptionPlan;
}

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private subscriptionsService: SubscriptionsService,
    private configService: ConfigService,
  ) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @CurrentUser() user: any,
    @Body() body: CheckoutSessionDto,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const useMockMode = this.configService.get<string>('STRIPE_MOCK_MODE') === 'true';

    // Mock/Simulation Mode - for testing without real Stripe
    if (useMockMode) {
      console.log(`🎭 [MOCK MODE] Simulating Stripe checkout for user ${user.email}, plan: ${body.plan}`);
      
      // Simulate a successful checkout by directly updating the subscription
      try {
        await this.subscriptionsService.update(user.id, { plan: body.plan });
        
        // Return a mock success URL that simulates Stripe redirect
        return {
          url: `${frontendUrl}/subscription?success=true&session_id=mock_cs_${Date.now()}&mock=true`,
          sessionId: `mock_cs_${Date.now()}`,
          mockMode: true,
          message: 'Mock mode: Subscription updated without payment',
        };
      } catch (error) {
        return { error: 'Failed to update subscription in mock mode' };
      }
    }

    // Real Stripe Mode
    const stripe = this.stripeService.getStripe();
    if (!stripe) {
      return {
        error: 'Stripe is not configured. Please configure Stripe in environment variables or enable STRIPE_MOCK_MODE.',
      };
    }

    const frontendUrlReal = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    
    // Get price ID from environment based on plan
    let priceId: string | undefined;
    switch (body.plan) {
      case SubscriptionPlan.BASIC:
        priceId = this.configService.get<string>('STRIPE_BASIC_PRICE_ID');
        break;
      case SubscriptionPlan.PREMIUM:
        priceId = this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID');
        break;
      default:
        return { error: 'Invalid plan selected' };
    }

    if (!priceId || priceId.startsWith('price_')) {
      return {
        error: 'Stripe price IDs are not configured. Please set them in environment variables.',
      };
    }

    // Check if user already has a Stripe customer ID
    const subscription = await this.subscriptionsService.findByUserId(user.id);
    
    try {
      const session = await this.stripeService.createCheckoutSession({
        customerEmail: user.email,
        priceId: priceId,
        successUrl: `${frontendUrlReal}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${frontendUrlReal}/subscription?canceled=true`,
        customerId: subscription?.stripeCustomerId,
        metadata: {
          userId: user.id,
          plan: body.plan,
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { error: 'Failed to create checkout session' };
    }
  }

  @Post('create-portal-session')
  @UseGuards(JwtAuthGuard)
  async createPortalSession(@CurrentUser() user: any) {
    const useMockMode = this.configService.get<string>('STRIPE_MOCK_MODE') === 'true';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Mock/Simulation Mode
    if (useMockMode) {
      console.log(`🎭 [MOCK MODE] Simulating billing portal for user ${user.email}`);
      
      // In mock mode, just redirect back to subscription page with a message
      return {
        url: `${frontendUrl}/subscription?mock_portal=true`,
        mockMode: true,
        message: 'Mock mode: Billing portal simulation - manage your subscription on this page',
      };
    }

    // Real Stripe Mode
    const stripe = this.stripeService.getStripe();
    if (!stripe) {
      return {
        error: 'Stripe is not configured. Please configure Stripe in environment variables or enable STRIPE_MOCK_MODE.',
      };
    }

    const subscription = await this.subscriptionsService.findByUserId(user.id);
    
    if (!subscription?.stripeCustomerId) {
      return { error: 'No Stripe customer found for this user' };
    }

    try {
      const session = await this.stripeService.createBillingPortalSession({
        customerId: subscription.stripeCustomerId,
        returnUrl: `${frontendUrl}/subscription`,
      });

      return { url: session.url };
    } catch (error) {
      console.error('Error creating portal session:', error);
      return { error: 'Failed to create portal session' };
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RequestWithRawBody,
  ) {
    const stripe = this.stripeService.getStripe();
    if (!stripe) {
      return { received: false, error: 'Stripe not configured' };
    }

    try {
      const event = this.stripeService.constructWebhookEvent(
        req.rawBody as Buffer,
        signature,
      );

      console.log(`🔔 Stripe webhook received: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      return { received: false, error: error.message };
    }
  }

  private async handleCheckoutSessionCompleted(session: any) {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as SubscriptionPlan;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!userId || !plan) {
      console.error('Missing userId or plan in checkout session metadata');
      return;
    }

    try {
      // Update subscription with Stripe info
      const subscription = await this.subscriptionsService.findByUserId(userId);
      if (subscription) {
        await this.subscriptionsService.update(userId, { plan });
        // Update Stripe customer and subscription IDs in database
        // This would require adding a method to update these fields
        console.log(`✅ Subscription updated for user ${userId} to plan ${plan}`);
      }
    } catch (error) {
      console.error('Error handling checkout session completed:', error);
    }
  }

  private async handleSubscriptionUpdated(subscription: any) {
    const customerId = subscription.customer;
    const status = subscription.status;
    
    console.log(`Subscription ${subscription.id} updated. Status: ${status}`);
    
    // Update subscription status in database based on Stripe status
    // This would require looking up the user by stripeCustomerId
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer;
    
    console.log(`Subscription ${subscription.id} deleted`);
    
    // Cancel the subscription in database
    // This would require looking up the user by stripeCustomerId
  }

  private async handlePaymentSucceeded(invoice: any) {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    
    console.log(`Payment succeeded for subscription ${subscriptionId}`);
    
    // Send payment confirmation email
    // Update subscription billing info
  }

  private async handlePaymentFailed(invoice: any) {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    
    console.log(`Payment failed for subscription ${subscriptionId}`);
    
    // Send payment failed email
    // Update subscription status if needed
  }
}
