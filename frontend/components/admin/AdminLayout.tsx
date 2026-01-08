'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export default function AdminLayout({ children, currentPage = 'dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      path: '/admin/users',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/admin/analytics',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      path: '/admin/notifications',
    },
    {
      id: 'activity',
      label: 'Activity Logs',
      icon: '📋',
      path: '/admin/activity',
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: '🎭',
      path: '/admin/roles',
    },
    {
      id: 'content',
      label: 'Content',
      icon: '📝',
      path: '/admin/content',
    },
    {
      id: 'backups',
      label: 'Backups',
      icon: '💾',
      path: '/admin/backups',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-zinc-900 dark:bg-black border-b border-zinc-800 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-400 hover:text-white p-2"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-white font-semibold text-lg">
            Flowvera Admin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-zinc-400 hover:text-white text-sm"
          >
            View Site
          </button>
          <div className="text-zinc-400 text-sm hidden sm:block">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 z-20 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
        aria-hidden={!sidebarOpen}
      >
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-14 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
