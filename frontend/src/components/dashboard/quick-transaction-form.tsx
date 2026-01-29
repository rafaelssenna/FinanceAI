'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, TrendingDown, TrendingUp, Sparkles, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateTransaction, useCategories, useSuggestCategory } from '@/hooks/use-transactions';
import { useAccounts, useCreateAccount } from '@/hooks/use-accounts';
import { TransactionType, AccountType } from '@/types';

interface QuickTransactionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickTransactionForm({ onClose, onSuccess }: QuickTransactionFormProps) {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [aiSuggesting, setAiSuggesting] = useState(false);

  // Ref pra garantir que só chama IA 1 vez por descricao
  const lastSuggestedRef = useRef<string>('');

  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: categories } = useCategories(type);
  const createTransaction = useCreateTransaction();
  const createAccount = useCreateAccount();
  const suggestCategory = useSuggestCategory();

  // Auto-select first account
  useEffect(() => {
    if (accounts && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  // Reset category when type changes
  useEffect(() => {
    setCategoryId('');
    lastSuggestedRef.current = '';
  }, [type]);

  // Chama IA quando sair do campo descricao (blur)
  const handleDescriptionBlur = async () => {
    // Nao chama se: descricao curta, ja tem categoria, ja sugerindo, ou ja sugeriu pra essa descricao
    if (
      description.length < 3 ||
      categoryId ||
      aiSuggesting ||
      lastSuggestedRef.current === description
    ) {
      return;
    }

    lastSuggestedRef.current = description;
    setAiSuggesting(true);

    try {
      const result = await suggestCategory.mutateAsync({ description, type });
      if (result?.suggestion) {
        setCategoryId(result.suggestion);
      }
    } catch {
      // Ignora erro, usuario pode selecionar manualmente
    } finally {
      setAiSuggesting(false);
    }
  };

  // Criar conta padrao se nao tiver nenhuma
  const handleCreateDefaultAccount = async () => {
    await createAccount.mutateAsync({
      name: 'Carteira',
      type: AccountType.CASH,
      color: '#22c55e',
      initialBalance: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !accountId) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountValue) || amountValue <= 0) return;

    await createTransaction.mutateAsync({
      type,
      amount: amountValue,
      description,
      categoryId: categoryId || undefined,
      accountId,
      date: new Date().toISOString(),
    });

    onSuccess();
  };

  const isSubmitting = createTransaction.isPending;
  const hasNoAccounts = !accountsLoading && (!accounts || accounts.length === 0);

  // Se nao tem conta, mostra opcao de criar
  if (hasNoAccounts) {
    return (
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Nova transação</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Primeiro, crie uma conta</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Você precisa de uma conta (ex: Nubank, Carteira) para registrar transações.
          </p>
          <Button
            onClick={handleCreateDefaultAccount}
            disabled={createAccount.isPending}
          >
            {createAccount.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            Criar "Carteira"
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Nova transação</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo: Despesa ou Receita */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === TransactionType.EXPENSE ? 'default' : 'outline'}
              className={cn(
                'h-12',
                type === TransactionType.EXPENSE && 'bg-red-500 hover:bg-red-600'
              )}
              onClick={() => setType(TransactionType.EXPENSE)}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === TransactionType.INCOME ? 'default' : 'outline'}
              className={cn(
                'h-12',
                type === TransactionType.INCOME && 'bg-green-500 hover:bg-green-600'
              )}
              onClick={() => setType(TransactionType.INCOME)}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Receita
            </Button>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="amount">Valor</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg h-12"
                autoFocus
              />
            </div>
          </div>

          {/* Descricao */}
          <div>
            <Label htmlFor="description" className="flex items-center gap-2">
              Descrição
              {aiSuggesting && (
                <span className="text-xs text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  IA categorizando...
                </span>
              )}
            </Label>
            <Input
              id="description"
              placeholder="Ex: Ifood, Salario, Uber..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="mt-1 h-12"
            />
          </div>

          {/* Categoria (com sugestao IA) */}
          {categories && categories.length > 0 && (
            <div>
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      'px-3 py-2 rounded-full text-sm flex items-center gap-1 transition-all',
                      categoryId === cat.id
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                    style={categoryId === cat.id ? { backgroundColor: `${cat.color}30` } : {}}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conta (se tiver mais de uma) */}
          {accounts && accounts.length > 1 && (
            <div>
              <Label>Conta</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAccountId(acc.id)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all',
                      accountId === acc.id
                        ? 'ring-2 ring-primary ring-offset-2 bg-primary/10'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: acc.color }}
                    />
                    {acc.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botao de salvar */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12"
            disabled={!amount || !description || !accountId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar transação'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
