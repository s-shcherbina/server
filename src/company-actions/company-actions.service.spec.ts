import { Test, TestingModule } from '@nestjs/testing';
import { CompanyActionsService } from './company-actions.service';

describe('CompanyActionsService', () => {
  let service: CompanyActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyActionsService],
    }).compile();

    service = module.get<CompanyActionsService>(CompanyActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
