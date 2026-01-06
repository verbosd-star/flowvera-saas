import apiClient from './client';
import { User } from '@/types/auth';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user' | 'manager';
  isActive?: boolean;
}

export const adminApi = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  },

  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`);
  },
};
