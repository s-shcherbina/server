import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { Repository } from 'typeorm';
import { QuizElementsService } from 'src/quiz-elements/quiz-elements.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';

@Injectable()
export class QuizAnswersService {
  constructor(
    @InjectRepository(QuizAnswer)
    private readonly quizAnswerRepository: Repository<QuizAnswer>,
    private readonly quizElementsService: QuizElementsService,
    private readonly quizzesService: QuizzesService,
  ) {}

  public async findQuizAnswerById(id: string) {
    return this.quizAnswerRepository
      .createQueryBuilder('answer')
      .where({ id })
      .leftJoinAndSelect('element.answer', 'element')
      .getOne();
  }

  public async checkAccess(id: string, email: string) {
    const answer = await this.findQuizAnswerById(id);
    return this.quizElementsService.checkAccess(answer.element.id, email);
  }

  public async createQuizAnswer(
    createQuizAnswerDto: CreateQuizAnswerDto,
    email: string,
  ) {
    const checkedAccess = await this.quizzesService.checkAccess(
      createQuizAnswerDto.element.quiz.id,
      email,
    );
    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizAnswerRepository.save({ ...createQuizAnswerDto });
  }

  public async findQuizAnswers(quizId: string) {
    const elements = await this.quizElementsService.findQuizElements(quizId);
    const elems = [];
    for (const element of elements) {
      const answerElems = await this.quizAnswerRepository
        .createQueryBuilder('answers')
        .where({ element })
        .leftJoinAndSelect('answers.element', 'element')
        .getMany();

      elems.push({ quest: element, answers: answerElems });
    }
    return elems;
  }

  public async updateQuizAnswer(
    id: string,
    updateAnswerDto: UpdateQuizAnswerDto,
    email: string,
  ) {
    const checkedAccess = await this.checkAccess(id, email);

    if (checkedAccess) throw new ForbiddenException('forbiden resours');

    return this.quizAnswerRepository.update({ id }, { ...updateAnswerDto });
  }

  public async removeQuizAnswer(id: string, email: string) {
    const checkedAccess = await this.checkAccess(id, email);

    if (checkedAccess) throw new ForbiddenException('forbiden resours');

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
