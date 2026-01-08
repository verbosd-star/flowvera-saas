'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type BackupType = 'full' | 'users' | 'settings';
type BackupStatus = 'completed' | 'in-progress' | 'failed';

interface Backup {
  id: string;
  name: string;
  type: BackupType;
  size: string;
  status: BackupStatus;
  date: Date;
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      name: 'Full Backup - ' + new Date(Date.now() - 86400000).toISOString().split('T')[0],
      type: 'full',
      size: '45.2 MB',
      status: 'completed',
      date: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: '2',
      name: 'Users Backup - ' + new Date(Date.now() - 172800000).toISOString().split('T')[0],
      type: 'users',
      size: '12.5 MB',
      status: 'completed',
      date: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
      id: '3',
      name: 'Settings Backup - ' + new Date(Date.now() - 259200000).toISOString().split('T')[0],
      type: 'settings',
      size: '1.2 MB',
      status: 'completed',
      date: new Date(Date.now() - 259200000), // 3 days ago
    },
  ]);
  
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBackupType, setNewBackupType] = useState<BackupType>('full');

  const BACKUP_SIMULATION_DELAY = 3000; // 3 seconds

  const handleCreateBackup = () => {
    const typeNames = {
      full: 'Full Backup',
      users: 'Users Backup',
      settings: 'Settings Backup',
    };

    const newBackup: Backup = {
      id: String(Date.now()),
      name: `${typeNames[newBackupType]} - ${new Date().toISOString().split('T')[0]}`,
      type: newBackupType,
      size: '0 MB',
      status: 'in-progress',
      date: new Date(),
    };

    setBackups([newBackup, ...backups]);
    setShowCreateModal(false);

    // Simulate backup completion
    setTimeout(() => {
      setBackups(prev =>
        prev.map(b =>
          b.id === newBackup.id
            ? { ...b, status: 'completed' as BackupStatus, size: getSimulatedBackupSize() }
            : b
        )
      );
    }, BACKUP_SIMULATION_DELAY);
  };

  const getSimulatedBackupSize = () => {
    const sizes = ['1.2 MB', '5.8 MB', '12.5 MB', '25.3 MB', '45.2 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const handleDownload = (backup: Backup) => {
    alert(`Downloading ${backup.name}...\n\nNote: In production, this will download the actual backup file.`);
  };

  const handleRestore = (backup: Backup) => {
    if (confirm(`Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`)) {
      alert(`Restoring from ${backup.name}...\n\nNote: In production, this will restore the data from the backup.`);
    }
  };

  const handleDelete = (backupId: string) => {
    if (confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      setBackups(backups.filter(b => b.id !== backupId));
    }
  };

  const getStatusColor = (status: BackupStatus) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status];
  };

  const getTypeColor = (type: BackupType) => {
    const colors = {
      full: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      users: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      settings: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    };
    return colors[type];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout currentPage="backups">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Backup Tools
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Create, manage, and restore backups of your data
          </p>
        </div>

        {/* Backup Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Manual Backup */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💾</span>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Manual Backup
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Create a backup of your data right now
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Backup Now
            </button>
          </div>

          {/* Scheduled Backups */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⏰</span>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Scheduled Backups
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-700 dark:text-zinc-300">Automatic Backups</span>
                <button
                  onClick={() => setAutoBackup(!autoBackup)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoBackup ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoBackup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Frequency
                </label>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                  disabled={!autoBackup}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Backup Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Retention Period (days)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                min="1"
                max="365"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Backups older than this will be automatically deleted
              </p>
            </div>
            <div>
              <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Email Notifications
              </label>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Receive email notifications when backups complete
              </p>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Backup History
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Backup Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {backup.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(backup.type)}`}>
                        {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)}`}>
                        {backup.status === 'in-progress' ? 'In Progress' : backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(backup.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {backup.status === 'completed' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(backup)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleRestore(backup)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handleDelete(backup.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This is a demonstration interface. In production, backups will be stored securely and can be used to restore your data in case of data loss or system failure.
          </p>
        </div>
      </div>

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Create New Backup
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Backup Type
              </label>
              <select
                value={newBackupType}
                onChange={(e) => setNewBackupType(e.target.value as BackupType)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
              >
                <option value="full">Full Backup (All Data)</option>
                <option value="users">Users Only</option>
                <option value="settings">Settings Only</option>
              </select>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                {newBackupType === 'full' && 'Includes all users, content, and settings'}
                {newBackupType === 'users' && 'Includes only user accounts and profiles'}
                {newBackupType === 'settings' && 'Includes only system settings and configuration'}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
