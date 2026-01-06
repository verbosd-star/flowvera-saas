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
      
      // Calculate all stats in a single pass
      const stats = users.reduce((acc, u) => {
        acc.totalUsers++;
        if (u.isActive) acc.activeUsers++;
        if (u.role === 'admin') acc.adminUsers++;
        if (u.createdAt) {
          const createdAt = new Date(u.createdAt);
          if (createdAt >= sevenDaysAgo) acc.recentUsers++;
        }
        return acc;
      }, {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        recentUsers: 0,
      });
      
      setStats(stats);
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

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-3xl font-bold text-blue-600 dark:text-blue-400',
      green: 'text-3xl font-bold text-green-600 dark:text-green-400',
      purple: 'text-3xl font-bold text-purple-600 dark:text-purple-400',
      amber: 'text-3xl font-bold text-amber-600 dark:text-amber-400',
    };
    return colorMap[color] || colorMap.blue;
  };

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
          <div className={getColorClasses(widget.color)}>
            {widget.value}
          </div>
        </div>
      ))}
    </div>
  );
}
