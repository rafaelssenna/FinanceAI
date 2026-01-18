'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Loader2,
  DollarSign,
  Calendar,
  CalendarDays,
  CalendarClock,
  Repeat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { useAccounts, useCreateAccount } from '@/hooks/use-accounts';
import { AccountType } from '@/types';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const ACCOUNT_TYPES = [
  { type: AccountType.CHECKING, name: 'Conta Corrente', icon: CreditCard, color: '#3b82f6', examples: 'Nubank, Inter, Itau' },
  { type: AccountType.SAVINGS, name: 'Poupanca', icon: PiggyBank, color: '#22c55e', examples: 'Caixa, Banco do Brasil' },
  { type: AccountType.CASH, name: 'Carteira', icon: Banknote, color: '#f97316', examples: 'Dinheiro vivo' },
  { type: AccountType.CREDIT_CARD, name: 'Cartao Credito', icon: CreditCard, color: '#8b5cf6', examples: 'Nubank, C6, Santander' },
  { type: AccountType.INVESTMENT, name: 'Investimentos', icon: TrendingUp, color: '#ec4899', examples: 'XP, Rico, Clear' },
];

type IncomeFrequency = 'monthly' | 'biweekly' | 'weekly' | 'daily';
type MonthlyType = 'business_day' | 'fixed_day';
type BiweeklyType = 'advance_salary' | 'fixed_days';

