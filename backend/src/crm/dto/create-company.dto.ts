import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { CompanySize } from '../entities/company.entity';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsEnum(CompanySize)
  @IsOptional()
  size?: CompanySize;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
