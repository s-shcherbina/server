import { IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class LogoutDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
