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
import { VentasService } from './ventas.service';
import { CrearVentaValidacion } from './validacion/crear-venta.validacion';
import { ActualizarVentaValidacion } from './validacion/actualizar-venta.validacion';

@Controller('ventas')
export class VentasController {
  constructor(private readonly servicio: VentasService) {}

  @Get()
  findAll() {
    return this.servicio.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOne(id);
  }

  @Post()
  create(@Body() datos: CrearVentaValidacion) {
    return this.servicio.create(datos);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarVentaValidacion,
  ) {
    return this.servicio.update(id, datos);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.remove(id);
  }
}
