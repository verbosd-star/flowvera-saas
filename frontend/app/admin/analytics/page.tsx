'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api/admin';

interface ChartData {
  labels: string[];
  values: number[];
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState<ChartData>({ labels: [], values: [] });
  const [activeUsers, setActiveUsers] = useState<ChartData>({ labels: [], values: [] });
  const [roleDistribution, setRoleDistribution] = useState<{ role: string; count: number }[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    loadAnalytics();
  }, [user, router]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const users = await adminApi.getAllUsers();
      
      // Generate mock data for user growth (last 7 days)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const growthValues = [users.length - 6, users.length - 5, users.length - 4, users.length - 3, users.length - 2, users.length - 1, users.length];
      
      setUserGrowth({
        labels: days,
        values: growthValues,
      });

      // Active users per day (mock data)
      const activeValues = [Math.max(1, users.filter(u => u.isActive).length - 2), Math.max(1, users.filter(u => u.isActive).length - 1), users.filter(u => u.isActive).length, users.filter(u => u.isActive).length, Math.max(1, users.filter(u => u.isActive).length - 1), users.filter(u => u.isActive).length, users.filter(u => u.isActive).length];
      
      setActiveUsers({
        labels: days,
        values: activeValues,
      });

      // Role distribution
      const roles = users.reduce((acc: Record<string, number>, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {});

      setRoleDistribution(
        Object.entries(roles).map(([role, count]) => ({ role, count: count as number }))
      );

      setLoading(false);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setLoading(false);
    }
  };

  const getMaxValue = (values: number[]) => Math.max(...values, 1);

  // Only show to admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="analytics">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Analytics
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Monitor platform metrics and user activity
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
              Loading analytics...
            </div>
          ) : (
            <>
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                    📈 User Growth (Last 7 Days)
                  </h3>
                  <div className="space-y-2">
                    {userGrowth.labels.map((label, index) => {
                      const value = userGrowth.values[index];
                      const maxValue = getMaxValue(userGrowth.values);
                      const percentage = (value / maxValue) * 100;
                      
                      return (
                        <div key={label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                            <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Users Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                    👤 Active Users (Last 7 Days)
                  </h3>
                  <div className="space-y-2">
                    {activeUsers.labels.map((label, index) => {
                      const value = activeUsers.values[index];
                      const maxValue = getMaxValue(activeUsers.values);
                      const percentage = (value / maxValue) * 100;
                      
                      return (
                        <div key={label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                            <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div
                              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Role Distribution */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                  🎭 Role Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleDistribution.map((item) => {
                    const total = roleDistribution.reduce((sum, r) => sum + r.count, 0);
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    const colors: Record<string, string> = {
                      admin: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
                      manager: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
                      user: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800',
                    };
                    const colorClass = colors[item.role] || colors.user;

                    return (
                      <div
                        key={item.role}
                        className={`p-4 rounded-lg border ${colorClass}`}
                      >
                        <div className="text-sm font-medium capitalize mb-1">{item.role}</div>
                        <div className="text-2xl font-bold mb-1">{item.count}</div>
                        <div className="text-xs opacity-75">{percentage}% of total</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Total Signups</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {userGrowth.values[userGrowth.values.length - 1] || 0}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ↗ +{Math.max(0, (userGrowth.values[userGrowth.values.length - 1] || 0) - (userGrowth.values[0] || 0))} this week
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Active Today</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {activeUsers.values[activeUsers.values.length - 1] || 0}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Last updated: Just now
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Growth Rate</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {(() => {
                      const first = userGrowth.values[0] || 1;
                      const last = userGrowth.values[userGrowth.values.length - 1] || 1;
                      const growth = ((last - first) / first * 100).toFixed(1);
                      return `${growth}%`;
                    })()}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                    Weekly growth rate
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Avg. Daily Users</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {(() => {
                      const avg = activeUsers.values.reduce((a, b) => a + b, 0) / activeUsers.values.length;
                      return Math.round(avg);
                    })()}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    7-day average
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Note
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Analytics data is currently based on mock calculations. In production, this will connect to a real analytics engine with historical data tracking, real-time metrics, and advanced visualizations.
                </p>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
