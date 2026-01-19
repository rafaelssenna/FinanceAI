import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFixedExpenseDto, UpdateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FixedExpensesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista todas as despesas fixas do usuário
   */
  async findAll(userId: string) {
    return this.prisma.fixedExpense.findMany({
      where: { userId, isActive: true },
      include: { category: true },
      orderBy: { dueDay: 'asc' },
    });
  }

  /**
   * Busca uma despesa fixa específica
   */
  async findOne(userId: string, id: string) {
    const expense = await this.prisma.fixedExpense.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!expense) {
      throw new NotFoundException('Despesa fixa não encontrada');
    }

    return expense;
  }

  /**
   * Cria nova despesa fixa
   */
  async create(userId: string, dto: CreateFixedExpenseDto) {
    const expense = await this.prisma.fixedExpense.create({
      data: {
        userId,
        name: dto.name,
        amount: dto.amount,
        dueDay: dto.dueDay,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });

    // Gera pendências para os próximos meses
    await this.generatePendingBills(userId);

    return expense;
  }

  /**
   * Atualiza despesa fixa
   */
  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    await this.findOne(userId, id);

    return this.prisma.fixedExpense.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  /**
   * Remove despesa fixa (soft delete)
   */
  async delete(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.fixedExpense.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Despesa fixa removida com sucesso' };
  }

  /**
   * Retorna a próxima data de vencimento baseado no dia
   */
  private getNextDueDate(dueDay: number, monthsAhead: number = 0): Date {
    const now = new Date();
    let targetMonth = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);

    // Ajusta o dia para o último dia do mês se necessário
    const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
    const adjustedDay = Math.min(dueDay, lastDayOfMonth);

    const dueDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), adjustedDay);

    // Se a data já passou neste mês, pega o próximo
    if (monthsAhead === 0 && dueDate < now) {
      return this.getNextDueDate(dueDay, 1);
    }

    return dueDate;
  }

  /**
   * Gera contas pendentes para os próximos meses
   */
  async generatePendingBills(userId: string): Promise<void> {
    const fixedExpenses = await this.prisma.fixedExpense.findMany({
      where: { userId, isActive: true },
    });

    for (const expense of fixedExpenses) {
      // Gera para os próximos 3 meses
      for (let i = 0; i < 3; i++) {
        const dueDate = this.getNextDueDate(expense.dueDay, i);

        // Define início e fim do mês para verificação
        const startOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);
        const endOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0, 23, 59, 59);

        // Verifica se já existe pendência para este mês
        const existing = await this.prisma.pendingBill.findFirst({
          where: {
            fixedExpenseId: expense.id,
            dueDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        if (!existing) {
          await this.prisma.pendingBill.create({
            data: {
              userId,
              fixedExpenseId: expense.id,
              amount: expense.amount,
              dueDate,
              status: 'PENDING',
            },
          });
        }
      }
    }
  }

  /**
   * Lista contas pendentes do usuário
   */
  async getPendingBills(userId: string) {
    // Primeiro gera pendências se necessário
    await this.generatePendingBills(userId);

    // Atualiza status de contas vencidas
    await this.updateOverdueBills(userId);

    return this.prisma.pendingBill.findMany({
      where: {
        userId,
        status: { in: ['PENDING', 'OVERDUE'] },
      },
      include: {
        fixedExpense: {
          include: { category: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 20,
    });
  }

  /**
   * Atualiza contas vencidas para status OVERDUE
   */
  private async updateOverdueBills(userId: string): Promise<void> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    await this.prisma.pendingBill.updateMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: { lt: now },
      },
      data: { status: 'OVERDUE' },
    });
  }

  /**
   * Marca uma conta como paga e cria a transação
   */
  async payBill(userId: string, billId: string): Promise<any> {
    const bill = await this.prisma.pendingBill.findFirst({
      where: { id: billId, userId },
      include: { fixedExpense: true },
    });

    if (!bill) {
      throw new NotFoundException('Conta não encontrada');
    }

    if (bill.status === 'PAID') {
      throw new Error('Esta conta já foi paga');
    }

    // Busca a primeira conta ativa do usuário para debitar
    const account = await this.prisma.account.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!account) {
      throw new Error('Nenhuma conta encontrada para debitar');
    }

    // Cria a transação de despesa
    const transaction = await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        categoryId: bill.fixedExpense.categoryId,
        type: 'EXPENSE',
        amount: bill.amount,
        description: bill.fixedExpense.name,
        date: new Date(),
        isRecurring: true,
      },
    });

    // Atualiza o status da conta
    await this.prisma.pendingBill.update({
      where: { id: billId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        transactionId: transaction.id,
      },
    });

    return { message: 'Conta paga com sucesso', transaction };
  }

  /**
   * Pula uma conta (marca como SKIPPED)
   */
  async skipBill(userId: string, billId: string): Promise<void> {
    const bill = await this.prisma.pendingBill.findFirst({
      where: { id: billId, userId },
    });

    if (!bill) {
      throw new NotFoundException('Conta não encontrada');
    }

    await this.prisma.pendingBill.update({
      where: { id: billId },
      data: { status: 'SKIPPED' },
    });
  }

  /**
   * Retorna resumo das contas para o dashboard
   */
  async getSummary(userId: string) {
    const pendingBills = await this.getPendingBills(userId);

    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Filtra contas deste mês
    const thisMonthBills = pendingBills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
    });

    const totalPending = thisMonthBills.reduce((sum, bill) => sum + Number(bill.amount), 0);
    const overdueBills = thisMonthBills.filter((bill) => bill.status === 'OVERDUE');
    const overdueTotal = overdueBills.reduce((sum, bill) => sum + Number(bill.amount), 0);

    return {
      totalPending,
      totalOverdue: overdueTotal,
      billsCount: thisMonthBills.length,
      overdueCount: overdueBills.length,
      nextBills: pendingBills.slice(0, 5).map((bill) => ({
        id: bill.id,
        name: bill.fixedExpense.name,
        amount: Number(bill.amount),
        dueDate: bill.dueDate,
        status: bill.status,
        category: bill.fixedExpense.category,
      })),
    };
  }
}
