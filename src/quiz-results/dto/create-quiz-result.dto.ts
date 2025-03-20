import { IsDefined, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateQuizResultDto {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  questions: number;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  correctAnswers: number;

  @IsDefined()
  @IsObject()
  quiz: Quiz;
}
