import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ContactType } from '../entities/contact.entity';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsEnum(ContactType)
  @IsOptional()
  type?: ContactType;

  @IsString()
  @IsOptional()
  notes?: string;
}
