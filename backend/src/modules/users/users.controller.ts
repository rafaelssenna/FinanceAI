import { Controller, Get, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

interface IncomeConfigDto {
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'daily';
  amount: number;
  accountId: string;
  // Mensal
  monthlyType?: 'business_day' | 'fixed_day';
  businessDay?: number;
  fixedDay?: number;
  // Quinzenal
  biweeklyType?: 'advance_salary' | 'fixed_days';
  advanceDay?: number;
  salaryBusinessDay?: number;
  day1?: number;
  day2?: number;
  // Semanal
  weekDay?: string;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() data: { name?: string; avatar?: string; currency?: string },
  ) {
    return this.usersService.update(user.id, data);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Deletar conta (LGPD)' })
  async deleteAccount(@CurrentUser() user: User) {
    return this.usersService.delete(user.id);
  }

  @Post('income-config')
  @ApiOperation({ summary: 'Configurar renda recorrente' })
  async setIncomeConfig(
    @CurrentUser() user: User,
    @Body() data: IncomeConfigDto,
  ) {
    return this.usersService.setIncomeConfig(user.id, data);
  }

  @Get('income-config')
  @ApiOperation({ summary: 'Obter configuração de renda' })
  async getIncomeConfig(@CurrentUser() user: User) {
    return this.usersService.getIncomeConfig(user.id);
  }
}
