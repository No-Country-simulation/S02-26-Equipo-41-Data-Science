import { Module } from '@nestjs/common';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';

@Module({
  controllers: [SucursalesController],
  providers: [SucursalesService],
})
export class SucursalesModule {}
