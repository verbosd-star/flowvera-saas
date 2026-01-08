'use client';

import { useState, useEffect } from 'react';
import { subscriptionApi, Plan } from '@/lib/api/subscriptions';
import { stripeApi } from '@/lib/api/stripe';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await subscriptionApi.getPlans();
      setPlans(plansData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: string) => {
    if (!user) {
      router.push('/register');
      return;
    }
    
    // For paid plans, try to redirect to Stripe checkout
    if (plan === 'basic' || plan === 'premium') {
      try {
        setActionLoading(true);
        setError('');
        
        const result = await stripeApi.createCheckoutSession({ plan });
        
        if (result.error) {
          // If Stripe is not configured, fall back to subscription page
          console.warn('Stripe not configured:', result.error);
          router.push(`/subscription?plan=${plan}`);
          return;
        }
        
        if (result.url) {
          // Redirect to Stripe checkout
          window.location.href = result.url;
          return;
        }
      } catch (err) {
        console.error('Failed to create checkout session:', err);
        // Fall back to subscription page
        router.push(`/subscription?plan=${plan}`);
      } finally {
        setActionLoading(false);
      }
      return;
    }
    
    // For free trial or enterprise, go to subscription page
    router.push(`/subscription?plan=${plan}`);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free_trial':
        return 'border-zinc-300 dark:border-zinc-700';
      case 'basic':
        return 'border-blue-300 dark:border-blue-700';
      case 'premium':
        return 'border-purple-300 dark:border-purple-700';
      case 'enterprise':
        return 'border-amber-300 dark:border-amber-700';
      default:
        return 'border-zinc-300 dark:border-zinc-700';
    }
  };

  const getButtonColor = (plan: string) => {
    switch (plan) {
      case 'free_trial':
        return 'bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600';
      case 'basic':
        return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600';
      case 'premium':
        return 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600';
      case 'enterprise':
        return 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <button onClick={() => router.push('/')} className="text-2xl font-bold text-zinc-900 dark:text-white">
                Flowvera
              </button>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className={`bg-white dark:bg-zinc-900 rounded-lg border-2 ${getPlanColor(plan.plan)} p-8 flex flex-col`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    ${plan.pricePerUser}
                  </span>
                  {plan.pricePerUser > 0 && (
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">/user/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start text-sm">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {plan.limits.maxUsers === -1 ? 'Unlimited users' : `Up to ${plan.limits.maxUsers} users`}
                  </span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {plan.limits.maxProjects === -1 ? 'Unlimited projects' : `Up to ${plan.limits.maxProjects} projects`}
                  </span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {plan.limits.maxContacts === -1 ? 'Unlimited contacts' : `Up to ${plan.limits.maxContacts} contacts`}
                  </span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {plan.limits.storageGB === -1 ? 'Unlimited storage' : `${plan.limits.storageGB} GB storage`}
                  </span>
                </li>
                {plan.limits.hasAdvancedCRM && (
                  <li className="flex items-start text-sm">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Advanced CRM</span>
                  </li>
                )}
                {plan.limits.hasAdminPanel && (
                  <li className="flex items-start text-sm">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Admin Panel</span>
                  </li>
                )}
                {plan.limits.hasAnalytics && (
                  <li className="flex items-start text-sm">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Analytics & Reports</span>
                  </li>
                )}
                {plan.limits.hasAutomation && (
                  <li className="flex items-start text-sm">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Automation</span>
                  </li>
                )}
                {plan.limits.hasIntegrations && (
                  <li className="flex items-start text-sm">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Integrations</span>
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.plan)}
                className={`w-full ${getButtonColor(plan.plan)} text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50`}
                disabled={actionLoading}
              >
                {plan.plan === 'free_trial' ? 'Start Free Trial' : plan.plan === 'enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </main>
    </div>
  );
}
