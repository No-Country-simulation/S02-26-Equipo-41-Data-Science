import { IsString, MaxLength } from 'class-validator';

export class CrearSucursalValidacion {
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @MaxLength(100)
  ciudad!: string;
}
