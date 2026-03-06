import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, PrismaService],
})
export class MarcaModule {}
