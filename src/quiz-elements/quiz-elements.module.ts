import { Module } from '@nestjs/common';
import { QuizElementsService } from './quiz-elements.service';
import { QuizElementsController } from './quiz-elements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizElement } from './entities/quiz-element.entity';
import { QuizzesModule } from 'src/quizzes/quizzes.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizElement]), QuizzesModule],
  controllers: [QuizElementsController],
  providers: [QuizElementsService],
  exports: [QuizElementsService],
})
export class QuizElementsModule {}
