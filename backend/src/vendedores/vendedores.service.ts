import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CrearVendedorValidacion } from './validacion/crear-vendedor.validacion';
import { ActualizarVendedorValidacion } from './validacion/actualizar-vendedor.validacion';
import { Vendedor } from '@prisma/client';

@Injectable()
export class VendedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Vendedor[]> {
    return this.prisma.vendedor.findMany({
      include: { sucursal: true },
    });
  }

  async findOne(vendedorID: number): Promise<Vendedor> {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorID },
      include: { sucursal: true },
    });
    if (!vendedor) throw new NotFoundException('Vendedor no encontrado');
    return vendedor;
  }

  async create(datos: CrearVendedorValidacion): Promise<Vendedor> {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { sucursalID: datos.SucursalID },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');

    return this.prisma.vendedor.create({
      data: {
        nombre: datos.Nombre,
        sucursalID: datos.SucursalID,
      },
      include: { sucursal: true },
    });
  }

  async update(
    vendedorID: number,
    datos: ActualizarVendedorValidacion,
  ): Promise<Vendedor> {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorID },
    });
    if (!vendedor) throw new NotFoundException('Vendedor no encontrado');

    if (datos.SucursalID) {
      const sucursal = await this.prisma.sucursal.findUnique({
        where: { sucursalID: datos.SucursalID },
      });
      if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    }

    return this.prisma.vendedor.update({
      where: { vendedorID },
      data: datos as Prisma.VendedorUpdateInput,
      include: { sucursal: true },
    });
  }

  async remove(vendedorID: number): Promise<Vendedor> {
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorID },
    });
    if (!vendedor) throw new NotFoundException('Vendedor no encontrado');

    return this.prisma.vendedor.delete({
      where: { vendedorID },
      include: { sucursal: true },
    });
  }
}
