export enum CompanySize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

export class Company {
  id: string;
  name: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  address?: string;
  notes?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
