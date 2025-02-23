import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password?: string;
}
