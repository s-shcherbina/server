import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuizAnswerDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  text?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  isRight?: Boolean;
}
