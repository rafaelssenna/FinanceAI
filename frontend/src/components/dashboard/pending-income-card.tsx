'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIncomeSummary, useConfirmIncome, useSkipIncome } from '@/hooks/use-income';
import { CalendarClock, Check, X, Loader2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
    return 'Amanha';
  }

  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function isToday(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isPastOrToday(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

export function PendingIncomeCard() {
  const { data: summary, isLoading } = useIncomeSummary();
  const confirmIncome = useConfirmIncome();
  const skipIncome = useSkipIncome();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
        <CardContent className="p-6">
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary || summary.pendingIncomes.length === 0) {
    return null;
  }

  const handleConfirm = async (id: string) => {
    try {
      await confirmIncome.mutateAsync(id);
      toast.success('Recebimento confirmado!');
    } catch (error) {
      toast.error('Erro ao confirmar recebimento');
    }
  };

  const handleSkip = async (id: string) => {
    try {
      await skipIncome.mutateAsync(id);
      toast.success('Recebimento pulado');
    } catch (error) {
      toast.error('Erro ao pular recebimento');
    }
  };

  const frequencyLabels: Record<string, string> = {
    monthly: 'Mensal',
    biweekly: 'Quinzenal',
    weekly: 'Semanal',
    daily: 'Diario',
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
          <CalendarClock className="h-4 w-4" />
          Proximas entradas
          <span className="text-xs font-normal text-green-600/70 dark:text-green-500/70">
            ({frequencyLabels[summary.frequency]})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary.pendingIncomes.slice(0, 3).map((income) => {
          const canConfirm = isPastOrToday(income.expectedDate);
          const isLoadingThis = confirmIncome.isPending || skipIncome.isPending;

          return (
            <div
              key={income.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl transition-all',
                canConfirm
                  ? 'bg-white dark:bg-green-950/50 shadow-sm'
                  : 'bg-green-100/50 dark:bg-green-900/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    canConfirm
                      ? 'bg-green-500 text-white'
                      : 'bg-green-200 dark:bg-green-800 text-green-600 dark:text-green-400'
                  )}
                >
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    {formatCurrency(income.amount)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    {formatDate(income.expectedDate)}
                    {isToday(income.expectedDate) && (
                      <span className="ml-1 px-1.5 py-0.5 bg-green-500 text-white rounded text-[10px] font-medium">
                        HOJE
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {canConfirm && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => handleSkip(income.id)}
                    disabled={isLoadingThis}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleConfirm(income.id)}
                    disabled={isLoadingThis}
                  >
                    {isLoadingThis ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Recebi
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {summary.pendingIncomes.length > 3 && (
          <p className="text-xs text-center text-green-600 dark:text-green-500">
            +{summary.pendingIncomes.length - 3} proximos recebimentos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
