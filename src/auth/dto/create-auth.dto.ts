import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
