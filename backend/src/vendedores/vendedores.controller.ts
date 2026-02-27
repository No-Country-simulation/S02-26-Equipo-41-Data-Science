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
import { VendedoresService } from './vendedores.service';
import { CrearVendedorValidacion } from './validacion/crear-vendedor.validacion';
import { ActualizarVendedorValidacion } from './validacion/actualizar-vendedor.validacion';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly servicio: VendedoresService) {}

  @Get()
  findAll() {
    return this.servicio.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOne(id);
  }

  @Post()
  create(@Body() datos: CrearVendedorValidacion) {
    return this.servicio.create(datos);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarVendedorValidacion,
  ) {
    return this.servicio.update(id, datos);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.remove(id);
  }
}
