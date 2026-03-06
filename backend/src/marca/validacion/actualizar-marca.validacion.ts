import { IsOptional, IsString } from 'class-validator';

export class ActualizarMarcaValidacion {
  @IsString()
  @IsOptional()
  nombre?: string;
}
