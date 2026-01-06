export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export class User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
