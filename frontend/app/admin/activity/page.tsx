'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'success' | 'error';
}

export default function AdminActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    loadActivityLogs();
  }, [user, router]);

  const loadActivityLogs = () => {
    // Mock data for demonstration - in production this would come from the backend
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        userId: user?.id || '',
        userName: `${user?.firstName} ${user?.lastName}`,
        action: 'User Login',
        details: 'Admin user logged in successfully',
        timestamp: new Date(),
        type: 'success',
      },
      {
        id: '2',
        userId: user?.id || '',
        userName: `${user?.firstName} ${user?.lastName}`,
        action: 'Accessed Admin Panel',
        details: 'Navigated to admin dashboard',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'info',
      },
      {
        id: '3',
        userId: user?.id || '',
        userName: `${user?.firstName} ${user?.lastName}`,
        action: 'Viewed User List',
        details: 'Accessed user management section',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'info',
      },
      {
        id: '4',
        userId: user?.id || '',
        userName: 'System',
        action: 'Admin Panel Created',
        details: 'WordPress-style admin panel was successfully implemented',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'success',
      },
    ];

    setLogs(mockLogs);
    setLoading(false);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
      warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
      success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
      error: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      error: '❌',
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  // Only show to admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="activity">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                Activity Logs
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Monitor system activities and user actions
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              >
                <option value="all">All Activities</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {loading ? (
              <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
                Loading activity logs...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getTypeColor(log.type)}`}>
                            <span>{getTypeIcon(log.type)}</span>
                            <span className="capitalize">{log.type}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                          {log.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-500">
                          {formatTimestamp(log.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
                    No activity logs found for the selected filter
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Note
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Activity logs are currently displayed with mock data. In production, these logs will be stored in the database and include all user actions, system events, and security-related activities.
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
