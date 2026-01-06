'use client';

import { useState, useEffect, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { subscriptionApi, Subscription, Plan } from '@/lib/api/subscriptions';
import { useRouter, useSearchParams } from 'next/navigation';

function SubscriptionContent() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get('plan');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (planFromUrl && plans.length > 0 && subscription) {
      // If there's a plan in the URL and no active subscription, show upgrade option
      if (subscription.status === 'trial' || subscription.plan !== planFromUrl) {
        const confirmUpgrade = window.confirm(`Would you like to upgrade to the ${planFromUrl.toUpperCase().replace('_', ' ')} plan?`);
        if (confirmUpgrade) {
          handleUpgrade(planFromUrl);
        }
      }
    }
  }, [planFromUrl, plans, subscription]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subscriptionData, plansData] = await Promise.all([
        subscriptionApi.getCurrent(),
        subscriptionApi.getPlans(),
      ]);
      setSubscription(subscriptionData);
      setPlans(plansData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      
      const result = await subscriptionApi.update({ plan });
      setSuccess(result.message);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upgrade subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? Your access will continue until the end of the billing period.')) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      
      const result = await subscriptionApi.cancel();
      setSuccess(result.message);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'trial':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'expired':
        return 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/20';
      default:
        return 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/20';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
          <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <button onClick={() => router.push('/dashboard')} className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Flowvera
                </button>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Subscription Management
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {subscription && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {subscription.planName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status.toUpperCase()}
                    </span>
                    {subscription.daysRemaining > 0 && (
                      <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {subscription.daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    ${subscription.pricePerUser}
                  </div>
                  {subscription.pricePerUser > 0 && (
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                      per user/month
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Start Date</div>
                  <div className="text-zinc-900 dark:text-white">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">End Date</div>
                  <div className="text-zinc-900 dark:text-white">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                  Plan Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Users</div>
                    <div className="text-zinc-900 dark:text-white">
                      {subscription.limits.maxUsers === -1 ? 'Unlimited' : subscription.limits.maxUsers}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Projects</div>
                    <div className="text-zinc-900 dark:text-white">
                      {subscription.limits.maxProjects === -1 ? 'Unlimited' : subscription.limits.maxProjects}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Contacts</div>
                    <div className="text-zinc-900 dark:text-white">
                      {subscription.limits.maxContacts === -1 ? 'Unlimited' : subscription.limits.maxContacts}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Storage</div>
                    <div className="text-zinc-900 dark:text-white">
                      {subscription.limits.storageGB === -1 ? 'Unlimited' : `${subscription.limits.storageGB} GB`}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {subscription.limits.hasAdvancedCRM && (
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      Advanced CRM
                    </span>
                  )}
                  {subscription.limits.hasAdminPanel && (
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                      Admin Panel
                    </span>
                  )}
                  {subscription.limits.hasAnalytics && (
                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm">
                      Analytics
                    </span>
                  )}
                  {subscription.limits.hasAutomation && (
                    <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-sm">
                      Automation
                    </span>
                  )}
                  {subscription.limits.hasIntegrations && (
                    <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm">
                      Integrations
                    </span>
                  )}
                </div>
              </div>

              {subscription.status !== 'cancelled' && subscription.status !== 'expired' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push('/pricing')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    Change Plan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.plan}
                  className={`border-2 rounded-lg p-6 ${
                    subscription?.plan === plan.plan
                      ? 'border-blue-500 dark:border-blue-500'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                    ${plan.pricePerUser}
                    {plan.pricePerUser > 0 && (
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">/mo</span>
                    )}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  {subscription?.plan !== plan.plan && subscription?.status !== 'cancelled' && subscription?.status !== 'expired' && (
                    <button
                      onClick={() => handleUpgrade(plan.plan)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      {plan.plan === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                    </button>
                  )}
                  {subscription?.plan === plan.plan && (
                    <div className="w-full text-center py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium">
                      Current Plan
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
          <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      </ProtectedRoute>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
