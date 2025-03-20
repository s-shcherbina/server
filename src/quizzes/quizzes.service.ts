import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { CompanyActionsService } from 'src/company-actions/company-actions.service';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly companyActionsService: CompanyActionsService,
  ) {}

  public async findQuizById(id: string) {
    return this.quizRepository
      .createQueryBuilder('quiz')
      .where({ id })
      .leftJoinAndSelect('quiz.company', 'company')
      .getOne();
  }

  public async checkAccessByRole(email: string, company: Company) {
    const user = await this.usersService.findByEmail(email);

    const action = await this.companyActionsService.findAction(company, user);

    return action && action?.role < 500;
  }

  public async checkAccess(id: string, email: string) {
    const quiz = await this.findQuizById(id);
    const company = await this.companiesService.findCompanyById(
      quiz.company.id,
    );

    if (company.owner.email !== email) {
      const checkedAccess = await this.checkAccessByRole(email, company);
      return checkedAccess;
    }
    return false;
  }

  public async createQuiz(createQuizDto: CreateQuizDto, email: string) {
    if (createQuizDto.company.owner.email !== email) {
      const checkedAccess = await this.checkAccessByRole(
        email,
        createQuizDto.company,
      );
      if (checkedAccess) throw new ForbiddenException('forbiden resours');
    }

    return this.quizRepository.save({ ...createQuizDto });
  }

  public async updateQuiz(
    id: string,
    updateQuizDto: UpdateQuizDto,
    email: string,
  ) {
    const checkedAccess = await this.checkAccess(id, email);
    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizRepository.update({ id }, { ...updateQuizDto });
  }

  public async removeQuiz(id: string, email: string) {
    const checkedAccess = await this.checkAccess(id, email);
    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizRepository.delete({ id });
  }

  public async findCompanyQuizzes(companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);

    return this.quizRepository
      .createQueryBuilder('quiz')
      .where({ company, valid: true })
      .leftJoinAndSelect('quiz.company', 'company')
      .getMany();
  }

  public async findAllCompanyQuizzes(companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);

    return this.quizRepository
      .createQueryBuilder('quiz')
      .where({ company })
      .leftJoinAndSelect('quiz.company', 'company')
      .getMany();
  }

  public async findQuiz(id: string) {
    return this.findQuizById(id);
  }
}
