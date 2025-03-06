import { Test, TestingModule } from '@nestjs/testing';
import { QuizElementsService } from './quiz-elements.service';

describe('QuizElementsService', () => {
  let service: QuizElementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizElementsService],
    }).compile();

    service = module.get<QuizElementsService>(QuizElementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
