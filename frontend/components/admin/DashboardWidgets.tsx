'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentUsers: number;
}

export default function DashboardWidgets() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const users = await adminApi.getAllUsers();
      
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        adminUsers: users.filter(u => u.role === 'admin').length,
        recentUsers: users.filter(u => {
          const createdAt = new Date(u.createdAt || '');
          return createdAt >= sevenDaysAgo;
        }).length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const widgets = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: '✅',
      color: 'green',
    },
    {
      title: 'Administrators',
      value: stats.adminUsers,
      icon: '🔐',
      color: 'purple',
    },
    {
      title: 'New This Week',
      value: stats.recentUsers,
      icon: '🆕',
      color: 'amber',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mb-4"></div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget) => (
        <div
          key={widget.title}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {widget.title}
            </h3>
            <span className="text-2xl">{widget.icon}</span>
          </div>
          <div className={`text-3xl font-bold text-${widget.color}-600 dark:text-${widget.color}-400`}>
            {widget.value}
          </div>
        </div>
      ))}
    </div>
  );
}
