import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService],
})
export class UsuariosModule {}
