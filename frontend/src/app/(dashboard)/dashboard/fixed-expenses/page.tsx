'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Receipt,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Calendar,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useFixedExpenses, useCreateFixedExpense, useUpdateFixedExpense, useDeleteFixedExpense, usePendingBills, usePayBill, useSkipBill } from '@/hooks/use-fixed-expenses';
import { useCategories } from '@/hooks/use-categories';
import { BillStatus } from '@/types';

const fixedExpenseSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  dueDay: z.string().min(1, 'Dia é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

type FixedExpenseForm = z.infer<typeof fixedExpenseSchema>;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export default function FixedExpensesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);

  // Data
  const { data: fixedExpenses, isLoading: expensesLoading } = useFixedExpenses();
  const { data: pendingBills, isLoading: billsLoading } = usePendingBills();
  const { data: categories } = useCategories();

  // Mutations
  const createExpense = useCreateFixedExpense();
  const updateExpense = useUpdateFixedExpense();
  const deleteExpense = useDeleteFixedExpense();
  const payBill = usePayBill();
  const skipBill = useSkipBill();

  const expenseCategories = categories?.filter((c) => c.type === 'EXPENSE') || [];

  const form = useForm<FixedExpenseForm>({
    resolver: zodResolver(fixedExpenseSchema),
    defaultValues: {
      name: '',
      amount: '',
      dueDay: '',
      categoryId: '',
    },
  });

  const handleSubmit = async (data: FixedExpenseForm) => {
    try {
      const payload = {
        name: data.name,
        amount: parseFloat(data.amount.replace(',', '.')),
        dueDay: parseInt(data.dueDay),
        categoryId: data.categoryId,
      };

      if (editingExpense) {
        await updateExpense.mutateAsync({ id: editingExpense, data: payload });
      } else {
        await createExpense.mutateAsync(payload);
      }

      form.reset();
      setDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Erro ao salvar conta fixa:', error);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense.id);
    form.reset({
      name: expense.name,
      amount: expense.amount.toString(),
      dueDay: expense.dueDay.toString(),
      categoryId: expense.categoryId,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleNewExpense = () => {
    setEditingExpense(null);
    form.reset({
      name: '',
      amount: '',
      dueDay: '',
      categoryId: '',
    });
    setDialogOpen(true);
  };

  const handlePayBill = async (billId: string) => {
    try {
      await payBill.mutateAsync(billId);
    } catch (error) {
      console.error('Erro ao pagar conta:', error);
    }
  };

  const handleSkipBill = async (billId: string) => {
    try {
      await skipBill.mutateAsync(billId);
    } catch (error) {
      console.error('Erro ao pular conta:', error);
    }
  };

  // Separate pending bills
  const overdueBills = pendingBills?.filter((b) => b.status === BillStatus.OVERDUE) || [];
  const upcomingBills = pendingBills?.filter((b) => b.status === BillStatus.PENDING) || [];

  // Calculate totals
  const totalMonthly = fixedExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const totalPending = pendingBills?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contas Fixas</h1>
          <p className="text-muted-foreground">Gerencie suas despesas recorrentes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewExpense}>
              <Plus className="h-4 w-4 mr-2" />
              Nova conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? 'Editar conta fixa' : 'Nova conta fixa'}
              </DialogTitle>
              <DialogDescription>
                {editingExpense
                  ? 'Atualize os dados da despesa recorrente'
                  : 'Adicione uma nova despesa que se repete todo mês'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ex: Aluguel, Netflix, Academia"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    {...form.register('amount')}
                    placeholder="0,00"
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDay">Dia do vencimento</Label>
                  <Input
                    id="dueDay"
                    type="number"
                    min="1"
                    max="31"
                    {...form.register('dueDay')}
                    placeholder="1-31"
                  />
                  {form.formState.errors.dueDay && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.dueDay.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={form.watch('categoryId')}
                  onValueChange={(value) => form.setValue('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createExpense.isPending || updateExpense.isPending}
                >
                  {(createExpense.isPending || updateExpense.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingExpense ? 'Salvar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total mensal</p>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalMonthly)}</p>
            <p className="text-xs text-muted-foreground">{fixedExpenses?.length || 0} contas cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">A pagar</p>
            <p className="text-2xl font-bold text-orange-500">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground">{pendingBills?.length || 0} contas pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Contas Atrasadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${bill.fixedExpense?.category?.color}20` }}
                  >
                    {bill.fixedExpense?.category?.icon || '📦'}
                  </div>
                  <div>
                    <p className="font-medium">{bill.fixedExpense?.name}</p>
                    <p className="text-xs text-red-500">
                      Venceu em {formatDate(bill.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-500">
                    {formatCurrency(Number(bill.amount))}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => handlePayBill(bill.id)}
                    disabled={payBill.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Pagar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Contas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBills.map((bill) => {
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysUntil <= 3;

              return (
                <div
                  key={bill.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    isUrgent && "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-900/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${bill.fixedExpense?.category?.color}20` }}
                    >
                      {bill.fixedExpense?.category?.icon || '📦'}
                    </div>
                    <div>
                      <p className="font-medium">{bill.fixedExpense?.name}</p>
                      <p className={cn(
                        "text-xs",
                        isUrgent ? "text-yellow-600" : "text-muted-foreground"
                      )}>
                        Vence em {formatDate(bill.dueDate)}
                        {isUrgent && ` (${daysUntil} dia${daysUntil > 1 ? 's' : ''})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {formatCurrency(Number(bill.amount))}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => handlePayBill(bill.id)}
                      disabled={payBill.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Pagar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => handleSkipBill(bill.id)}
                      disabled={skipBill.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* All Fixed Expenses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Todas as Contas Fixas
          </CardTitle>
          <CardDescription>
            Despesas que se repetem todo mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : fixedExpenses && fixedExpenses.length > 0 ? (
            <div className="space-y-3">
              {fixedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${expense.category?.color}20` }}
                    >
                      {expense.category?.icon || '📦'}
                    </div>
                    <div>
                      <p className="font-medium">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence dia {expense.dueDay} - {expense.category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-red-500">
                      {formatCurrency(Number(expense.amount))}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir conta fixa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{expense.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(expense.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">
                Nenhuma conta fixa cadastrada
              </p>
              <Button onClick={handleNewExpense} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira conta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
