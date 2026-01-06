'use client';

import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardWidgets from '@/components/admin/DashboardWidgets';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  // Only show to admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="dashboard">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome to your WordPress-style admin panel
            </p>
          </div>

          <DashboardWidgets />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin/users')}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">Manage Users</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">View and edit user accounts</div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/admin/content')}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                >
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">Manage Content</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Create and edit content</div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/admin/settings')}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                >
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">System Settings</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Configure your site</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                System Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Version</span>
                  <span className="font-medium text-zinc-900 dark:text-white">0.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Environment</span>
                  <span className="font-medium text-zinc-900 dark:text-white">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Admin Email</span>
                  <span className="font-medium text-zinc-900 dark:text-white">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
