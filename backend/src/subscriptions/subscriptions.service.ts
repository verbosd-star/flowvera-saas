import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  Subscription, 
  SubscriptionPlan, 
  SubscriptionStatus, 
  PLAN_DETAILS 
} from './subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from './dto/subscription.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class SubscriptionsService {
  // In-memory storage for now (will be replaced with database later)
  private subscriptions: Subscription[] = [];

  async create(userId: string, createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    // Check if user already has an active subscription or is in trial
    const existingSubscription = await this.findByUserId(userId);
    if (existingSubscription && (existingSubscription.status === SubscriptionStatus.ACTIVE || existingSubscription.status === SubscriptionStatus.TRIAL)) {
      throw new BadRequestException('User already has an active subscription');
    }

    const planDetails = PLAN_DETAILS[createSubscriptionDto.plan];
    const now = new Date();
    const isTrial = createSubscriptionDto.plan === SubscriptionPlan.FREE_TRIAL;

    // Calculate dates
    const startDate = now;
    const endDate = new Date(now);
    if (isTrial) {
      endDate.setDate(endDate.getDate() + 14); // 14 days trial
    } else {
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
    }

    const subscription: Subscription = {
      id: randomUUID(),
      userId,
      plan: createSubscriptionDto.plan,
      status: isTrial ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      trialEndsAt: isTrial ? endDate : undefined,
      pricePerUser: planDetails.pricePerUser,
      currency: 'USD',
      limits: planDetails.limits,
      createdAt: now,
      updatedAt: now,
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  async findByUserId(userId: string): Promise<Subscription | undefined> {
    // Check and update expired subscriptions before finding
    await this.checkAndUpdateExpired();
    return this.subscriptions.find((sub) => sub.userId === userId);
  }

  async findById(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.find((sub) => sub.id === id);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptions;
  }

  async update(userId: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Don't allow updates to cancelled or expired subscriptions
    if (subscription.status === SubscriptionStatus.CANCELLED || 
        subscription.status === SubscriptionStatus.EXPIRED) {
      throw new BadRequestException('Cannot update cancelled or expired subscription');
    }

    if (updateSubscriptionDto.plan) {
      const newPlanDetails = PLAN_DETAILS[updateSubscriptionDto.plan];
      subscription.plan = updateSubscriptionDto.plan;
      subscription.pricePerUser = newPlanDetails.pricePerUser;
      subscription.limits = newPlanDetails.limits;
      
      // If upgrading from trial, set to active
      if (subscription.status === SubscriptionStatus.TRIAL && 
          updateSubscriptionDto.plan !== SubscriptionPlan.FREE_TRIAL) {
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.trialEndsAt = undefined;
      }
    }

    subscription.updatedAt = new Date();
    return subscription;
  }

  async cancel(userId: string): Promise<Subscription> {
    const subscription = await this.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.updatedAt = new Date();
    
    return subscription;
  }

  async checkAndUpdateExpired(): Promise<void> {
    const now = new Date();
    
    for (const subscription of this.subscriptions) {
      if ((subscription.status === SubscriptionStatus.ACTIVE || 
           subscription.status === SubscriptionStatus.TRIAL) && 
          subscription.endDate < now) {
        subscription.status = SubscriptionStatus.EXPIRED;
        subscription.updatedAt = now;
      }
    }
  }

  async getSubscriptionInfo(userId: string): Promise<SubscriptionResponseDto> {
    // Check and update expired subscriptions
    await this.checkAndUpdateExpired();
    
    const subscription = await this.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const planDetails = PLAN_DETAILS[subscription.plan];
    const now = new Date();
    const daysRemaining = Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = subscription.endDate < now;

    return {
      id: subscription.id,
      userId: subscription.userId,
      plan: subscription.plan,
      planName: planDetails.name,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      trialEndsAt: subscription.trialEndsAt,
      cancelledAt: subscription.cancelledAt,
      pricePerUser: subscription.pricePerUser,
      currency: subscription.currency,
      limits: subscription.limits,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      isExpired,
    };
  }

  getAllPlans() {
    return Object.entries(PLAN_DETAILS).map(([plan, details]) => ({
      plan: plan as SubscriptionPlan,
      name: details.name,
      pricePerUser: details.pricePerUser,
      description: details.description,
      limits: details.limits,
    }));
  }
}
