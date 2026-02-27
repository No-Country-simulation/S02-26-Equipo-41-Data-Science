import { PartialType } from '@nestjs/mapped-types';
import { CrearSucursalValidacion } from './crear-sucursal.validacion';

export class ActualizarSucursalValidacion extends PartialType(
  CrearSucursalValidacion,
) {}
