import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // Contact endpoints
  @Post('contacts')
  createContact(
    @Body() createContactDto: CreateContactDto,
    @CurrentUser() user: User,
  ) {
    return this.crmService.createContact(createContactDto, user.id);
  }

  @Get('contacts')
  findAllContacts(@CurrentUser() user: User) {
    return this.crmService.findAllContacts(user.id);
  }

  @Get('contacts/:id')
  findOneContact(@Param('id') id: string, @CurrentUser() user: User) {
    return this.crmService.findOneContact(id, user.id);
  }

  @Patch('contacts/:id')
  updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @CurrentUser() user: User,
  ) {
    return this.crmService.updateContact(id, updateContactDto, user.id);
  }

  @Delete('contacts/:id')
  removeContact(@Param('id') id: string, @CurrentUser() user: User) {
    this.crmService.removeContact(id, user.id);
    return { message: 'Contact deleted successfully' };
  }

  // Company endpoints
  @Post('companies')
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.crmService.createCompany(createCompanyDto, user.id);
  }

  @Get('companies')
  findAllCompanies(@CurrentUser() user: User) {
    return this.crmService.findAllCompanies(user.id);
  }

  @Get('companies/:id')
  findOneCompany(@Param('id') id: string, @CurrentUser() user: User) {
    return this.crmService.findOneCompany(id, user.id);
  }

  @Patch('companies/:id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.crmService.updateCompany(id, updateCompanyDto, user.id);
  }

  @Delete('companies/:id')
  removeCompany(@Param('id') id: string, @CurrentUser() user: User) {
    this.crmService.removeCompany(id, user.id);
    return { message: 'Company deleted successfully' };
  }

  // Helper endpoint to get contacts by company
  @Get('companies/:id/contacts')
  findContactsByCompany(@Param('id') id: string, @CurrentUser() user: User) {
    return this.crmService.findContactsByCompany(id, user.id);
  }
}
