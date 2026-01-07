import { IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan } from '../subscription.entity';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;
}

export class SubscriptionResponseDto {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  pricePerUser: number;
  currency: string;
  limits: {
    maxUsers: number;
    maxProjects: number;
    maxContacts: number;
    maxCompanies: number;
    storageGB: number;
    hasAdvancedCRM: boolean;
    hasAdminPanel: boolean;
    hasAnalytics: boolean;
    hasAutomation: boolean;
    hasIntegrations: boolean;
  };
  daysRemaining?: number;
  isExpired: boolean;
}
