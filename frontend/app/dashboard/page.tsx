'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Flowvera
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Welcome to Flowvera! 🚀
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              You are successfully logged in to your account.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                User Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium text-blue-900 dark:text-blue-100 w-24">Email:</span>
                  <span className="text-blue-800 dark:text-blue-200">{user?.email}</span>
                </div>
                {user?.firstName && (
                  <div className="flex">
                    <span className="font-medium text-blue-900 dark:text-blue-100 w-24">First Name:</span>
                    <span className="text-blue-800 dark:text-blue-200">{user.firstName}</span>
                  </div>
                )}
                {user?.lastName && (
                  <div className="flex">
                    <span className="font-medium text-blue-900 dark:text-blue-100 w-24">Last Name:</span>
                    <span className="text-blue-800 dark:text-blue-200">{user.lastName}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-medium text-blue-900 dark:text-blue-100 w-24">Role:</span>
                  <span className="text-blue-800 dark:text-blue-200 capitalize">{user?.role}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-blue-900 dark:text-blue-100 w-24">User ID:</span>
                  <span className="text-blue-800 dark:text-blue-200">{user?.id}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/projects')}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow text-left"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Projects</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Manage your projects and tasks with Monday-style boards
                </p>
                <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Go to Projects →
                </div>
              </button>
              <button
                onClick={() => router.push('/crm/contacts')}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow text-left"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">CRM</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Manage your contacts and companies
                </p>
                <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Go to CRM →
                </div>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow text-left"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Settings</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Manage your account settings and profile
                </p>
                <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Go to Settings →
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
