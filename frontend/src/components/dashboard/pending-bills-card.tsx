'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFixedExpensesSummary, usePayBill, useSkipBill } from '@/hooks/use-fixed-expenses';
import { Receipt, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BillStatus } from '@/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  }

  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function getDaysUntilDue(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getStatusColor(status: BillStatus, daysUntilDue: number) {
  if (status === BillStatus.OVERDUE) return 'red';
  if (daysUntilDue <= 0) return 'red';
  if (daysUntilDue <= 3) return 'yellow';
  return 'green';
}

export function PendingBillsCard() {
  const { data: summary, isLoading } = useFixedExpensesSummary();
  const payBill = usePayBill();
  const skipBill = useSkipBill();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
        <CardContent className="p-6">
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary || summary.nextBills.length === 0) {
    return null;
  }

  const handlePay = async (billId: string) => {
    try {
      await payBill.mutateAsync(billId);
      toast.success('Conta paga com sucesso!');
    } catch (error) {
      toast.error('Erro ao pagar conta');
    }
  };

  const handleSkip = async (billId: string) => {
    try {
      await skipBill.mutateAsync(billId);
      toast.success('Conta pulada');
    } catch (error) {
      toast.error('Erro ao pular conta');
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Receipt className="h-4 w-4" />
            Contas a Pagar
          </CardTitle>
          {summary.overdueCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
              <AlertCircle className="h-3 w-3" />
              {summary.overdueCount} atrasada{summary.overdueCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {summary.totalPending > 0 && (
          <p className="text-xs text-orange-600/70 dark:text-orange-500/70">
            Total pendente: {formatCurrency(summary.totalPending)}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {summary.nextBills.slice(0, 4).map((bill) => {
          const daysUntilDue = getDaysUntilDue(bill.dueDate);
          const statusColor = getStatusColor(bill.status, daysUntilDue);
          const isLoadingThis = payBill.isPending || skipBill.isPending;
          const isOverdue = bill.status === BillStatus.OVERDUE || daysUntilDue < 0;

          return (
            <div
              key={bill.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl transition-all',
                isOverdue
                  ? 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-orange-950/50 shadow-sm'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                    isOverdue
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-100 dark:bg-orange-900'
                  )}
                >
                  {bill.category?.icon || '📄'}
                </div>
                <div>
                  <p
                    className={cn(
                      'font-medium',
                      isOverdue
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-orange-800 dark:text-orange-300'
                    )}
                  >
                    {bill.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isOverdue
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-orange-600 dark:text-orange-400'
                      )}
                    >
                      {formatCurrency(bill.amount)}
                    </p>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded',
                        statusColor === 'red' && 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
                        statusColor === 'yellow' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
                        statusColor === 'green' && 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                      )}
                    >
                      {formatDate(bill.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  onClick={() => handleSkip(bill.id)}
                  disabled={isLoadingThis}
                  title="Pular"
                  aria-label="Pular conta"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className={cn(
                    'h-8 text-white',
                    isOverdue
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  )}
                  onClick={() => handlePay(bill.id)}
                  disabled={isLoadingThis}
                >
                  {isLoadingThis ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Pagar
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {summary.billsCount > 4 && (
          <p className="text-xs text-center text-orange-600 dark:text-orange-500">
            +{summary.billsCount - 4} outras contas este mês
          </p>
        )}
      </CardContent>
    </Card>
  );
}
