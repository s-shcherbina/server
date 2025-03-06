import { Module } from '@nestjs/common';
import { QuizAnswersService } from './quiz-answers.service';
import { QuizAnswersController } from './quiz-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { QuizElementsModule } from '../quiz-elements/quiz-elements.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAnswer]), QuizElementsModule],
  controllers: [QuizAnswersController],
  providers: [QuizAnswersService],
})
export class QuizAnswersModule {}
