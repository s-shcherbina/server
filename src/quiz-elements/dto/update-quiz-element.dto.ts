import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { QuizAnswer } from 'src/quiz-answers/entities/quiz-answer.entity';

export class UpdateQuizElementDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  question?: string;

  @IsArray()
  @Length(2)
  quizAnswers: QuizAnswer[];
}
