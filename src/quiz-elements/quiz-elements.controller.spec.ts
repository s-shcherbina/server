import { Test, TestingModule } from '@nestjs/testing';
import { QuizElementsController } from './quiz-elements.controller';
import { QuizElementsService } from './quiz-elements.service';

describe('QuizElementsController', () => {
  let controller: QuizElementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizElementsController],
      providers: [QuizElementsService],
    }).compile();

    controller = module.get<QuizElementsController>(QuizElementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
