import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { VendedoresModule } from './vendedores/vendedores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    SucursalesModule,
    VendedoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
