import { Test, TestingModule } from '@nestjs/testing';
import { CompanyActionsController } from './company-actions.controller';
import { CompanyActionsService } from './company-actions.service';

describe('CompanyActionsController', () => {
  let controller: CompanyActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyActionsController],
      providers: [CompanyActionsService],
    }).compile();

    controller = module.get<CompanyActionsController>(CompanyActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
