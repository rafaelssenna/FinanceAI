import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // Calcular saldo de cada conta
    const accountsWithBalance = await Promise.all(
      accounts.map(async (account) => {
        const balance = await this.calculateBalance(account.id, account.initialBalance);
        return { ...account, balance };
      }),
    );

    return accountsWithBalance;
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    const balance = await this.calculateBalance(account.id, account.initialBalance);
    return { ...account, balance };
  }

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...dto,
        initialBalance: dto.initialBalance || 0,
        userId,
      },
    });
  }

  async update(userId: string, id: string, data: Partial<CreateAccountDto>) {
    await this.findOne(userId, id); // Verifica se existe

    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id); // Verifica se existe

    // Soft delete
    await this.prisma.account.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Conta deletada com sucesso' };
  }

  private async calculateBalance(accountId: string, initialBalance: Prisma.Decimal) {
    const result = await this.prisma.transaction.aggregate({
      where: { accountId },
      _sum: { amount: true },
    });

    // Buscar totais por tipo
    const incomes = await this.prisma.transaction.aggregate({
      where: { accountId, type: 'INCOME' },
      _sum: { amount: true },
    });

    const expenses = await this.prisma.transaction.aggregate({
      where: { accountId, type: 'EXPENSE' },
      _sum: { amount: true },
    });

    const totalIncomes = Number(incomes._sum.amount || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);

    return Number(initialBalance) + totalIncomes - totalExpenses;
  }

  async getTotalBalance(userId: string) {
    const accounts = await this.findAll(userId);
    return accounts.reduce((total, account) => total + account.balance, 0);
  }
}
