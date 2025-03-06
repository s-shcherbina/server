import { IsDefined, IsEmpty, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/types';

export class UpdateRoleDto {
  @IsEmpty()
  ownerCompanyVerdict?: boolean;

  @IsEmpty()
  userVerdict?: boolean;

  @IsDefined()
  @IsNotEmpty()
  role?: Role;
}
