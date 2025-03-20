import { IsDefined, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

export class CreateQuizElementDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsDefined()
  @IsObject()
  quiz: Quiz;
}
