import apiClient from './client';

export interface CheckoutSessionData {
  plan: string;
}

export interface CheckoutSessionResponse {
  sessionId?: string;
  url?: string;
  error?: string;
  mockMode?: boolean;
  message?: string;
}

export interface BillingPortalResponse {
  url?: string;
  error?: string;
  mockMode?: boolean;
  message?: string;
}

export const stripeApi = {
  async createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post('/stripe/create-checkout-session', data);
    return response.data;
  },

  async createBillingPortalSession(): Promise<BillingPortalResponse> {
    const response = await apiClient.post('/stripe/create-portal-session');
    return response.data;
  },
};
