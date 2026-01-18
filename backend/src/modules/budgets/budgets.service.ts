import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByMonth(userId: string, month: number, year: number) {
    return this.prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
    });
  }

  async create(
    userId: string,
    data: { categoryId: string; amount: number; month: number; year: number; alertAt?: number },
  ) {
    // Verificar se já existe orçamento para essa categoria nesse mês
    const existing = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    });

    if (existing) {
      throw new ConflictException('Já existe um orçamento para essa categoria neste mês');
    }

    return this.prisma.budget.create({
      data: {
        ...data,
        userId,
      },
      include: { category: true },
    });
  }

  async update(
    userId: string,
    id: string,
    data: { amount?: number; alertAt?: number },
  ) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return this.prisma.budget.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    await this.prisma.budget.delete({ where: { id } });
    return { message: 'Orçamento deletado com sucesso' };
  }

  async getProgress(userId: string, month: number, year: number) {
    const budgets = await this.findByMonth(userId, month, year);

    // Buscar contas do usuário
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    // Data do início e fim do mês
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Calcular gastos por categoria
    const result = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.prisma.transaction.aggregate({
          where: {
            accountId: { in: accountIds },
            categoryId: budget.categoryId,
            type: 'EXPENSE',
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        });

        const spentAmount = Number(spent._sum.amount || 0);
        const budgetAmount = Number(budget.amount);
        const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
        const remaining = budgetAmount - spentAmount;

        return {
          budgetId: budget.id,
          categoryId: budget.categoryId,
          categoryName: budget.category.name,
          categoryIcon: budget.category.icon,
          categoryColor: budget.category.color,
          budgetAmount,
          spent: spentAmount,
          remaining,
          percentage: Math.round(percentage * 100) / 100,
          isOverBudget: spentAmount > budgetAmount,
        };
      }),
    );

    return result;
  }
}
