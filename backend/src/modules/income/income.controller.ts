import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IncomeService } from './income.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Income')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Listar receitas pendentes' })
  async getPendingIncomes(@CurrentUser() user: User) {
    return this.incomeService.getPendingIncomes(user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo de receitas para dashboard' })
  async getIncomeSummary(@CurrentUser() user: User) {
    return this.incomeService.getIncomeSummary(user.id);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar recebimento' })
  async confirmIncome(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.incomeService.confirmIncome(user.id, id);
  }

  @Post(':id/skip')
  @ApiOperation({ summary: 'Pular recebimento' })
  async skipIncome(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    await this.incomeService.skipIncome(user.id, id);
    return { message: 'Receita marcada como pulada' };
  }
}
