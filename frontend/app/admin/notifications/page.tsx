'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    loadNotifications();
  }, [user, router]);

  const loadNotifications = () => {
    // Mock notifications data - in production, this would come from an API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'New User Registration',
        message: 'User john.doe@example.com has registered and is awaiting approval.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionUrl: '/admin/users',
      },
      {
        id: '2',
        type: 'success',
        title: 'Backup Completed',
        message: 'System backup has been completed successfully. All data is secure.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        type: 'warning',
        title: 'High Server Load',
        message: 'Server CPU usage has exceeded 80%. Consider scaling resources.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
      },
      {
        id: '4',
        type: 'error',
        title: 'Failed Login Attempts',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: '/admin/activity',
      },
      {
        id: '5',
        type: 'info',
        title: 'System Update Available',
        message: 'A new system update (v0.2.0) is available for installation.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
      },
      {
        id: '6',
        type: 'success',
        title: 'User Role Updated',
        message: 'User jane.smith@example.com has been promoted to Manager role.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
        actionUrl: '/admin/users',
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getRelativeTime = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      error: '❌',
    };
    return icons[type] || 'ℹ️';
  };

  const getTypeColors = (type: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };
    return colors[type] || colors.info;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'read' && !notif.read) return false;
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Only show to admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="notifications">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Stay updated with system alerts and user activities
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 block">
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Read ({notifications.length - unreadCount})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 block">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white dark:bg-zinc-900 rounded-lg border p-4 transition-all ${
                    getTypeColors(notif.type)
                  } ${
                    !notif.read ? 'border-l-4' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getTypeIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                            {notif.title}
                            {!notif.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{getRelativeTime(notif.timestamp)}</span>
                        {notif.actionUrl && (
                          <button
                            onClick={() => router.push(notif.actionUrl!)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View Details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Note
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Notifications are currently using mock data. In production, this will be connected to a real-time notification system with WebSocket support for instant updates, database persistence, and email/push notification integration.
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
