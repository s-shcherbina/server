import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { QuizAnswer } from '../../quiz-answers/entities/quiz-answer.entity';

export class CreateQuizElementDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @Length(2)
  quizAnswers: QuizAnswer[];
}
