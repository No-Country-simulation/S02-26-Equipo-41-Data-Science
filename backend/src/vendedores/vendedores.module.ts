import { Module } from '@nestjs/common';
import { VendedoresController } from './vendedores.controller';
import { VendedoresService } from './vendedores.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [VendedoresController],
  providers: [VendedoresService, PrismaService],
})
export class VendedoresModule {}
