'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Target,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  useBudgets,
  useBudgetProgress,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from '@/hooks/use-budgets';
import { useCategories } from '@/hooks/use-transactions';
import type { Budget, BudgetProgress, TransactionType } from '@/types';

const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  amount: z.coerce.number().positive('O valor deve ser positivo'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function BudgetsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: progress, isLoading: progressLoading } = useBudgetProgress(
    selectedMonth,
    selectedYear
  );
  const { data: categories } = useCategories('EXPENSE' as TransactionType);

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      categoryId: '',
      amount: 0,
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    if (editingBudget) {
      await updateBudget.mutateAsync({
        id: editingBudget.id,
        data: { amount: data.amount, alertAt: 80 },
      });
    } else {
      await createBudget.mutateAsync({
        ...data,
        alertAt: 80,
        month: selectedMonth,
        year: selectedYear,
      });
    }
    setIsDialogOpen(false);
    setEditingBudget(null);
    form.reset();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    form.reset({
      categoryId: budget.categoryId,
      amount: budget.amount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteBudget.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
    form.reset();
  };

  // Navigate months
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const isCurrentMonth = selectedMonth === currentDate.getMonth() + 1 && selectedYear === currentDate.getFullYear();

  // Filter budgets for current month/year
  const currentBudgets = budgets?.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

  // Categories that already have budgets this month
  const usedCategoryIds = currentBudgets?.map((b) => b.categoryId) || [];
  const availableCategories = categories?.filter(
    (c) => !usedCategoryIds.includes(c.id) || c.id === editingBudget?.categoryId
  );

  // Stats
  const totalBudget = progress?.reduce((sum, p) => sum + p.budgetAmount, 0) || 0;
  const totalSpent = progress?.reduce((sum, p) => sum + p.spent, 0) || 0;
  const totalRemaining = totalBudget - totalSpent;

  const isLoading = budgetsLoading || progressLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Limites de Gastos</h1>
          <p className="text-muted-foreground">
            Defina quanto você pode gastar em cada categoria
          </p>
        </div>
        <Button onClick={() => { setEditingBudget(null); form.reset(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Definir Limite
        </Button>
      </div>

      {/* Month Navigation - Simplified */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center min-w-[150px]">
          <p className="font-semibold text-lg">
            {months[selectedMonth - 1]} {selectedYear}
          </p>
          {!isCurrentMonth && (
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => {
                setSelectedMonth(currentDate.getMonth() + 1);
                setSelectedYear(currentDate.getFullYear());
              }}
            >
              Voltar para mês atual
            </button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Summary Card */}
      {progress && progress.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Ainda posso gastar</p>
              <p className={`text-4xl font-bold ${totalRemaining < 0 ? 'text-red-500' : ''}`}>
                {formatCurrency(totalRemaining)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatCurrency(totalSpent)} gasto de {formatCurrency(totalBudget)} planejado
              </p>
              {totalBudget > 0 && (
                <Progress
                  value={Math.min((totalSpent / totalBudget) * 100, 100)}
                  className="mt-4 h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : progress && progress.length > 0 ? (
        <div className="space-y-3">
          {progress.map((item: BudgetProgress) => {
            const budget = currentBudgets?.find(
              (b) => b.categoryId === item.categoryId
            );
            const remaining = item.budgetAmount - item.spent;

            return (
              <Card key={item.budgetId} className="overflow-hidden">
                <div
                  className="h-1"
                  style={{
                    backgroundColor: item.isOverBudget
                      ? '#ef4444'
                      : item.percentage >= 80
                        ? '#eab308'
                        : item.categoryColor
                  }}
                />
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${item.categoryColor}20` }}
                      >
                        {item.categoryIcon}
                      </span>
                      <div>
                        <p className="font-medium">{item.categoryName}</p>
                        <p className={`text-sm ${item.isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {item.isOverBudget ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Passou {formatCurrency(Math.abs(remaining))}
                            </span>
                          ) : (
                            `Resta ${formatCurrency(remaining)}`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.spent)}</p>
                      <p className="text-xs text-muted-foreground">
                        de {formatCurrency(item.budgetAmount)}
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(item.percentage, 100)}
                    className={`h-2 ${
                      item.isOverBudget
                        ? '[&>div]:bg-red-500'
                        : item.percentage >= 80
                          ? '[&>div]:bg-yellow-500'
                          : ''
                    }`}
                    style={{
                      ['--progress-color' as any]: !item.isOverBudget && item.percentage < 80 ? item.categoryColor : undefined
                    }}
                  />

                  {budget && (
                    <div className="flex justify-end gap-1 mt-3 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(item.budgetId)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Controle seus gastos
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Defina limites para cada categoria e acompanhe se está gastando dentro do planejado.
            </p>
            <Button onClick={() => { setEditingBudget(null); form.reset(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Definir Primeiro Limite
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? 'Editar Limite' : 'Novo Limite de Gasto'}
            </DialogTitle>
            <DialogDescription>
              {editingBudget
                ? 'Altere o valor máximo para esta categoria'
                : 'Quanto você quer gastar no máximo nesta categoria?'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!editingBudget}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor máximo por mês</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          R$
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createBudget.isPending || updateBudget.isPending}
                >
                  {(createBudget.isPending || updateBudget.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingBudget ? 'Salvar' : 'Criar Limite'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Limite</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este limite de gasto?
              Você pode criar um novo a qualquer momento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBudget.isPending}
            >
              {deleteBudget.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
