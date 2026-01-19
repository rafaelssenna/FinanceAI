import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

interface IncomeConfigDto {
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'daily';
  amount: number;
  accountId?: string; // Agora é opcional - usa a primeira conta se não informado
  monthlyType?: 'business_day' | 'fixed_day';
  businessDay?: number;
  fixedDay?: number;
  biweeklyType?: 'advance_salary' | 'fixed_days';
  advanceDay?: number;
  salaryBusinessDay?: number;
  day1?: number;
  day2?: number;
  weekDay?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        locale: true,
        plan: true,
        createdAt: true,
        onboardingCompleted: true,
      },
    });
  }

  async update(id: string, data: { name?: string; avatar?: string; currency?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        locale: true,
        plan: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: 'Conta deletada com sucesso' };
  }

  async setIncomeConfig(userId: string, data: IncomeConfigDto) {
    const { frequency, amount, accountId: providedAccountId, ...rest } = data;

    // Se não informou conta, usa a primeira conta ativa do usuário
    let accountId = providedAccountId;
    if (!accountId) {
      const firstAccount = await this.prisma.account.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'asc' },
      });

      if (!firstAccount) {
        throw new Error('Nenhuma conta encontrada. Crie uma conta primeiro.');
      }

      accountId = firstAccount.id;
    }

    // Monta o config JSON baseado na frequência
    let config: any = {};

    if (frequency === 'monthly') {
      config = {
        monthlyType: rest.monthlyType,
        businessDay: rest.businessDay,
        fixedDay: rest.fixedDay,
      };
    } else if (frequency === 'biweekly') {
      config = {
        biweeklyType: rest.biweeklyType,
        advanceDay: rest.advanceDay,
        salaryBusinessDay: rest.salaryBusinessDay,
        day1: rest.day1,
        day2: rest.day2,
      };
    } else if (frequency === 'weekly') {
      config = {
        weekDay: rest.weekDay,
      };
    }

    // Upsert: cria ou atualiza
    const incomeConfig = await this.prisma.incomeConfig.upsert({
      where: { userId },
      update: {
        amount,
        accountId,
        frequency,
        config,
      },
      create: {
        userId,
        amount,
        accountId,
        frequency,
        config,
      },
    });

    // Marca onboarding como completo
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });

    return incomeConfig;
  }

  async getIncomeConfig(userId: string) {
    return this.prisma.incomeConfig.findUnique({
      where: { userId },
    });
  }
}
