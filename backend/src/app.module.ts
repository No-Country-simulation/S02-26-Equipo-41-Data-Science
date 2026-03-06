import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { VentasModule } from './ventas/ventas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolModule } from './rol/rol.module';
import { MarcaModule } from './marca/marca.module';

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
    VentasModule,
    UsuariosModule,
    RolModule,
    MarcaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
