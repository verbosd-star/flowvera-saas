import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  Subscription, 
  SubscriptionPlan, 
  SubscriptionStatus, 
  PLAN_DETAILS 
} from './subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from './dto/subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { 
  SubscriptionPlan as PrismaSubscriptionPlan,
  SubscriptionStatus as PrismaSubscriptionStatus 
} from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

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

    // Convert plan to Prisma enum format
    const prismaPlan = createSubscriptionDto.plan.toUpperCase().replace('_', '_') as PrismaSubscriptionPlan;
    const prismaStatus = (isTrial ? 'TRIAL' : 'ACTIVE') as PrismaSubscriptionStatus;

    const dbSubscription = await this.prisma.subscription.create({
      data: {
        userId,
        plan: prismaPlan,
        status: prismaStatus,
        startDate,
        endDate,
        trialEndsAt: isTrial ? endDate : null,
        pricePerUser: planDetails.pricePerUser,
        currency: 'USD',
        maxUsers: planDetails.limits.maxUsers,
        maxProjects: planDetails.limits.maxProjects,
        maxContacts: planDetails.limits.maxContacts,
        maxCompanies: planDetails.limits.maxCompanies,
        storageGB: planDetails.limits.storageGB,
        hasAdvancedCRM: planDetails.limits.hasAdvancedCRM,
        hasAdminPanel: planDetails.limits.hasAdminPanel,
        hasAnalytics: planDetails.limits.hasAnalytics,
        hasAutomation: planDetails.limits.hasAutomation,
        hasIntegrations: planDetails.limits.hasIntegrations,
      },
    });

    return this.mapPrismaToSubscription(dbSubscription);
  }

  async findByUserId(userId: string): Promise<Subscription | undefined> {
    // Check and update expired subscriptions before finding
    await this.checkAndUpdateExpired();
    
    const dbSubscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return dbSubscription ? this.mapPrismaToSubscription(dbSubscription) : undefined;
  }

  async findById(id: string): Promise<Subscription | undefined> {
    const dbSubscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    return dbSubscription ? this.mapPrismaToSubscription(dbSubscription) : undefined;
  }

  async findAll(): Promise<Subscription[]> {
    const dbSubscriptions = await this.prisma.subscription.findMany();
    return dbSubscriptions.map(sub => this.mapPrismaToSubscription(sub));
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

    if (!updateSubscriptionDto.plan) {
      throw new BadRequestException('Plan is required for update');
    }

    const newPlanDetails = PLAN_DETAILS[updateSubscriptionDto.plan];
    const prismaPlan = updateSubscriptionDto.plan.toUpperCase().replace('_', '_') as PrismaSubscriptionPlan;
    
    // If upgrading from trial, set to active
    const newStatus = subscription.status === SubscriptionStatus.TRIAL && 
                      updateSubscriptionDto.plan !== SubscriptionPlan.FREE_TRIAL
      ? 'ACTIVE' as PrismaSubscriptionStatus
      : subscription.status.toUpperCase() as PrismaSubscriptionStatus;

    const dbSubscription = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: prismaPlan,
        status: newStatus,
        pricePerUser: newPlanDetails.pricePerUser,
        trialEndsAt: newStatus === 'ACTIVE' ? null : undefined,
        maxUsers: newPlanDetails.limits.maxUsers,
        maxProjects: newPlanDetails.limits.maxProjects,
        maxContacts: newPlanDetails.limits.maxContacts,
        maxCompanies: newPlanDetails.limits.maxCompanies,
        storageGB: newPlanDetails.limits.storageGB,
        hasAdvancedCRM: newPlanDetails.limits.hasAdvancedCRM,
        hasAdminPanel: newPlanDetails.limits.hasAdminPanel,
        hasAnalytics: newPlanDetails.limits.hasAnalytics,
        hasAutomation: newPlanDetails.limits.hasAutomation,
        hasIntegrations: newPlanDetails.limits.hasIntegrations,
      },
    });

    return this.mapPrismaToSubscription(dbSubscription);
  }

  async cancel(userId: string): Promise<Subscription> {
    const subscription = await this.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    const dbSubscription = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED' as PrismaSubscriptionStatus,
        cancelledAt: new Date(),
      },
    });
    
    return this.mapPrismaToSubscription(dbSubscription);
  }

  async checkAndUpdateExpired(): Promise<void> {
    const now = new Date();
    
    await this.prisma.subscription.updateMany({
      where: {
        OR: [
          { status: 'ACTIVE' as PrismaSubscriptionStatus },
          { status: 'TRIAL' as PrismaSubscriptionStatus },
        ],
        endDate: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED' as PrismaSubscriptionStatus,
      },
    });
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

  // Helper method to map Prisma subscription to entity
  private mapPrismaToSubscription(dbSub: any): Subscription {
    return {
      id: dbSub.id,
      userId: dbSub.userId,
      plan: dbSub.plan.toLowerCase() as SubscriptionPlan,
      status: dbSub.status.toLowerCase() as SubscriptionStatus,
      startDate: dbSub.startDate,
      endDate: dbSub.endDate,
      trialEndsAt: dbSub.trialEndsAt,
      cancelledAt: dbSub.cancelledAt,
      pricePerUser: dbSub.pricePerUser,
      currency: dbSub.currency,
      limits: {
        maxUsers: dbSub.maxUsers,
        maxProjects: dbSub.maxProjects,
        maxContacts: dbSub.maxContacts,
        maxCompanies: dbSub.maxCompanies,
        storageGB: dbSub.storageGB,
        hasAdvancedCRM: dbSub.hasAdvancedCRM,
        hasAdminPanel: dbSub.hasAdminPanel,
        hasAnalytics: dbSub.hasAnalytics,
        hasAutomation: dbSub.hasAutomation,
        hasIntegrations: dbSub.hasIntegrations,
      },
      stripeCustomerId: dbSub.stripeCustomerId,
      stripeSubscriptionId: dbSub.stripeSubscriptionId,
      stripePriceId: dbSub.stripePriceId,
      createdAt: dbSub.createdAt,
      updatedAt: dbSub.updatedAt,
    };
  }
}