const STEPS = [
  { id: 1, name: 'Boas-vindas' },
  { id: 2, name: 'Sua conta' },
  { id: 3, name: 'Sua renda' },
  { id: 4, name: 'Frequencia' },
  { id: 5, name: 'Pronto!' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [step, setStep] = useState(1);

  // Conta bancaria
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);

  // Renda
  const [income, setIncome] = useState('');
  const [frequency, setFrequency] = useState<IncomeFrequency | null>(null);

  // Detalhes da frequencia
  const [monthlyType, setMonthlyType] = useState<MonthlyType | null>(null);
  const [businessDay, setBusinessDay] = useState('5'); // 5o dia util
  const [fixedDay, setFixedDay] = useState('5'); // dia 5

  const [biweeklyType, setBiweeklyType] = useState<BiweeklyType | null>(null);
  const [advanceDay, setAdvanceDay] = useState('15'); // adiantamento dia 15
  const [salaryBusinessDay, setSalaryBusinessDay] = useState('5'); // salario 5o dia util
  const [biweeklyDay1, setBiweeklyDay1] = useState('5');
  const [biweeklyDay2, setBiweeklyDay2] = useState('20');

  const [weeklyDay, setWeeklyDay] = useState('friday'); // sexta

  const [savingIncome, setSavingIncome] = useState(false);

  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const createAccount = useCreateAccount();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleCreateAccount = async () => {
    if (!selectedType || !accountName) return;

    const typeConfig = ACCOUNT_TYPES.find((t) => t.type === selectedType);

    const result = await createAccount.mutateAsync({
      name: accountName,
      type: selectedType,
      color: typeConfig?.color || '#6366f1',
      initialBalance: initialBalance ? parseFloat(initialBalance.replace(',', '.')) : 0,
    });

    setCreatedAccountId(result.id);
    setStep(3);
  };

  const handleSaveIncome = async () => {
    if (!income || !frequency || !createdAccountId) return;

    setSavingIncome(true);

    try {
      // Monta os dados da renda recorrente
      const incomeValue = parseFloat(income.replace(/\./g, '').replace(',', '.'));

      let recurrenceConfig: any = {
        frequency,
        amount: incomeValue,
        accountId: createdAccountId,
      };

      if (frequency === 'monthly') {
        recurrenceConfig.monthlyType = monthlyType;
        if (monthlyType === 'business_day') {
          recurrenceConfig.businessDay = parseInt(businessDay);
        } else {
          recurrenceConfig.fixedDay = parseInt(fixedDay);
        }
      } else if (frequency === 'biweekly') {
        recurrenceConfig.biweeklyType = biweeklyType;
        if (biweeklyType === 'advance_salary') {
          recurrenceConfig.advanceDay = parseInt(advanceDay);
          recurrenceConfig.salaryBusinessDay = parseInt(salaryBusinessDay);
        } else {
          recurrenceConfig.day1 = parseInt(biweeklyDay1);
          recurrenceConfig.day2 = parseInt(biweeklyDay2);
        }
      } else if (frequency === 'weekly') {
        recurrenceConfig.weekDay = weeklyDay;
      }

      // Salva a configuração de renda recorrente
      await api.setIncomeConfig(recurrenceConfig);

      setStep(5);
    } catch (error) {
      console.error('Erro ao salvar renda:', error);
      // Continua mesmo com erro
      setStep(5);
    } finally {
      setSavingIncome(false);
    }
  };

  const handleFinish = () => {
    router.push('/dashboard');
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Converte para número e formata
    const amount = parseInt(numbers || '0') / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setIncome(formatted);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    step > s.id
                      ? 'bg-primary text-primary-foreground'
                      : step === s.id
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-8 sm:w-16 h-1 mx-1',
                      step > s.id ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {STEPS[step - 1]?.name}
          </p>
        </div>

        {/* Step 1: Boas-vindas */}
        {step === 1 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Ola, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Vamos configurar suas financas em 2 minutos.
              </p>
              <div className="space-y-4 text-left max-w-sm mx-auto mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Onde guarda seu dinheiro</p>
                    <p className="text-sm text-muted-foreground">Nubank, Itau, carteira...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quanto voce ganha</p>
                    <p className="text-sm text-muted-foreground">Salario, freelance...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <CalendarClock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quando recebe</p>
                    <p className="text-sm text-muted-foreground">O app ja vai saber quando entra</p>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={() => setStep(2)} className="w-full max-w-xs">
                Vamos la!
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Criar Conta */}
        {step === 2 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Onde esta seu dinheiro?</h2>
                <p className="text-muted-foreground">
                  Escolha onde voce recebe e guarda seu dinheiro
                </p>
              </div>

              <div className="mb-6">
                <Label className="mb-3 block">Tipo de conta</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACCOUNT_TYPES.map((type) => (
                    <button
                      key={type.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(type.type);
                        if (!accountName) {
                          setAccountName(type.name === 'Carteira' ? 'Carteira' : '');
                        }
                      }}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        selectedType === type.type
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <type.icon
                        className="h-6 w-6 mb-2"
                        style={{ color: type.color }}
                      />
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.examples}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <Label htmlFor="accountName">Nome da conta</Label>
                    <Input
                      id="accountName"
                      placeholder="Ex: Nubank, Itau, Carteira..."
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="initialBalance">Saldo atual (opcional)</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        R$
                      </span>
                      <Input
                        id="initialBalance"
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedType || !accountName || createAccount.isPending}
                  onClick={handleCreateAccount}
                >
                  {createAccount.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Quanto ganha */}
        {step === 3 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quanto voce ganha?</h2>
                <p className="text-muted-foreground">
                  Sua renda principal (salario, freelance, etc)
                </p>
              </div>

              <div className="mb-6">
                <Label htmlFor="income">Valor da renda</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="income"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={income}
                    onChange={handleIncomeChange}
                    className="pl-12 text-2xl h-14 font-semibold"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Valor liquido que cai na sua conta
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!income || income === '0,00'}
                  onClick={() => setStep(4)}
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Frequencia */}
        {step === 4 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarClock className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quando voce recebe?</h2>
                <p className="text-muted-foreground">
                  Com que frequencia sua renda entra
                </p>
              </div>

              {/* Frequencia */}
              <div className="mb-6">
                <Label className="mb-3 block">Frequencia</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      frequency === 'monthly'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Calendar className="h-5 w-5 mb-2 text-blue-500" />
                    <p className="font-medium">Mensal</p>
                    <p className="text-xs text-muted-foreground">1x por mes</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('biweekly')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      frequency === 'biweekly'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <CalendarDays className="h-5 w-5 mb-2 text-green-500" />
                    <p className="font-medium">Quinzenal</p>
                    <p className="text-xs text-muted-foreground">2x por mes</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      frequency === 'weekly'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Repeat className="h-5 w-5 mb-2 text-orange-500" />
                    <p className="font-medium">Semanal</p>
                    <p className="text-xs text-muted-foreground">Toda semana</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      frequency === 'daily'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <CalendarClock className="h-5 w-5 mb-2 text-purple-500" />
                    <p className="font-medium">Diario</p>
                    <p className="text-xs text-muted-foreground">Todo dia</p>
                  </button>
                </div>
              </div>

              {/* Detalhes Mensal */}
              {frequency === 'monthly' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <Label className="block">Quando cai na conta?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMonthlyType('business_day')}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        monthlyType === 'business_day'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <p className="font-medium">Dia util</p>
                      <p className="text-xs text-muted-foreground">Ex: 5o dia util</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyType('fixed_day')}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        monthlyType === 'fixed_day'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <p className="font-medium">Dia fixo</p>
                      <p className="text-xs text-muted-foreground">Ex: dia 5</p>
                    </button>
                  </div>

                  {monthlyType === 'business_day' && (
                    <div className="animate-in fade-in">
                      <Label htmlFor="businessDay">Qual dia util?</Label>
                      <select
                        id="businessDay"
                        value={businessDay}
                        onChange={(e) => setBusinessDay(e.target.value)}
                        className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                      >
                        <option value="1">1o dia util</option>
                        <option value="2">2o dia util</option>
                        <option value="3">3o dia util</option>
                        <option value="4">4o dia util</option>
                        <option value="5">5o dia util</option>
                        <option value="10">10o dia util</option>
                        <option value="15">15o dia util</option>
                        <option value="-1">Ultimo dia util</option>
                      </select>
                    </div>
                  )}

                  {monthlyType === 'fixed_day' && (
                    <div className="animate-in fade-in">
                      <Label htmlFor="fixedDay">Qual dia do mes?</Label>
                      <select
                        id="fixedDay"
                        value={fixedDay}
                        onChange={(e) => setFixedDay(e.target.value)}
                        className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Dia {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes Quinzenal */}
              {frequency === 'biweekly' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <Label className="block">Como funciona?</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setBiweeklyType('advance_salary')}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        biweeklyType === 'advance_salary'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <p className="font-medium">Adiantamento + Salario</p>
                      <p className="text-xs text-muted-foreground">
                        Parte no meio do mes + resto no dia util
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBiweeklyType('fixed_days')}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        biweeklyType === 'fixed_days'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <p className="font-medium">Dois dias fixos</p>
                      <p className="text-xs text-muted-foreground">
                        Ex: dia 5 e dia 20
                      </p>
                    </button>
                  </div>

                  {biweeklyType === 'advance_salary' && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                      <div>
                        <Label htmlFor="advanceDay">Dia do adiantamento</Label>
                        <select
                          id="advanceDay"
                          value={advanceDay}
                          onChange={(e) => setAdvanceDay(e.target.value)}
                          className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                        >
                          {Array.from({ length: 28 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Dia {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="salaryBusinessDay">Salario (dia util)</Label>
                        <select
                          id="salaryBusinessDay"
                          value={salaryBusinessDay}
                          onChange={(e) => setSalaryBusinessDay(e.target.value)}
                          className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                        >
                          <option value="1">1o dia util</option>
                          <option value="2">2o dia util</option>
                          <option value="3">3o dia util</option>
                          <option value="4">4o dia util</option>
                          <option value="5">5o dia util</option>
                          <option value="-1">Ultimo dia util</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {biweeklyType === 'fixed_days' && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                      <div>
                        <Label htmlFor="biweeklyDay1">Primeiro dia</Label>
                        <select
                          id="biweeklyDay1"
                          value={biweeklyDay1}
                          onChange={(e) => setBiweeklyDay1(e.target.value)}
                          className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                        >
                          {Array.from({ length: 28 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Dia {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="biweeklyDay2">Segundo dia</Label>
                        <select
                          id="biweeklyDay2"
                          value={biweeklyDay2}
                          onChange={(e) => setBiweeklyDay2(e.target.value)}
                          className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                        >
                          {Array.from({ length: 28 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Dia {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes Semanal */}
              {frequency === 'weekly' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <Label htmlFor="weeklyDay">Qual dia da semana?</Label>
                  <select
                    id="weeklyDay"
                    value={weeklyDay}
                    onChange={(e) => setWeeklyDay(e.target.value)}
                    className="mt-1 w-full h-12 rounded-lg border bg-background px-3"
                  >
                    <option value="monday">Segunda-feira</option>
                    <option value="tuesday">Terca-feira</option>
                    <option value="wednesday">Quarta-feira</option>
                    <option value="thursday">Quinta-feira</option>
                    <option value="friday">Sexta-feira</option>
                    <option value="saturday">Sabado</option>
                    <option value="sunday">Domingo</option>
                  </select>
                </div>
              )}

              {/* Diario nao precisa de configuracao extra */}
              {frequency === 'daily' && (
                <div className="bg-muted/50 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-sm text-muted-foreground">
                    Sua renda de <strong>R$ {income}</strong> sera registrada automaticamente todo dia util.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={
                    !frequency ||
                    (frequency === 'monthly' && !monthlyType) ||
                    (frequency === 'biweekly' && !biweeklyType) ||
                    savingIncome
                  }
                  onClick={handleSaveIncome}
                >
                  {savingIncome ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Finalizar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Pronto */}
        {step === 5 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Tudo configurado!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sua renda de <strong className="text-foreground">R$ {income}</strong> sera adicionada automaticamente.
              </p>

              <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  O que acontece agora:
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Sua renda entra automaticamente nos dias configurados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Voce registra apenas os gastos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>A IA categoriza tudo automaticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Voce acompanha seu saldo em tempo real</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" onClick={handleFinish} className="w-full max-w-xs">
                Ir para o Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Skip button */}
        {step < 5 && step > 1 && (
          <div className="text-center mt-6">
            <button
              onClick={handleFinish}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pular e configurar depois
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
