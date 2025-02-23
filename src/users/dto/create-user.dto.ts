import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  avatar?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  password?: string | null;
}
