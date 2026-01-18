import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({ example: 'Nubank' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AccountType, example: 'CHECKING' })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({ example: '#6366f1', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: '🏦', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  initialBalance?: number;
}
