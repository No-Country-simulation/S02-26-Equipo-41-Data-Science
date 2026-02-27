import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CrearVentaValidacion } from './validacion/crear-venta.validacion';
import { ActualizarVentaValidacion } from './validacion/actualizar-venta.validacion';
import { Venta } from '@prisma/client';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      include: {
        sucursal: true,
        vendedor: true,
        cliente: true,
        metodoPago: true,
        tiempo: true,
        detalles: {
          include: { variante: true },
        },
      },
    });
  }

  async findOne(ventaID: number): Promise<Venta> {
    const venta = await this.prisma.venta.findUnique({
      where: { ventaID },
      include: {
        sucursal: true,
        vendedor: true,
        cliente: true,
        metodoPago: true,
        tiempo: true,
        detalles: {
          include: { variante: true },
        },
      },
    });

    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async create(datos: CrearVentaValidacion): Promise<Venta> {
    await this.validarRelaciones(datos);

    return this.prisma.venta.create({
      data: {
        sucursalID: datos.SucursalID,
        vendedorID: datos.VendedorID,
        clienteID: datos.ClienteID,
        metodoPagoID: datos.MetodoPagoID,
        tiempoID: datos.TiempoID,
        hora: datos.Hora,
        totalVenta: datos.TotalVenta,
      },
      include: {
        sucursal: true,
        vendedor: true,
        cliente: true,
        metodoPago: true,
        tiempo: true,
      },
    });
  }

  async update(
    ventaID: number,
    datos: ActualizarVentaValidacion,
  ): Promise<Venta> {
    const venta = await this.prisma.venta.findUnique({
      where: { ventaID },
    });

    if (!venta) throw new NotFoundException('Venta no encontrada');

    return this.prisma.venta.update({
      where: { ventaID },
      data: datos as Prisma.VentaUpdateInput,
      include: {
        sucursal: true,
        vendedor: true,
        cliente: true,
        metodoPago: true,
        tiempo: true,
      },
    });
  }

  async remove(ventaID: number): Promise<Venta> {
    const venta = await this.prisma.venta.findUnique({
      where: { ventaID },
    });

    if (!venta) throw new NotFoundException('Venta no encontrada');

    return this.prisma.venta.delete({
      where: { ventaID },
      include: {
        sucursal: true,
        vendedor: true,
        cliente: true,
        metodoPago: true,
        tiempo: true,
      },
    });
  }

  private async validarRelaciones(datos: CrearVentaValidacion) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { sucursalID: datos.SucursalID },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');

    const vendedor = await this.prisma.vendedor.findUnique({
      where: { vendedorID: datos.VendedorID },
    });
    if (!vendedor) throw new NotFoundException('Vendedor no encontrado');

    const cliente = await this.prisma.cliente.findUnique({
      where: { clienteID: datos.ClienteID },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const metodoPago = await this.prisma.metodoPago.findUnique({
      where: { metodoPagoID: datos.MetodoPagoID },
    });
    if (!metodoPago)
      throw new NotFoundException('Método de pago no encontrado');

    const tiempo = await this.prisma.tiempo.findUnique({
      where: { tiempoID: datos.TiempoID },
    });
    if (!tiempo) throw new NotFoundException('Tiempo no encontrado');
  }
}
