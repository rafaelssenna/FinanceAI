import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os orçamentos' })
  async findAll(@CurrentUser() user: User) {
    return this.budgetsService.findAll(user.id);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Progresso dos orçamentos do mês' })
  async getProgress(
    @CurrentUser() user: User,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const now = new Date();
    const m = month ? parseInt(month) : now.getMonth() + 1;
    const y = year ? parseInt(year) : now.getFullYear();
    return this.budgetsService.getProgress(user.id, m, y);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo orçamento' })
  async create(
    @CurrentUser() user: User,
    @Body() data: { categoryId: string; amount: number; month: number; year: number; alertAt?: number },
  ) {
    return this.budgetsService.create(user.id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar orçamento' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: { amount?: number; alertAt?: number },
  ) {
    return this.budgetsService.update(user.id, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar orçamento' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.budgetsService.delete(user.id, id);
  }
}
