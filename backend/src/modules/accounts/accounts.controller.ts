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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas' })
  async findAll(@CurrentUser() user: User) {
    return this.accountsService.findAll(user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Obter saldo total' })
  async getTotalBalance(@CurrentUser() user: User) {
    const balance = await this.accountsService.getTotalBalance(user.id);
    return { balance };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma conta' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.accountsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova conta' })
  async create(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar conta' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAccountDto>,
  ) {
    return this.accountsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar conta' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.accountsService.delete(user.id, id);
  }
}
