import { IsNotEmpty, IsString } from 'class-validator';

export class CrearMarcaValidacion {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
