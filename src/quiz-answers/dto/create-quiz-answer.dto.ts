import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';

export class CreateQuizAnswerDto {
  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  correct: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsDefined()
  @IsObject()
  element: QuizElement;
}
