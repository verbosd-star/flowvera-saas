'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteName: 'Flowvera',
    siteDescription: 'Project Management + CRM SaaS Platform',
    adminEmail: user?.email || '',
    maintenanceMode: false,
    allowRegistration: true,
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  const handleSave = () => {
    // Placeholder for save functionality
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  // Only show to admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="settings">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              System Settings
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Configure your site settings and preferences
            </p>
          </div>

          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
              General Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Temporarily disable site access for non-admins
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Allow User Registration
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Enable or disable new user registrations
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowRegistration ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Note
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Settings functionality is currently for demonstration purposes. Backend integration coming soon!
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
