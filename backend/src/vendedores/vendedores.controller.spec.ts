import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresController } from './vendedores.controller';

describe('VendedoresController', () => {
  let controller: VendedoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendedoresController],
    }).compile();

    controller = module.get<VendedoresController>(VendedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
