export enum SubscriptionPlan {
  FREE_TRIAL = 'free_trial',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

export interface PlanLimits {
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
}

export class Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  pricePerUser: number; // in USD
  currency: string;
  limits: PlanLimits;
  createdAt: Date;
  updatedAt: Date;
}

export const PLAN_DETAILS: Record<SubscriptionPlan, { 
  name: string; 
  pricePerUser: number; 
  limits: PlanLimits;
  description: string;
}> = {
  [SubscriptionPlan.FREE_TRIAL]: {
    name: 'Free Trial',
    pricePerUser: 0,
    description: '14 days free trial with full access',
    limits: {
      maxUsers: 5,
      maxProjects: -1, // unlimited
      maxContacts: 500,
      maxCompanies: 100,
      storageGB: 1,
      hasAdvancedCRM: false,
      hasAdminPanel: false,
      hasAnalytics: false,
      hasAutomation: false,
      hasIntegrations: false,
    },
  },
  [SubscriptionPlan.BASIC]: {
    name: 'Basic',
    pricePerUser: 10,
    description: 'Perfect for small teams and freelancers',
    limits: {
      maxUsers: 5,
      maxProjects: -1, // unlimited
      maxContacts: 500,
      maxCompanies: 100,
      storageGB: 1,
      hasAdvancedCRM: false,
      hasAdminPanel: false,
      hasAnalytics: false,
      hasAutomation: false,
      hasIntegrations: false,
    },
  },
  [SubscriptionPlan.PREMIUM]: {
    name: 'Premium',
    pricePerUser: 30,
    description: 'For growing teams with advanced needs',
    limits: {
      maxUsers: -1, // unlimited
      maxProjects: -1, // unlimited
      maxContacts: -1, // unlimited
      maxCompanies: -1, // unlimited
      storageGB: 10,
      hasAdvancedCRM: true,
      hasAdminPanel: true,
      hasAnalytics: true,
      hasAutomation: true,
      hasIntegrations: true,
    },
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: 'Enterprise',
    pricePerUser: 0, // custom pricing
    description: 'For large organizations with custom needs',
    limits: {
      maxUsers: -1, // unlimited
      maxProjects: -1, // unlimited
      maxContacts: -1, // unlimited
      maxCompanies: -1, // unlimited
      storageGB: -1, // unlimited
      hasAdvancedCRM: true,
      hasAdminPanel: true,
      hasAnalytics: true,
      hasAutomation: true,
      hasIntegrations: true,
    },
  },
};
