import { IsBoolean, IsDefined, IsEmpty, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/types';

export class UpdateActionDto {
  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  ownerVerdict?: boolean;

  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  userVerdict?: boolean;

  @IsEmpty()
  role?: Role;

  @IsEmpty()
  rating?: number;
}
