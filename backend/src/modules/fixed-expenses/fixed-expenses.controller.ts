import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FixedExpensesService } from './fixed-expenses.service';
import { CreateFixedExpenseDto, UpdateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Fixed Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fixed-expenses')
export class FixedExpensesController {
  constructor(private fixedExpensesService: FixedExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as despesas fixas' })
  async findAll(@CurrentUser() user: User) {
    return this.fixedExpensesService.findAll(user.id);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Listar contas pendentes' })
  async getPendingBills(@CurrentUser() user: User) {
    return this.fixedExpensesService.getPendingBills(user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo das contas para o dashboard' })
  async getSummary(@CurrentUser() user: User) {
    return this.fixedExpensesService.getSummary(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma despesa fixa' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.fixedExpensesService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova despesa fixa' })
  async create(@CurrentUser() user: User, @Body() dto: CreateFixedExpenseDto) {
    return this.fixedExpensesService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar despesa fixa' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateFixedExpenseDto,
  ) {
    return this.fixedExpensesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover despesa fixa' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.fixedExpensesService.delete(user.id, id);
  }

  @Post('bills/:id/pay')
  @ApiOperation({ summary: 'Marcar conta como paga' })
  async payBill(@CurrentUser() user: User, @Param('id') billId: string) {
    return this.fixedExpensesService.payBill(user.id, billId);
  }

  @Post('bills/:id/skip')
  @ApiOperation({ summary: 'Pular pagamento da conta' })
  async skipBill(@CurrentUser() user: User, @Param('id') billId: string) {
    await this.fixedExpensesService.skipBill(user.id, billId);
    return { message: 'Conta pulada com sucesso' };
  }
}
