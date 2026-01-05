import apiClient from './client';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  type: 'lead' | 'client' | 'prospect';
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  address?: string;
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  type?: Contact['type'];
  notes?: string;
}

export interface UpdateContactDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  type?: Contact['type'];
  notes?: string;
}

export interface CreateCompanyDto {
  name: string;
  industry?: string;
  size?: Company['size'];
  website?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  industry?: string;
  size?: Company['size'];
  website?: string;
  address?: string;
  notes?: string;
}

// Contact API methods
export const contactsApi = {
  async getAll(): Promise<Contact[]> {
    const response = await apiClient.get('/crm/contacts');
    return response.data;
  },

  async getOne(id: string): Promise<Contact> {
    const response = await apiClient.get(`/crm/contacts/${id}`);
    return response.data;
  },

  async create(data: CreateContactDto): Promise<Contact> {
    const response = await apiClient.post('/crm/contacts', data);
    return response.data;
  },

  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    const response = await apiClient.patch(`/crm/contacts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/crm/contacts/${id}`);
  },
};

// Company API methods
export const companiesApi = {
  async getAll(): Promise<Company[]> {
    const response = await apiClient.get('/crm/companies');
    return response.data;
  },

  async getOne(id: string): Promise<Company> {
    const response = await apiClient.get(`/crm/companies/${id}`);
    return response.data;
  },

  async create(data: CreateCompanyDto): Promise<Company> {
    const response = await apiClient.post('/crm/companies', data);
    return response.data;
  },

  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    const response = await apiClient.patch(`/crm/companies/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/crm/companies/${id}`);
  },

  async getContacts(id: string): Promise<Contact[]> {
    const response = await apiClient.get(`/crm/companies/${id}/contacts`);
    return response.data;
  },
};
