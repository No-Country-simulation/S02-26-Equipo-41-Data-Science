import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CrearUsuarioValidacion } from './validacion/crear-usuario.validacion';
import { ActualizarUsuarioValidacion } from './validacion/actualizar-usuario.validacion';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      include: {
        rol: true,
        vendedor: true,
      },
    });
  }

  async findOne(usuarioID: number): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuarioID },
      include: {
        rol: true,
        vendedor: true,
      },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async create(datos: CrearUsuarioValidacion): Promise<Usuario> {
    await this.validarRelaciones(datos);

    const existeUsername = await this.prisma.usuario.findUnique({
      where: { username: datos.username },
    });

    if (existeUsername) throw new ConflictException('Username ya existe');

    if (datos.email) {
      const existeEmail = await this.prisma.usuario.findUnique({
        where: { email: datos.email },
      });

      if (existeEmail) throw new ConflictException('Email ya existe');
    }

    return this.prisma.usuario.create({
      data: {
        username: datos.username,
        passwordHash: datos.passwordHash,
        email: datos.email,
        activo: datos.activo ?? true,
        rolID: datos.rolID,
        vendedorID: datos.vendedorID,
      },
      include: {
        rol: true,
        vendedor: true,
      },
    });
  }

  async update(
    usuarioID: number,
    datos: ActualizarUsuarioValidacion,
  ): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuarioID },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.usuario.update({
      where: { usuarioID },
      data: datos as Prisma.UsuarioUpdateInput,
      include: {
        rol: true,
        vendedor: true,
      },
    });
  }

  async remove(usuarioID: number): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuarioID },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.usuario.delete({
      where: { usuarioID },
      include: {
        rol: true,
        vendedor: true,
      },
    });
  }

  private async validarRelaciones(datos: CrearUsuarioValidacion) {
    if (datos.rolID) {
      const rol = await this.prisma.rol.findUnique({
        where: { rolID: datos.rolID },
      });
      if (!rol) throw new NotFoundException('Rol no encontrado');
    }

    if (datos.vendedorID) {
      const vendedor = await this.prisma.vendedor.findUnique({
        where: { vendedorID: datos.vendedorID },
      });
      if (!vendedor) throw new NotFoundException('Vendedor no encontrado');
    }
  }
}
