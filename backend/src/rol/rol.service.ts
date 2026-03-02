import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CrearRolValidacion } from './validacion/crear-rol.validacion';
import { ActualizarRolValidacion } from './validacion/actualizar-rol.validacion';
import { Rol } from '@prisma/client';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Rol[]> {
    return this.prisma.rol.findMany({
      include: {
        usuarios: true,
      },
    });
  }

  async findOne(rolID: number): Promise<Rol> {
    const rol = await this.prisma.rol.findUnique({
      where: { rolID },
      include: {
        usuarios: true,
      },
    });

    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  async create(datos: CrearRolValidacion): Promise<Rol> {
    return this.prisma.rol.create({
      data: datos,
      include: {
        usuarios: true,
      },
    });
  }

  async update(rolID: number, datos: ActualizarRolValidacion): Promise<Rol> {
    const rol = await this.prisma.rol.findUnique({
      where: { rolID },
    });

    if (!rol) throw new NotFoundException('Rol no encontrado');

    return this.prisma.rol.update({
      where: { rolID },
      data: datos,
      include: {
        usuarios: true,
      },
    });
  }

  async remove(rolID: number): Promise<Rol> {
    const rol = await this.prisma.rol.findUnique({
      where: { rolID },
    });

    if (!rol) throw new NotFoundException('Rol no encontrado');

    return this.prisma.rol.delete({
      where: { rolID },
      include: {
        usuarios: true,
      },
    });
  }
}
