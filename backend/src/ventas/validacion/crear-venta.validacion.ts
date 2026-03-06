import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CrearVentaValidacion {
  @IsInt()
  @Min(1)
  SucursalID: number;

  @IsInt()
  @Min(1)
  VendedorID: number;

  @IsInt()
  @Min(1)
  ClienteID: number;

  @IsInt()
  @Min(1)
  MetodoPagoID: number;

  @IsInt()
  @Min(1)
  TiempoID: number;

  @IsDateString()
  Hora: Date;

  @IsNumber()
  @Min(0)
  TotalVenta: number;
}
