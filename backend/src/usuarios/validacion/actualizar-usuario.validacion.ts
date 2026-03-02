import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ActualizarUsuarioValidacion {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  rolID?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  vendedorID?: number;
}
