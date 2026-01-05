export enum ContactType {
  LEAD = 'lead',
  CLIENT = 'client',
  PROSPECT = 'prospect',
}

export class Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  type: ContactType;
  notes?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
