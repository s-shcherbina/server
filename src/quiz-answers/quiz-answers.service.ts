import { Injectable } from '@nestjs/common';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { Repository } from 'typeorm';
import { QuizElementsService } from 'src/quiz-elements/quiz-elements.service';

@Injectable()
export class QuizAnswersService {
  constructor(
    @InjectRepository(QuizAnswer)
    private readonly quizAnswerRepository: Repository<QuizAnswer>,
    private readonly quizElementsService: QuizElementsService,
  ) {}
  public async checkAccess(email: string, elementId: string) {
    const quizElement =
      await this.quizElementsService.findQuizElementById(elementId);
    return this.quizElementsService.checkAccess(email, quizElement.quiz.id);
  }

  public async createQuizAnswer(
    elementId: string,
    createQuizAnswerDto: CreateQuizAnswerDto,
    email: string,
  ) {
    this.checkAccess(email, elementId);

    return this.quizAnswerRepository.save({ ...createQuizAnswerDto });
  }

  public async updateQuizAnswer(
    id: string,
    updateAnswerDto: UpdateQuizAnswerDto,
    email: string,
  ) {
    this.checkAccess(email, id);

    return this.quizAnswerRepository.update({ id }, { ...updateAnswerDto });
  }

  public async removeQuizAnswer(id: string, email: string) {
    this.checkAccess(email, id);

    return this.quizAnswerRepository.delete({ id });
  }

  public async findQuizAnswer(id: string) {
    return this.quizAnswerRepository.findOneBy({ id });
  }

  public async findAllQuizAnswers(elementId: string) {
    const element =
      await this.quizElementsService.findQuizElementById(elementId);

    return this.quizAnswerRepository.find({ where: { element } });
  }
}
