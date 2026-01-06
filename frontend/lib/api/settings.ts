import apiClient from './client';
import { User } from '@/types/auth';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const settingsApi = {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<User>('/settings/profile', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.put('/settings/password', data);
  },
};
