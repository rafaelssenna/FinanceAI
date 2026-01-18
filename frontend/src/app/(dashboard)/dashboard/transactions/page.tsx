'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useCategories,
  useSuggestCategory,
} from '@/hooks/use-transactions';
import { useAccounts } from '@/hooks/use-accounts';
import { TransactionType, type Transaction, type FilterTransactionsDto } from '@/types';
import { cn } from '@/lib/utils';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  type: z.nativeEnum(TransactionType),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  categoryId: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  notes: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterTransactionsDto>({});
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: transactions, isLoading } = useTransactions({
    ...filters,
    type: activeTab === 'all' ? undefined : activeTab === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
    search: searchTerm || undefined,
  });
  const { data: accounts } = useAccounts();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const suggestCategory = useSuggestCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      description: '',
      amount: 0,
      type: TransactionType.EXPENSE,
      accountId: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedType = watch('type');
  const description = watch('description');
  const { data: categories } = useCategories(selectedType);

  // Ref para garantir que só chama IA 1 vez por descrição
  const lastSuggestedRef = useRef<string>('');
  const [aiSuggesting, setAiSuggesting] = useState(false);

  // AI category suggestion - só quando sair do campo (blur)
  const handleDescriptionBlur = async () => {
    const currentDescription = watch('description');
    const currentType = watch('type');
    const currentCategoryId = watch('categoryId');

    // Não chama se: descrição curta, já tem categoria, já sugerindo, ou já sugeriu pra essa descrição
    if (
      !currentDescription ||
      currentDescription.length < 3 ||
      currentCategoryId ||
      aiSuggesting ||
      lastSuggestedRef.current === currentDescription
    ) {
      return;
    }

    lastSuggestedRef.current = currentDescription;
    setAiSuggesting(true);

    try {
      const result = await suggestCategory.mutateAsync({
        description: currentDescription,
        type: currentType,
      });
      if (result.suggestion) {
        const matchingCategory = categories?.find(
          (c) => c.name.toLowerCase() === result.suggestion?.toLowerCase()
        );
        if (matchingCategory) {
          setValue('categoryId', matchingCategory.id);
        }
      }
    } catch {
      // Ignora erro, usuário pode selecionar manualmente
    } finally {
      setAiSuggesting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingTransaction(null);
    lastSuggestedRef.current = ''; // Limpa ref para permitir nova sugestão
    reset({
      description: '',
      amount: 0,
      type: TransactionType.EXPENSE,
      accountId: accounts?.[0]?.id || '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    lastSuggestedRef.current = transaction.description; // Marca como já sugerido para não chamar IA de novo
    reset({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: TransactionForm) => {
    const payload = {
      ...data,
      date: new Date(data.date).toISOString(),
      categoryId: data.categoryId || undefined,
    };

    if (editingTransaction) {
      await updateTransaction.mutateAsync({ id: editingTransaction.id, data: payload });
    } else {
      await createTransaction.mutateAsync(payload);
    }
    setIsDialogOpen(false);
    reset();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground">Controle suas receitas e despesas</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expense">Despesas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{
                      backgroundColor: `${transaction.category?.color || '#6366f1'}20`,
                    }}
                  >
                    {transaction.category?.icon || (transaction.type === 'INCOME' ? '💰' : '💸')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{transaction.description}</p>
                      {transaction.aiCategorized && (
                        <Badge variant="secondary" className="shrink-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.category?.name || 'Sem categoria'}</span>
                      <span>•</span>
                      <span>{transaction.account?.name}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.date), "dd 'de' MMM", { locale: ptBR })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-semibold whitespace-nowrap',
                        transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpRight className="h-4 w-4 inline mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 inline mr-1" />
                      )}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Comece adicionando sua primeira transação'}
            </p>
            {!searchTerm && (
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Transação
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? 'Atualize as informações da transação'
                : 'Adicione uma nova transação. A IA vai sugerir a categoria automaticamente!'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={selectedType === TransactionType.EXPENSE ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  selectedType === TransactionType.EXPENSE && 'bg-red-500 hover:bg-red-600'
                )}
                onClick={() => setValue('type', TransactionType.EXPENSE)}
              >
                <ArrowDownRight className="h-4 w-4 mr-2" />
                Despesa
              </Button>
              <Button
                type="button"
                variant={selectedType === TransactionType.INCOME ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  selectedType === TransactionType.INCOME && 'bg-green-500 hover:bg-green-600'
                )}
                onClick={() => setValue('type', TransactionType.INCOME)}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Receita
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <div className="relative">
                <Input
                  id="description"
                  placeholder="Ex: Ifood, Salário, Uber"
                  {...register('description')}
                  onBlur={handleDescriptionBlur}
                />
                {aiSuggesting && (
                  <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
                )}
              </div>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">Conta</Label>
              <Select
                value={watch('accountId')}
                onValueChange={(value) => setValue('accountId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: account.color }}
                        />
                        {account.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && (
                <p className="text-sm text-destructive">{errors.accountId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="categoryId">Categoria</Label>
                {aiSuggesting && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    IA sugerindo...
                  </span>
                )}
              </div>
              <Select
                value={watch('categoryId') || ''}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                placeholder="Adicione uma nota..."
                {...register('notes')}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createTransaction.isPending || updateTransaction.isPending}
              >
                {(createTransaction.isPending || updateTransaction.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingTransaction ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Transação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
