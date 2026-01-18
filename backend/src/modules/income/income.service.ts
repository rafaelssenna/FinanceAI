import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

interface IncomeConfig {
  id: string;
  userId: string;
  amount: Decimal;
  accountId: string;
  frequency: string;
  config: any;
  isActive: boolean;
}

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula as proximas datas de recebimento baseado na configuracao
   */
  getNextIncomeDates(config: IncomeConfig, count: number = 3): Date[] {
    const dates: Date[] = [];
    const now = new Date();
    const { frequency, config: freqConfig } = config;

    if (frequency === 'monthly') {
      dates.push(...this.getMonthlyDates(freqConfig, now, count));
    } else if (frequency === 'biweekly') {
      dates.push(...this.getBiweeklyDates(freqConfig, now, count));
    } else if (frequency === 'weekly') {
      dates.push(...this.getWeeklyDates(freqConfig, now, count));
    } else if (frequency === 'daily') {
      dates.push(...this.getDailyDates(now, count));
    }

    return dates.sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
  }

  private getMonthlyDates(config: any, startDate: Date, count: number): Date[] {
    const dates: Date[] = [];
    const today = new Date(startDate);

    for (let i = 0; i < count + 2; i++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      let date: Date | null = null;

      if (config.monthlyType === 'business_day') {
        date = this.getNthBusinessDay(targetMonth, config.businessDay || 5);
      } else if (config.monthlyType === 'fixed_day') {
        const fixedDay = config.fixedDay || 5;
        const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
        date = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(fixedDay, lastDay));
      }

      if (date && date >= today) {
        dates.push(date);
      }
    }

    return dates.slice(0, count);
  }

  private getBiweeklyDates(config: any, startDate: Date, count: number): Date[] {
    const dates: Date[] = [];
    const today = new Date(startDate);

    for (let i = 0; i < Math.ceil(count / 2) + 2; i++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);

      if (config.biweeklyType === 'advance_salary') {
        // Adiantamento (dia fixo) + Salario (dia util)
        const advanceDay = config.advanceDay || 15;
        const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
        const advanceDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(advanceDay, lastDay));

        const salaryDate = this.getNthBusinessDay(targetMonth, config.salaryBusinessDay || 5);

        if (advanceDate >= today) dates.push(advanceDate);
        if (salaryDate >= today) dates.push(salaryDate);
      } else if (config.biweeklyType === 'fixed_days') {
        // Dois dias fixos
        const day1 = config.day1 || 5;
        const day2 = config.day2 || 20;
        const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();

        const date1 = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(day1, lastDay));
        const date2 = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(day2, lastDay));

        if (date1 >= today) dates.push(date1);
        if (date2 >= today) dates.push(date2);
      }
    }

    return dates.sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
  }

  private getWeeklyDates(config: any, startDate: Date, count: number): Date[] {
    const dates: Date[] = [];
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };

    const targetDay = dayMap[config.weekDay] ?? 5; // Default sexta
    const today = new Date(startDate);
    const current = new Date(today);

    // Encontra o proximo dia da semana
    const daysUntilTarget = (targetDay - current.getDay() + 7) % 7;
    current.setDate(current.getDate() + (daysUntilTarget === 0 ? 0 : daysUntilTarget));

    for (let i = 0; i < count; i++) {
      const nextDate = new Date(current);
      nextDate.setDate(current.getDate() + i * 7);
      if (nextDate >= today) {
        dates.push(nextDate);
      }
    }

    return dates.slice(0, count);
  }

  private getDailyDates(startDate: Date, count: number): Date[] {
    const dates: Date[] = [];
    const today = new Date(startDate);
    const current = new Date(today);

    while (dates.length < count) {
      if (this.isBusinessDay(current)) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Retorna o N-esimo dia util do mes
   * Se n = -1, retorna o ultimo dia util
   */
  private getNthBusinessDay(month: Date, n: number): Date {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    if (n === -1) {
      // Ultimo dia util
      const lastDay = new Date(year, monthIndex + 1, 0);
      while (!this.isBusinessDay(lastDay)) {
        lastDay.setDate(lastDay.getDate() - 1);
      }
      return lastDay;
    }

    let count = 0;
    const current = new Date(year, monthIndex, 1);

    while (count < n) {
      if (this.isBusinessDay(current)) {
        count++;
        if (count === n) break;
      }
      current.setDate(current.getDate() + 1);
    }

    return current;
  }

  private isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    // Considera apenas sabado e domingo como nao uteis
    // Feriados seriam tratados em uma versao futura
    return day !== 0 && day !== 6;
  }

  /**
   * Gera entradas pendentes para os proximos recebimentos
   */
  async generatePendingIncomes(userId: string): Promise<void> {
    const incomeConfig = await this.prisma.incomeConfig.findUnique({
      where: { userId },
    });

    if (!incomeConfig || !incomeConfig.isActive) return;

    const nextDates = this.getNextIncomeDates(incomeConfig as IncomeConfig, 6);

    for (const expectedDate of nextDates) {
      // Verifica se ja existe uma entrada para essa data
      const existingIncome = await this.prisma.pendingIncome.findFirst({
        where: {
          userId,
          incomeConfigId: incomeConfig.id,
          expectedDate: {
            gte: new Date(expectedDate.getFullYear(), expectedDate.getMonth(), expectedDate.getDate()),
            lt: new Date(expectedDate.getFullYear(), expectedDate.getMonth(), expectedDate.getDate() + 1),
          },
        },
      });

      if (!existingIncome) {
        await this.prisma.pendingIncome.create({
          data: {
            userId,
            incomeConfigId: incomeConfig.id,
            amount: incomeConfig.amount,
            accountId: incomeConfig.accountId,
            expectedDate,
            status: 'PENDING',
          },
        });
      }
    }
  }

  /**
   * Confirma um recebimento e cria a transacao
   */
  async confirmIncome(userId: string, pendingIncomeId: string): Promise<any> {
    const pendingIncome = await this.prisma.pendingIncome.findFirst({
      where: { id: pendingIncomeId, userId },
    });

    if (!pendingIncome || pendingIncome.status !== 'PENDING') {
      throw new Error('Receita pendente nao encontrada');
    }

    // Busca a categoria de Salario
    const salaryCategory = await this.prisma.category.findFirst({
      where: {
        userId,
        name: 'Salario',
        type: 'INCOME',
      },
    });

    if (!salaryCategory) {
      throw new Error('Categoria de salario nao encontrada');
    }

    // Cria a transacao
    const transaction = await this.prisma.transaction.create({
      data: {
        accountId: pendingIncome.accountId,
        categoryId: salaryCategory.id,
        type: 'INCOME',
        amount: pendingIncome.amount,
        description: 'Salario/Renda',
        date: new Date(),
        isRecurring: true,
      },
    });

    // Atualiza o pendingIncome
    await this.prisma.pendingIncome.update({
      where: { id: pendingIncomeId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        transactionId: transaction.id,
      },
    });

    return transaction;
  }

  /**
   * Pula um recebimento
   */
  async skipIncome(userId: string, pendingIncomeId: string): Promise<void> {
    await this.prisma.pendingIncome.updateMany({
      where: { id: pendingIncomeId, userId },
      data: { status: 'SKIPPED' },
    });
  }

  /**
   * Lista receitas pendentes do usuario
   */
  async getPendingIncomes(userId: string) {
    // Gera pendencias se necessario
    await this.generatePendingIncomes(userId);

    return this.prisma.pendingIncome.findMany({
      where: {
        userId,
        status: 'PENDING',
        expectedDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      orderBy: { expectedDate: 'asc' },
      take: 10,
    });
  }

  /**
   * Retorna resumo de receitas para o dashboard
   */
  async getIncomeSummary(userId: string) {
    const incomeConfig = await this.prisma.incomeConfig.findUnique({
      where: { userId },
    });

    if (!incomeConfig) return null;

    const pendingIncomes = await this.getPendingIncomes(userId);
    const nextDates = this.getNextIncomeDates(incomeConfig as IncomeConfig, 3);

    return {
      monthlyIncome: Number(incomeConfig.amount),
      frequency: incomeConfig.frequency,
      nextPaymentDate: nextDates[0] || null,
      pendingIncomes: pendingIncomes.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        expectedDate: p.expectedDate,
        status: p.status,
      })),
    };
  }
}
