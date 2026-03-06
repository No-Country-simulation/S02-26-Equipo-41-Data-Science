import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class ActualizarVentaValidacion {
  @IsOptional()
  @IsInt()
  @Min(1)
  SucursalID?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  VendedorID?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ClienteID?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  MetodoPagoID?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  TiempoID?: number;

  @IsOptional()
  @IsDateString()
  Hora?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  TotalVenta?: number;
}
