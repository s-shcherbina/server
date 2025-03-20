import {
  IsBoolean,
  IsDefined,
  IsEmpty,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { Role } from 'src/common/types';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyActionDto {
  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  ownerVerdict: boolean;

  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  userVerdict: boolean;

  @IsDefined()
  @IsObject()
  company: Company;

  @IsDefined()
  @IsObject()
  user: User;

  @IsEmpty()
  role?: Role;
}
