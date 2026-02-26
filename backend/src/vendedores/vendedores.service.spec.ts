import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';

describe('VendedoresService', () => {
  let service: VendedoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendedoresService],
    }).compile();

    service = module.get<VendedoresService>(VendedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
