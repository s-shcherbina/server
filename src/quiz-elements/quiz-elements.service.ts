import { Injectable } from '@nestjs/common';
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
    return this.quizElementRepository.findOneBy({ id });
  }

  public async checkAccess(email: string, quizId: string) {
    const quiz = await this.quizzesService.findQuizById(quizId);
    return this.quizzesService.checkAccess(email, quiz.company.id);
  }

  public async createQuizElement(
    quizId: string,
    createQuizElementDto: CreateQuizElementDto,
    email: string,
  ) {
    this.checkAccess(email, quizId);

    return this.quizElementRepository.save({
      ...createQuizElementDto,
    });
  }

  public async updateQuizElement(
    id: string,
    updateQuizElementDto: UpdateQuizElementDto,
    email: string,
  ) {
    this.checkAccess(email, id);

    return this.quizElementRepository.update(
      { id },
      { ...updateQuizElementDto },
    );
  }

  public async removeQuizElement(id: string, email: string) {
    this.checkAccess(email, id);

    return this.quizElementRepository.delete({ id });
  }

  public async findAllQuizElements(quizId: string) {
    const quiz = await this.quizzesService.findQuizById(quizId);

    return this.quizElementRepository.find({ where: { quiz } });
  }

  public async findQuizElement(id: string) {
    return this.quizElementRepository.findOneBy({ id });
  }
}
