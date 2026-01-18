'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  useTotalBalance,
  useRecentTransactions,
  useTransactionSummary,
} from '@/hooks/use-dashboard';
import { useBudgetProgress } from '@/hooks/use-budgets';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PendingIncomeCard } from '@/components/dashboard/pending-income-card';
import Link from 'next/link';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatCompactCurrency(value: number) {
  if (value >= 1000) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  return formatCurrency(value);
}

function formatDate(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (d.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function DashboardPage() {
  const { data: balanceData, isLoading: balanceLoading } = useTotalBalance();
  const { data: recentTransactions, isLoading: transactionsLoading } = useRecentTransactions();

  // Get current month summary
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const { data: summary } = useTransactionSummary(startOfMonth, endOfMonth);

  // Budget progress for current month
  const { data: budgetProgress } = useBudgetProgress(now.getMonth() + 1, now.getFullYear());

  const balance = balanceData?.balance || 0;
  const hasTransactions = recentTransactions && recentTransactions.length > 0;
  const hasBudgets = budgetProgress && budgetProgress.length > 0;

  // Get top 3 budgets
  const topBudgets = budgetProgress?.slice(0, 3) || [];

  const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <div className="space-y-4 pb-6 max-w-lg mx-auto">
      {/* Header com saldo */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">Saldo total</p>
        <p className={cn(
          "text-3xl font-bold tracking-tight",
          balance >= 0 ? "text-foreground" : "text-red-500"
        )}>
          {balanceLoading ? '...' : formatCurrency(balance)}
        </p>
        {balance < 0 && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Saldo negativo
          </p>
        )}
      </div>

      {/* Resumo do mes - Receita vs Despesa */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-green-200 dark:border-green-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="text-xs text-muted-foreground">Receitas</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              {formatCompactCurrency(summary?.totalIncome || 0)}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{monthName}</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30">
                <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
              </div>
              <span className="text-xs text-muted-foreground">Despesas</span>
            </div>
            <p className="text-lg font-bold text-red-600">
              {formatCompactCurrency(summary?.totalExpense || 0)}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{monthName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Receitas Pendentes */}
      <PendingIncomeCard />

      {/* Limites de Gastos - Preview */}
      {hasBudgets && (
        <Card>
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Limites de Gastos</CardTitle>
              <Link href="/dashboard/budgets">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                  Ver todos
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {topBudgets.map((item) => {
              const remaining = item.budgetAmount - item.spent;
              return (
                <div key={item.budgetId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{item.categoryIcon}</span>
                      <span className="font-medium">{item.categoryName}</span>
                    </div>
                    <span className={cn(
                      "text-xs",
                      item.isOverBudget ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {item.isOverBudget ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Passou!
                        </span>
                      ) : (
                        `Resta ${formatCompactCurrency(remaining)}`
                      )}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(item.percentage, 100)}
                    className={cn(
                      "h-1.5",
                      item.isOverBudget
                        ? '[&>div]:bg-red-500'
                        : item.percentage >= 80
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500'
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Ultimas transacoes */}
      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Ultimas Transacoes</CardTitle>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                Ver todas
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {transactionsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : hasTransactions ? (
            <div className="space-y-1">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2.5 border-b last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-base"
                      style={{ backgroundColor: `${transaction.category?.color}20` }}
                    >
                      {transaction.category?.icon || '💰'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-semibold whitespace-nowrap ml-2',
                      transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCompactCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <Wallet className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhuma transacao ainda
              </p>
              <Link href="/dashboard/transactions">
                <Button variant="link" size="sm" className="mt-2">
                  Ir para transacoes
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
