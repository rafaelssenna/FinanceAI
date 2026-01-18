import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: 'clxxxxxxxxxx' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 'clxxxxxxxxxx', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ enum: TransactionType, example: 'EXPENSE' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 45.90 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Almoço no restaurante' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Pedido via iFood', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  date: string;
}
