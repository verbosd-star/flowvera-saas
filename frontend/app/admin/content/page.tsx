'use client';

import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminContentPage() {
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
      <AdminLayout currentPage="content">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Content Management
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create and manage your site content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Pages
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Create and edit static pages
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Manage Pages
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Posts
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Write and publish blog posts
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Manage Posts
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Media
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Upload and manage media files
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Media Library
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Content management features are currently under development. Check back soon!
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
