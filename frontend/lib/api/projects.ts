import apiClient from './client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: Project['status'];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: Project['status'];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignedTo?: string;
  dueDate?: string;
}

// Project API methods
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  async getOne(id: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    const response = await apiClient.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  async getTask(projectId: string, taskId: string): Promise<Task> {
    const response = await apiClient.get(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  async createTask(projectId: string, data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(projectId: string, taskId: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};
