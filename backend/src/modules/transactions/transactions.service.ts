import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(userId: string, filters: FilterTransactionsDto) {
    const { accountId, categoryId, type, startDate, endDate, search, page = 1, limit = 20 } = filters;

    // Buscar contas do usuário para filtrar
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    const where: Prisma.TransactionWhereInput = {
      accountId: accountId ? accountId : { in: accountIds },
    };

    if (categoryId) where.categoryId = categoryId;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return transactions;
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id },
      include: {
        category: true,
        account: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    // Verificar se pertence ao usuário
    const account = await this.prisma.account.findFirst({
      where: { id: transaction.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    // Verificar se a conta pertence ao usuário
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
    });

    if (!account) {
      throw new BadRequestException('Conta não encontrada');
    }

    let categoryId = dto.categoryId;
    let aiCategorized = false;
    let aiConfidence: number | null = null;

    // Se não tiver categoria, usar IA para categorizar
    if (!categoryId) {
      const aiResult = await this.aiService.categorizeTransaction(
        dto.description,
        dto.amount,
        dto.type,
        userId,
      );

      if (aiResult) {
        categoryId = aiResult.categoryId;
        aiCategorized = true;
        aiConfidence = aiResult.confidence;
      }
    }

    // Se ainda não tiver categoria, pegar a "Outros"
    if (!categoryId) {
      const othersCategory = await this.prisma.category.findFirst({
        where: { userId, name: 'Outros', type: dto.type },
      });
      categoryId = othersCategory?.id;
    }

    if (!categoryId) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return this.prisma.transaction.create({
      data: {
        accountId: dto.accountId,
        categoryId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        notes: dto.notes,
        date: new Date(dto.date),
        aiCategorized,
        aiConfidence,
      },
      include: {
        category: true,
        account: true,
      },
    });
  }

  async update(userId: string, id: string, dto: Partial<CreateTransactionDto>) {
    await this.findOne(userId, id); // Verifica se existe

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        category: true,
        account: true,
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id); // Verifica se existe

    await this.prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Transação deletada com sucesso' };
  }

  async getSummary(userId: string, startDate: Date, endDate: Date) {
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    const [incomes, expenses] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          accountId: { in: accountIds },
          type: 'INCOME',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          accountId: { in: accountIds },
          type: 'EXPENSE',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncomes = Number(incomes._sum.amount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);

    return {
      totalIncome: totalIncomes,
      totalExpense: totalExpenses,
      balance: totalIncomes - totalExpenses,
    };
  }

  async getByCategory(userId: string, startDate: Date, endDate: Date) {
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    const result = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        accountId: { in: accountIds },
        type: 'EXPENSE',
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Buscar detalhes das categorias
    const categories = await this.prisma.category.findMany({
      where: { id: { in: result.map((r) => r.categoryId) } },
    });

    // Calcular total para percentuais
    const grandTotal = result.reduce((sum, r) => sum + Number(r._sum.amount || 0), 0);

    return result.map((r) => {
      const category = categories.find((c) => c.id === r.categoryId);
      const total = Number(r._sum.amount || 0);
      return {
        categoryId: r.categoryId,
        categoryName: category?.name || 'Outros',
        categoryIcon: category?.icon || '📦',
        categoryColor: category?.color || '#64748b',
        total,
        percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100 * 100) / 100 : 0,
      };
    });
  }
}
