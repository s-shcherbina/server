import { IsBoolean, IsDefined, IsEmpty, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/types';

export class CreateUserActionDto {
  @IsEmpty()
  ownerCompanyVerdict?: boolean;

  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  userVerdict?: boolean;

  @IsEmpty()
  role?: Role;
}
