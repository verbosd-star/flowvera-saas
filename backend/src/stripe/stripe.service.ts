import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key') {
      console.warn('⚠️  Stripe is not configured. Set STRIPE_SECRET_KEY in .env to enable payment processing.');
      return;
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });

    console.log('✅ Stripe initialized successfully');
  }

  getStripe(): Stripe | null {
    return this.stripe || null;
  }

  /**
   * Create a Stripe checkout session for subscription
   */
  async createCheckoutSession(params: {
    customerEmail: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: params.metadata,
    };

    if (params.customerId) {
      sessionParams.customer = params.customerId;
      delete sessionParams.customer_email;
    }

    return await this.stripe.checkout.sessions.create(sessionParams);
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
  }

  /**
   * Get a Stripe customer
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
  }

  /**
   * Update a Stripe subscription
   */
  async updateSubscription(
    subscriptionId: string,
    params: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.subscriptions.update(subscriptionId, params);
  }

  /**
   * Cancel a Stripe subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    if (cancelAtPeriodEnd) {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    }
  }

  /**
   * Construct webhook event from raw body and signature
   */
  constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
  ): Stripe.Event {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    return await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }
}
