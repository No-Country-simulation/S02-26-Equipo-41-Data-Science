import { IsOptional, IsString } from 'class-validator';

export class ActualizarRolValidacion {
  @IsString()
  @IsOptional()
  nombre?: string;
}
