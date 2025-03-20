import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizResult } from './entities/quiz-result.entity';
import { Repository } from 'typeorm';
import { CompanyActionsService } from 'src/company-actions/company-actions.service';
import { User } from 'src/users/entities/user.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { UsersService } from 'src/users/users.service';
import { Company } from 'src/companies/entities/company.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';

@Injectable()
export class QuizResultsService {
  constructor(
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    private readonly companyActionService: CompanyActionsService,
    private readonly quizzesService: QuizzesService,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  public async findMemberQuizResults(user: User, company: Company) {
    return this.quizResultRepository
      .createQueryBuilder('quiz_result')
      .where({ company, user })
      .leftJoinAndSelect('quiz_result.company', 'company')
      .leftJoin('quiz_result.user', 'user')
      .addSelect(this.companyActionService.select())
      .orderBy('quiz_result.created_at', 'DESC')
      .getMany();
  }

  public async findUserQuizResults(user: User) {
    return this.quizResultRepository
      .createQueryBuilder('quiz_result')
      .where({ user })
      .leftJoin('quiz_result.user', 'user')
      .addSelect(this.companyActionService.select())
      .orderBy('quiz_result.created_at', 'DESC')
      .getMany();
  }

  public async checkAccess(company: Company, user: User) {
    const action = await this.companyActionService.findAction(company, user);
    return action && action.role < 100;
  }

  public async create(createQuizResultDto: CreateQuizResultDto, email: string) {
    const user = await this.usersService.findByEmail(email);
    const company = await this.companiesService.findCompanyById(
      createQuizResultDto.quiz.company.id,
    );

    const action = await this.companyActionService.findAction(company, user);

    if ((action && action.role < 100) || company.owner.email !== email)
      throw new ForbiddenException('Forbidden recource');

    const memberQuizResults = await this.findMemberQuizResults(
      user,
      createQuizResultDto.quiz.company,
    );

    const userQuizResults = await this.findUserQuizResults(user);

    let memberQuestions = createQuizResultDto.questions,
      memberCorrectAnswers = createQuizResultDto.correctAnswers,
      userQuestions = createQuizResultDto.questions,
      userCorrectAnswers = createQuizResultDto.correctAnswers;

    if (memberQuizResults.length) {
      memberQuestions += memberQuizResults[0].memberQuestions;
      memberCorrectAnswers += memberQuizResults[0].memberCorrectAnswers;
    }

    if (userQuizResults.length) {
      userQuestions += userQuizResults[0].userQuestions;
      userCorrectAnswers += userQuizResults[0].userCorrectAnswers;
    }

    if (action)
      await this.companyActionService.updateRating(
        action.id,
        memberCorrectAnswers / memberQuestions,
      );

    await this.usersService.updateRating(
      user.id,
      userCorrectAnswers / userQuestions,
    );

    return this.quizResultRepository.save({
      ...createQuizResultDto,
      user,
      company: createQuizResultDto.quiz.company,
      memberQuestions,
      memberCorrectAnswers,
      userQuestions,
      userCorrectAnswers,
    });
  }

  public async findQuizResults(quizId: string, email: string) {
    const quiz = await this.quizzesService.findQuizById(quizId);
    const user = await this.usersService.findByEmail(email);

    const checkedAccess = await this.checkAccess(quiz.company, user);

    if (checkedAccess) throw new ForbiddenException('Forbidden recource');

    return this.quizResultRepository
      .createQueryBuilder('quiz_results')
      .where('quiz_results.quiz')
      .leftJoinAndSelect('quiz_results.quiz', 'quiz')
      .getMany();
  }

  public async findCompanyQuizResults(companyId: string, email: string) {
    const user = await this.usersService.findByEmail(email);
    const company = await this.companiesService.findCompanyById(companyId);

    const checkedAccess = await this.checkAccess(company, user);

    if (checkedAccess) throw new ForbiddenException('Forbidden recource');

    return this.findMemberQuizResults(user, company);
  }

  public async findUserResults(email: string) {
    const user = await this.usersService.findByEmail(email);
    return this.findUserQuizResults(user);
  }
}
