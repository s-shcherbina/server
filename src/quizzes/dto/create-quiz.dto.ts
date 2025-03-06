import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';

export class CreateQuizDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  frequency: number;

  // @IsDefined()
  // @IsNotEmpty()
  // @IsNumber()
  // @IsArray()
  // @Length(2)
  // quizElements: QuizElement[];
}
