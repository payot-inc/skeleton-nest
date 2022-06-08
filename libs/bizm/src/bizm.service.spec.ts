import { Test, TestingModule } from '@nestjs/testing';
import { BizmService } from './bizm.service';

describe('BizmService', () => {
  let service: BizmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BizmService],
    }).compile();

    service = module.get<BizmService>(BizmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
