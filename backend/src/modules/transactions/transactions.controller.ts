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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar transações com filtros' })
  async findAll(@CurrentUser() user: User, @Query() filters: FilterTransactionsDto) {
    return this.transactionsService.findAll(user.id, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo do período (receitas, despesas, saldo)' })
  async getSummary(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.transactionsService.getSummary(user.id, start, end);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Gastos agrupados por categoria' })
  async getByCategory(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.transactionsService.getByCategory(user.id, start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma transação' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova transação (IA categoriza automaticamente)' })
  async create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTransactionDto>,
  ) {
    return this.transactionsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar transação' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.delete(user.id, id);
  }
}
