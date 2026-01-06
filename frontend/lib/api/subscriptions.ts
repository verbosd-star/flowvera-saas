import apiClient from './client';

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

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  pricePerUser: number;
  currency: string;
  limits: PlanLimits;
  daysRemaining: number;
  isExpired: boolean;
}

export interface Plan {
  plan: string;
  name: string;
  pricePerUser: number;
  description: string;
  limits: PlanLimits;
}

export interface CreateSubscriptionData {
  plan: string;
}

export interface UpdateSubscriptionData {
  plan: string;
}

export const subscriptionApi = {
  async create(data: CreateSubscriptionData): Promise<{ message: string; subscription: Subscription }> {
    const response = await apiClient.post('/subscriptions', data);
    return response.data;
  },

  async getCurrent(): Promise<Subscription> {
    const response = await apiClient.get('/subscriptions');
    return response.data;
  },

  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  async update(data: UpdateSubscriptionData): Promise<{ message: string; subscription: Subscription }> {
    const response = await apiClient.put('/subscriptions', data);
    return response.data;
  },

  async cancel(): Promise<{ message: string; subscription: Subscription }> {
    const response = await apiClient.post('/subscriptions/cancel');
    return response.data;
  },
};
