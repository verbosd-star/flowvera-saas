'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { projectsApi, Project, Task } from '@/lib/api/projects';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle async params in Next.js 15+
    const loadParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setProjectId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (projectId) {
      loadProjectAndTasks();
    }
  }, [projectId]);

  const loadProjectAndTasks = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectsApi.getOne(projectId),
        projectsApi.getTasks(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    
    try {
      await projectsApi.createTask(projectId, {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setShowTaskModal(false);
      loadProjectAndTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    if (!projectId) return;
    
    try {
      await projectsApi.updateTask(projectId, taskId, { status: newStatus });
      loadProjectAndTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    if (!projectId) return;
    
    try {
      await projectsApi.deleteTask(projectId, taskId);
      loadProjectAndTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: { status: Task['status']; title: string; color: string }[] = [
    { status: 'todo', title: 'To Do', color: 'border-zinc-300 dark:border-zinc-700' },
    { status: 'in_progress', title: 'In Progress', color: 'border-blue-300 dark:border-blue-700' },
    { status: 'in_review', title: 'In Review', color: 'border-yellow-300 dark:border-yellow-700' },
    { status: 'done', title: 'Done', color: 'border-green-300 dark:border-green-700' },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
          <div className="text-zinc-600 dark:text-zinc-400">Loading project...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">Project not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Flowvera
                </h1>
                <nav className="flex gap-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/projects')}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Projects
                  </button>
                </nav>
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
          <div className="mb-8">
            <button
              onClick={() => router.push('/projects')}
              className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
            >
              ← Back to Projects
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    {project.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + New Task
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div
                key={column.status}
                className={`bg-white dark:bg-zinc-900 rounded-lg border-t-4 ${column.color} p-4`}
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {column.title}
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-500">
                    ({getTasksByStatus(column.status).length})
                  </span>
                </h3>

                <div className="space-y-3">
                  {getTasksByStatus(column.status).length === 0 ? (
                    <div className="text-center text-sm text-zinc-400 dark:text-zinc-600 py-4">
                      No tasks
                    </div>
                  ) : (
                    getTasksByStatus(column.status).map((task) => (
                      <div
                        key={task.id}
                        className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-zinc-900 dark:text-white text-sm">
                            {task.title}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex gap-1 flex-wrap mb-2">
                          {columns.map((col) => (
                            col.status !== task.status && (
                              <button
                                key={col.status}
                                onClick={() => handleUpdateTaskStatus(task.id, col.status)}
                                className="text-xs bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded transition-colors"
                              >
                                → {col.title}
                              </button>
                            )
                          ))}
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Create Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                Create New Task
              </h3>
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false);
                      setNewTaskTitle('');
                      setNewTaskDescription('');
                      setNewTaskPriority('medium');
                    }}
                    className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
