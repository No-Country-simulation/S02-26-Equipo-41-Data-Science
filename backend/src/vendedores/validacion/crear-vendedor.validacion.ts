import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CrearVendedorValidacion {
  @IsString()
  @MinLength(2)
  Nombre: string;

  @IsInt()
  @Min(1)
  SucursalID: number;
}

export {};
