'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

export default function RolesManagement() {
  // Mock permissions data
  const allPermissions: Permission[] = [
    { id: 'users.view', name: 'View Users', description: 'Can view user list', category: 'Users' },
    { id: 'users.create', name: 'Create Users', description: 'Can create new users', category: 'Users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Can edit user details', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Can delete users', category: 'Users' },
    { id: 'content.view', name: 'View Content', description: 'Can view content', category: 'Content' },
    { id: 'content.create', name: 'Create Content', description: 'Can create content', category: 'Content' },
    { id: 'content.edit', name: 'Edit Content', description: 'Can edit content', category: 'Content' },
    { id: 'content.delete', name: 'Delete Content', description: 'Can delete content', category: 'Content' },
    { id: 'settings.view', name: 'View Settings', description: 'Can view settings', category: 'Settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Can edit settings', category: 'Settings' },
    { id: 'analytics.view', name: 'View Analytics', description: 'Can view analytics', category: 'Analytics' },
    { id: 'logs.view', name: 'View Logs', description: 'Can view activity logs', category: 'Logs' },
  ];

  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: allPermissions.map(p => p.id),
      userCount: 1,
      isSystem: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Can manage users and content',
      permissions: ['users.view', 'users.edit', 'content.view', 'content.create', 'content.edit', 'analytics.view'],
      userCount: 3,
      isSystem: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Editor',
      description: 'Can create and edit content',
      permissions: ['content.view', 'content.create', 'content.edit'],
      userCount: 5,
      isSystem: false,
      createdAt: '2024-02-15T10:30:00Z',
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to content and analytics',
      permissions: ['content.view', 'analytics.view'],
      userCount: 10,
      isSystem: false,
      createdAt: '2024-03-01T14:20:00Z',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName,
      description: newRoleDescription,
      permissions: selectedPermissions,
      userCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };

    setRoles([...roles, newRole]);
    setShowCreateModal(false);
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setSelectedPermissions(role.permissions);
    setShowEditModal(true);
  };

  const handleUpdateRole = () => {
    if (!selectedRole || !newRoleName.trim()) return;

    setRoles(roles.map(role =>
      role.id === selectedRole.id
        ? { ...role, name: newRoleName, description: newRoleDescription, permissions: selectedPermissions }
        : role
    ));

    setShowEditModal(false);
    setSelectedRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      alert('System roles cannot be deleted');
      return;
    }
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AdminLayout currentPage="roles">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Custom Roles</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">Create and manage custom roles with granular permissions</p>
          </div>
          <button
            onClick={() => {
              setNewRoleName('');
              setNewRoleDescription('');
              setSelectedPermissions([]);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Create Role
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    {role.name}
                    {role.isSystem && (
                      <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                        System
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{role.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {role.permissions.length} permissions • {role.userCount} users
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permId) => {
                    const perm = allPermissions.find(p => p.id === permId);
                    return perm ? (
                      <span
                        key={permId}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {perm.name}
                      </span>
                    ) : null;
                  })}
                  {role.permissions.length > 3 && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-500 px-2 py-1">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditRole(role)}
                  className="flex-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                >
                  Edit
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Role Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New Role</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="e.g., Content Creator"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    rows={3}
                    placeholder="Brief description of this role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Permissions
                  </label>
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category} className="mb-4">
                      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">{category}</div>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-1"
                            />
                            <div>
                              <div className="text-sm text-zinc-900 dark:text-white">{perm.name}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">{perm.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedRole && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Edit Role: {selectedRole.name}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {selectedRole.isSystem && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ This is a system role. Modifications should be made carefully.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Permissions
                  </label>
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category} className="mb-4">
                      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">{category}</div>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-1"
                            />
                            <div>
                              <div className="text-sm text-zinc-900 dark:text-white">{perm.name}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">{perm.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  disabled={!newRoleName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This is a mock implementation. In production, roles and permissions should be stored in a database with proper validation and user assignment functionality.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
