// import {
//   IsDefined,
//   IsEmpty,
//   IsNotEmpty,
//   IsString,
//   Matches,
//   MaxLength,
//   MinLength,
// } from 'class-validator';

// export class UpdateUserDto {
//   avatar?: string;

//   @IsDefined()
//   @IsNotEmpty()
//   @IsString()
//   name?: string;

//   @IsEmpty()
//   email?: null;

//   @IsDefined()
//   @IsNotEmpty()
//   @IsString()
//   @MinLength(4)
//   @MaxLength(20)
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
//   password?: string | null;
// }
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
