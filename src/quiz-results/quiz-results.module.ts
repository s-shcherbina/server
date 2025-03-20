import { Module } from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResult } from './entities/quiz-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CompanyActionsModule } from 'src/company-actions/company-actions.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizResult]),
    UsersModule,
    QuizzesModule,
    CompanyActionsModule,
    CompaniesModule,
  ],
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultsModule {}
