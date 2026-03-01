import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CrearMarcaValidacion } from './validacion/crear-marca.validacion';
import { ActualizarMarcaValidacion } from './validacion/actualizar-marca.validacion';

@Controller('marcas')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marcaService.findOne(id);
  }

  @Post()
  create(@Body() datos: CrearMarcaValidacion) {
    return this.marcaService.create(datos);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarMarcaValidacion,
  ) {
    return this.marcaService.update(id, datos);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.marcaService.remove(id);
  }
}
