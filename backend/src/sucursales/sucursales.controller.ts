import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CrearSucursalValidacion } from './validacion/crear-sucursal.validacion';
import { ActualizarSucursalValidacion } from './validacion/actualizar-sucursal.validacion';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly servicio: SucursalesService) {}

  @Get()
  findAll() {
    return this.servicio.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOne(id);
  }

  @Post()
  create(@Body() datos: CrearSucursalValidacion) {
    return this.servicio.create(datos);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarSucursalValidacion,
  ) {
    return this.servicio.update(id, datos);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.remove(id);
  }
}
