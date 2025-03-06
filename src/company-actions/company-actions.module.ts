import { Module } from '@nestjs/common';
import { CompanyActionsService } from './company-actions.service';
import { CompanyActionsController } from './company-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAction } from './entities/company-actions.entity';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyAction]),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [CompanyActionsController],
  providers: [CompanyActionsService],
  exports: [CompanyActionsService],
})
export class CompanyActionsModule {}
