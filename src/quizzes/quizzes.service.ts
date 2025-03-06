import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { CompanyActionsService } from 'src/company-actions/company-actions.service';
import { QuizResponse } from './response';

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
    return this.quizRepository.findOneBy({ id });
  }

  public async checkAccess(email: string, companyId: string) {
    const user = await this.usersService.findByEmail(email);
    const company = await this.companiesService.findCompanyById(companyId);
    // const role = await this.companyActionsService.findUserCompanyRole(
    //   user,
    //   company,
    // );
    // if (!role || role < 500 || company.owner != user)
    //   console.log(role, company.owner, user);
    // throw new ForbiddenException('forbiden resours');
    return this.companiesService.checkAccess(companyId, email);
  }

  public async createQuiz(
    companyId: string,
    createQuizDto: CreateQuizDto,
    email: string,
  ) {
    await this.checkAccess(email, companyId);
    return this.quizRepository.save({ ...createQuizDto });
  }

  public async updateQuiz(
    id: string,
    updateQuizDto: UpdateQuizDto,
    email: string,
  ) {
    const quiz = await this.quizRepository.findOneBy({ id });
    await this.checkAccess(email, quiz.company.id);
    return this.quizRepository.update({ id }, { ...updateQuizDto });
  }

  public async removeQuiz(id: string, email: string) {
    const quiz = await this.quizRepository.findOneBy({ id });
    await this.checkAccess(email, quiz.company.id);
    return this.quizRepository.delete({ id });
  }

  public async findAllCompanyQuizzes(companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);
    return this.quizRepository.find({ where: { company } });
  }

  public async findQuiz(id: string) {
    return this.quizRepository.findOneBy({ id });
  }
}
