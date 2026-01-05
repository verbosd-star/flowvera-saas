import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Contact, ContactType } from './entities/contact.entity';
import { Company } from './entities/company.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CrmService {
  private contacts: Map<string, Contact> = new Map();
  private companies: Map<string, Company> = new Map();

  // Contact methods
  createContact(createContactDto: CreateContactDto, userId: string): Contact {
    const contact: Contact = {
      id: randomUUID(),
      firstName: createContactDto.firstName,
      lastName: createContactDto.lastName,
      email: createContactDto.email,
      phone: createContactDto.phone,
      companyId: createContactDto.companyId,
      type: createContactDto.type || ContactType.LEAD,
      notes: createContactDto.notes,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.contacts.set(contact.id, contact);
    return contact;
  }

  findAllContacts(userId: string): Contact[] {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.ownerId === userId,
    );
  }

  findOneContact(id: string, userId: string): Contact {
    const contact = this.contacts.get(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    if (contact.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this contact');
    }
    return contact;
  }

  updateContact(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: string,
  ): Contact {
    const contact = this.findOneContact(id, userId);

    const updatedContact = {
      ...contact,
      ...updateContactDto,
      updatedAt: new Date(),
    };

    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  removeContact(id: string, userId: string): void {
    const contact = this.findOneContact(id, userId);
    this.contacts.delete(contact.id);
  }

  // Company methods
  createCompany(createCompanyDto: CreateCompanyDto, userId: string): Company {
    const company: Company = {
      id: randomUUID(),
      name: createCompanyDto.name,
      industry: createCompanyDto.industry,
      size: createCompanyDto.size,
      website: createCompanyDto.website,
      address: createCompanyDto.address,
      notes: createCompanyDto.notes,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.companies.set(company.id, company);
    return company;
  }

  findAllCompanies(userId: string): Company[] {
    return Array.from(this.companies.values()).filter(
      (company) => company.ownerId === userId,
    );
  }

  findOneCompany(id: string, userId: string): Company {
    const company = this.companies.get(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    if (company.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this company');
    }
    return company;
  }

  updateCompany(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ): Company {
    const company = this.findOneCompany(id, userId);

    const updatedCompany = {
      ...company,
      ...updateCompanyDto,
      updatedAt: new Date(),
    };

    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  removeCompany(id: string, userId: string): void {
    const company = this.findOneCompany(id, userId);

    // Remove all contacts associated with this company
    const companyContacts = this.findAllContacts(userId).filter(
      (contact) => contact.companyId === company.id,
    );
    companyContacts.forEach((contact) => {
      const updatedContact = { ...contact, companyId: undefined };
      this.contacts.set(contact.id, updatedContact);
    });

    this.companies.delete(company.id);
  }

  // Helper method to get contacts by company
  findContactsByCompany(companyId: string, userId: string): Contact[] {
    // Verify user has access to the company
    this.findOneCompany(companyId, userId);

    return Array.from(this.contacts.values()).filter(
      (contact) =>
        contact.companyId === companyId && contact.ownerId === userId,
    );
  }
}
