import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CrearMarcaValidacion } from './validacion/crear-marca.validacion';
import { ActualizarMarcaValidacion } from './validacion/actualizar-marca.validacion';
import { Marca } from '@prisma/client';

@Injectable()
export class MarcaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Marca[]> {
    return this.prisma.marca.findMany({
      include: {
        productos: true,
      },
    });
  }

  async findOne(marcaID: number): Promise<Marca> {
    const marca = await this.prisma.marca.findUnique({
      where: { marcaID },
      include: {
        productos: true,
      },
    });

    if (!marca) throw new NotFoundException('Marca no encontrada');
    return marca;
  }

  async create(datos: CrearMarcaValidacion): Promise<Marca> {
    return this.prisma.marca.create({
      data: datos,
      include: {
        productos: true,
      },
    });
  }

  async update(
    marcaID: number,
    datos: ActualizarMarcaValidacion,
  ): Promise<Marca> {
    const marca = await this.prisma.marca.findUnique({
      where: { marcaID },
    });

    if (!marca) throw new NotFoundException('Marca no encontrada');

    return this.prisma.marca.update({
      where: { marcaID },
      data: datos,
      include: {
        productos: true,
      },
    });
  }

  async remove(marcaID: number): Promise<Marca> {
    const marca = await this.prisma.marca.findUnique({
      where: { marcaID },
    });

    if (!marca) throw new NotFoundException('Marca no encontrada');

    return this.prisma.marca.delete({
      where: { marcaID },
      include: {
        productos: true,
      },
    });
  }
}
