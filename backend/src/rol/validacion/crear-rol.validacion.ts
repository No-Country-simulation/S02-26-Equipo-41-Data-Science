import { IsNotEmpty, IsString } from 'class-validator';

export class CrearRolValidacion {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
