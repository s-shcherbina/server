import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuizElementDto } from './dto/create-quiz-element.dto';
import { UpdateQuizElementDto } from './dto/update-quiz-element.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizElement } from './entities/quiz-element.entity';
import { Repository } from 'typeorm';
import { QuizzesService } from 'src/quizzes/quizzes.service';

@Injectable()
export class QuizElementsService {
  constructor(
    @InjectRepository(QuizElement)
    private readonly quizElementRepository: Repository<QuizElement>,
    private readonly quizzesService: QuizzesService,
  ) {}

  public async findQuizElementById(id: string) {
    return this.quizElementRepository
      .createQueryBuilder('element')
      .where({ id })
      .leftJoinAndSelect('quiz.element', 'quiz')
      .getOne();
  }

  public async checkAccess(id: string, email: string) {
    const element = await this.findQuizElementById(id);
    return this.quizzesService.checkAccess(element.quiz.id, email);
  }

  public async createQuizElement(
    createQuizElementDto: CreateQuizElementDto,
    email: string,
  ) {
    const checkedAccess = await this.quizzesService.checkAccess(
      createQuizElementDto.quiz.id,
      email,
    );
    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizElementRepository.save({
      ...createQuizElementDto,
    });
  }

  public async updateQuizElement(
    id: string,
    updateQuizElementDto: UpdateQuizElementDto,
    email: string,
  ) {
    const checkedAccess = await this.checkAccess(id, email);

    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizElementRepository.update(
      { id },
      { ...updateQuizElementDto },
    );
  }

  public async removeQuizElement(id: string, email: string) {
    const checkedAccess = await this.checkAccess(id, email);

    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizElementRepository.delete({ id });
  }

  public async findQuizElements(quizId: string) {
    const quiz = await this.quizzesService.findQuizById(quizId);

    return this.quizElementRepository
      .createQueryBuilder('elements')
      .where({ quiz })
      .leftJoinAndSelect('elements.quiz', 'quiz')
      .getMany();
  }

  public async findQuizElement(id: string) {
    return this.findQuizElementById(id);
  }
}
