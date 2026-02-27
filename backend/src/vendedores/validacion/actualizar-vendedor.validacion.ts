import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ActualizarVendedorValidacion {
  @IsOptional()
  @IsString()
  @MinLength(2)
  Nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SucursalID?: number;
}

export {};
