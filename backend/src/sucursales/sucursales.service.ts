import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CrearSucursalValidacion } from './validacion/crear-sucursal.validacion';
import { ActualizarSucursalValidacion } from './validacion/actualizar-sucursal.validacion';

@Injectable()
export class SucursalesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sucursal.findMany({
      orderBy: { sucursalID: 'asc' },
    });
  }

  async findOne(id: number) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { sucursalID: id },
    });

    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    return sucursal;
  }

  create(datos: CrearSucursalValidacion) {
    return this.prisma.sucursal.create({
      data: datos as Prisma.SucursalCreateInput,
    });
  }

  async update(id: number, datos: ActualizarSucursalValidacion) {
    await this.findOne(id);

    return this.prisma.sucursal.update({
      where: { sucursalID: id },
      data: datos as Prisma.SucursalCreateInput,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.sucursal.delete({
      where: { sucursalID: id },
    });
  }
}
