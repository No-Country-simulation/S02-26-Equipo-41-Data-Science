import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresController } from './vendedores.controller';
import { VendedoresService } from './vendedores.service'; // Importa el servicio
import { PrismaService } from '../database/prisma.service'; // Importa Prisma

describe('VendedoresController', () => {
  let controller: VendedoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendedoresController],
      providers: [VendedoresService, PrismaService], // Agrega ambos aquí
    }).compile();

    controller = module.get<VendedoresController>(VendedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
