import { IsBoolean, IsDefined, IsEmpty, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/types';

export class CreateCompanyActionDto {
  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  ownerCompanyVerdict?: boolean;

  @IsEmpty()
  userVerdict?: boolean;

  @IsEmpty()
  role?: Role;
}
