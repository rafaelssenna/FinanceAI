'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Lock,
  Palette,
  Bell,
  Shield,
  Loader2,
  Check,
  Moon,
  Sun,
  Receipt,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useFixedExpenses, useCreateFixedExpense, useUpdateFixedExpense, useDeleteFixedExpense } from '@/hooks/use-fixed-expenses';
import { useCategories } from '@/hooks/use-categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

const fixedExpenseSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  dueDay: z.string().min(1, 'Dia é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type FixedExpenseForm = z.infer<typeof fixedExpenseSchema>;

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);

  // Fixed expenses
  const { data: fixedExpenses, isLoading: expensesLoading } = useFixedExpenses();
  const { data: categories } = useCategories();
  const createExpense = useCreateFixedExpense();
  const updateExpense = useUpdateFixedExpense();
  const deleteExpense = useDeleteFixedExpense();

  const expenseCategories = categories?.filter((c) => c.type === 'EXPENSE') || [];

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const expenseForm = useForm<FixedExpenseForm>({
    resolver: zodResolver(fixedExpenseSchema),
    defaultValues: {
      name: '',
      amount: '',
      dueDay: '',
      categoryId: '',
    },
  });

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleProfileSubmit = async (data: ProfileForm) => {
    setSaving(true);
    // TODO: Implementar update do perfil na API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setSaving(true);
    // TODO: Implementar troca de senha na API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    passwordForm.reset();
  };

  const handleExpenseSubmit = async (data: FixedExpenseForm) => {
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

      expenseForm.reset();
      setExpenseDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Erro ao salvar conta fixa:', error);
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense.id);
    expenseForm.reset({
      name: expense.name,
      amount: expense.amount.toString(),
      dueDay: expense.dueDay.toString(),
      categoryId: expense.categoryId,
    });
    setExpenseDialogOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir conta fixa:', error);
    }
  };

  const handleNewExpense = () => {
    setEditingExpense(null);
    expenseForm.reset({
      name: '',
      amount: '',
      dueDay: '',
      categoryId: '',
    });
    setExpenseDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="fixed-expenses">Contas Fixas</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      Alterar foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...profileForm.register('name')}
                    placeholder="Seu nome"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    placeholder="seu@email.com"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Plano */}
                <div className="space-y-2">
                  <Label>Plano atual</Label>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      user?.plan === 'FREE' ? 'bg-muted' : 'bg-primary/10 text-primary'
                    )}>
                      {user?.plan || 'FREE'}
                    </span>
                    {user?.plan === 'FREE' && (
                      <Button type="button" variant="outline" size="sm">
                        Fazer upgrade
                      </Button>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : saved ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : null}
                  {saved ? 'Salvo!' : 'Salvar alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contas Fixas */}
        <TabsContent value="fixed-expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Contas Fixas
                  </CardTitle>
                  <CardDescription>
                    Gerencie suas despesas mensais recorrentes
                  </CardDescription>
                </div>
                <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewExpense} size="sm">
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
                    <form onSubmit={expenseForm.handleSubmit(handleExpenseSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-name">Nome</Label>
                        <Input
                          id="expense-name"
                          {...expenseForm.register('name')}
                          placeholder="Ex: Aluguel, Netflix, Academia"
                        />
                        {expenseForm.formState.errors.name && (
                          <p className="text-sm text-destructive">
                            {expenseForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expense-amount">Valor (R$)</Label>
                          <Input
                            id="expense-amount"
                            {...expenseForm.register('amount')}
                            placeholder="0,00"
                          />
                          {expenseForm.formState.errors.amount && (
                            <p className="text-sm text-destructive">
                              {expenseForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expense-due-day">Dia do vencimento</Label>
                          <Input
                            id="expense-due-day"
                            type="number"
                            min="1"
                            max="31"
                            {...expenseForm.register('dueDay')}
                            placeholder="1-31"
                          />
                          {expenseForm.formState.errors.dueDay && (
                            <p className="text-sm text-destructive">
                              {expenseForm.formState.errors.dueDay.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={expenseForm.watch('categoryId')}
                          onValueChange={(value) => expenseForm.setValue('categoryId', value)}
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
                        {expenseForm.formState.errors.categoryId && (
                          <p className="text-sm text-destructive">
                            {expenseForm.formState.errors.categoryId.message}
                          </p>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setExpenseDialogOpen(false)}
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
                            Vence dia {expense.dueDay} • {expense.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-500">
                          R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditExpense(expense)}
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
                                  onClick={() => handleDeleteExpense(expense.id)}
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
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tema */}
              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Escuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <div className="flex">
                      <Sun className="h-4 w-4" />
                      <Moon className="h-4 w-4 ml-1" />
                    </div>
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>

              {/* Notificações */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas de orçamento</p>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas quando atingir o limite
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Resumo semanal</p>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo toda segunda-feira
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dicas da IA</p>
                      <p className="text-sm text-muted-foreground">
                        Insights personalizados de economia
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguranca */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Alterar senha
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Zona de perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Excluir conta</p>
                  <p className="text-sm text-muted-foreground">
                    Remove todos os dados permanentemente
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Excluir conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
