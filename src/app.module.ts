import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { connectionDB } from './db/typeorm.config';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyActionsModule } from './company-actions/company-actions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuizElementsModule } from './quiz-elements/quiz-elements.module';
import { QuizAnswersModule } from './quiz-answers/quiz-answers.module';
import { QuizResultsModule } from './quiz-results/quiz-results.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...connectionDB,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    CompanyActionsModule,
    QuizzesModule,
    QuizElementsModule,
    QuizAnswersModule,
    QuizResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
