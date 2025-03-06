import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsBoolean()
  visibility: boolean;
}
