import {
  IsDefined,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';

export class CreateQuizDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  frequency: number;

  @IsDefined()
  @IsObject()
  company: Company;

  @IsEmpty()
  valid: boolean;
}
