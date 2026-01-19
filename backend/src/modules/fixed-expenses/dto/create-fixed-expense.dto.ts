import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFixedExpenseDto {
  @ApiProperty({ example: 'Aluguel', description: 'Nome da despesa fixa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1500, description: 'Valor mensal' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 5, description: 'Dia do vencimento (1-31)' })
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @ApiProperty({ description: 'ID da categoria' })
  @IsString()
  categoryId: string;
}

export class UpdateFixedExpenseDto {
  @ApiProperty({ example: 'Aluguel', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 1500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive?: boolean;
}
