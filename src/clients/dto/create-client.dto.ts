import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClientType } from '../../common/enums/client-type.enum';
import { University } from '../../common/enums/university.enum';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  @IsEnum(ClientType)
  @Transform(({ value }) => value?.trim())
  clientType: ClientType;

  @IsNotEmpty()
  @IsEnum(University)
  @Transform(({ value }) => value?.trim())
  university: University;
}