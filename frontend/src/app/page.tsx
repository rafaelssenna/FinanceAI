'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Sparkles,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  TrendingUp,
  PiggyBank,
  Bell,
  BarChart3,
  CreditCard,
  Receipt,
  Target,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold">FinanceAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <Link href="#features" className="hover:text-white transition-colors">
                Recursos
              </Link>
              <Link href="#pricing" className="hover:text-white transition-colors">
                Preços
              </Link>
              <Link href="#testimonials" className="hover:text-white transition-colors">
                Depoimentos
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-blue-950/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 mb-6 sm:mb-8">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              30 dias grátis • Sem cartão de crédito
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
              FINANCEAI
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-4 px-4">
              Descubra para onde vai seu dinheiro. A IA categoriza
              <span className="hidden sm:inline"><br /></span>
              <span className="sm:hidden"> </span>
              seus gastos automaticamente em segundos.
            </p>

            <Link href="/register">
              <Button size="lg" className="mt-6 sm:mt-8 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-6 sm:px-10 h-12 sm:h-14 rounded-xl shadow-lg shadow-blue-600/25">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>

          {/* Devices Preview Section */}
          <div className="relative mt-8 sm:mt-16 mx-auto max-w-6xl">
            {/* Glow effect behind devices */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-purple-600/30 blur-3xl opacity-50" />

            {/* Devices Container */}
            <div className="relative flex items-end justify-center gap-2 sm:gap-4 md:gap-6 px-2">

              {/* Phone - Left (hidden on very small screens) */}
              <div className="hidden sm:block relative z-10 transform -rotate-6 translate-y-4">
                <div className="w-20 sm:w-28 md:w-36 lg:w-44 bg-gray-900 rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 border border-gray-700 shadow-2xl">
                  {/* Phone notch */}
                  <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-1 sm:h-1.5 bg-gray-800 rounded-full" />
                  {/* Phone screen */}
                  <div className="bg-gray-950 rounded-xl sm:rounded-2xl p-2 sm:p-3 h-40 sm:h-56 md:h-72 lg:h-80 overflow-hidden">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-center">
                        <p className="text-gray-500 text-[6px] sm:text-[8px]">Saldo</p>
                        <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm">R$ 12.450</p>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[8px] sm:text-xs">🍔</span>
                            <div className="flex-1">
                              <p className="text-white text-[6px] sm:text-[8px] font-medium">iFood</p>
                              <p className="text-gray-500 text-[5px] sm:text-[6px]">Alimentação</p>
                            </div>
                            <span className="text-red-400 text-[6px] sm:text-[8px]">-R$45</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[8px] sm:text-xs">🚗</span>
                            <div className="flex-1">
                              <p className="text-white text-[6px] sm:text-[8px] font-medium">Uber</p>
                              <p className="text-gray-500 text-[5px] sm:text-[6px]">Transporte</p>
                            </div>
                            <span className="text-red-400 text-[6px] sm:text-[8px]">-R$28</span>
                          </div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-1.5 sm:p-2 border border-green-500/20">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[8px] sm:text-xs">💰</span>
                            <div className="flex-1">
                              <p className="text-white text-[6px] sm:text-[8px] font-medium">Salário</p>
                              <p className="text-gray-500 text-[5px] sm:text-[6px]">Receita</p>
                            </div>
                            <span className="text-green-400 text-[6px] sm:text-[8px]">+R$5.5k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop - Center (Main) */}
              <div className="relative z-20 w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl">
                {/* Laptop Screen */}
                <div className="bg-gray-800 rounded-t-lg sm:rounded-t-xl p-1 sm:p-2 border-t border-x border-gray-600">
                  {/* Screen bezel top */}
                  <div className="flex justify-center py-0.5 sm:py-1">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-600 rounded-full" />
                  </div>
                  {/* Screen content */}
                  <div className="bg-gray-950 rounded-lg p-2 sm:p-4 md:p-6">
                    {/* Dashboard header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-6">
                      <div>
                        <p className="text-gray-400 text-[8px] sm:text-xs">Saldo total</p>
                        <p className="text-lg sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          R$ 12.450,00
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        <span className="text-green-400 font-medium text-[10px] sm:text-sm">+12% este mês</span>
                      </div>
                    </div>

                    {/* Transaction cards */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-white/5">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-1 sm:p-1.5 bg-red-500/10 rounded-lg">
                            <span className="text-xs sm:text-lg">🍔</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[8px] sm:text-sm truncate">iFood</p>
                            <p className="text-[6px] sm:text-xs text-gray-500 truncate">Alimentação • IA</p>
                          </div>
                          <span className="text-red-400 font-semibold text-[8px] sm:text-sm">-R$ 45</span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-white/5">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-1 sm:p-1.5 bg-blue-500/10 rounded-lg">
                            <span className="text-xs sm:text-lg">🚗</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[8px] sm:text-sm truncate">Uber</p>
                            <p className="text-[6px] sm:text-xs text-gray-500 truncate">Transporte • IA</p>
                          </div>
                          <span className="text-red-400 font-semibold text-[8px] sm:text-sm">-R$ 28</span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-white/5">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-1 sm:p-1.5 bg-green-500/10 rounded-lg">
                            <span className="text-xs sm:text-lg">💰</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[8px] sm:text-sm truncate">Salário</p>
                            <p className="text-[6px] sm:text-xs text-gray-500 truncate">Receita</p>
                          </div>
                          <span className="text-green-400 font-semibold text-[8px] sm:text-sm">+R$ 5.5k</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                      <div className="text-center p-1.5 sm:p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg sm:rounded-xl border border-green-500/10">
                        <p className="text-sm sm:text-xl md:text-2xl font-bold text-green-400">R$ 5.5k</p>
                        <p className="text-[6px] sm:text-xs text-gray-500 mt-0.5">Receitas</p>
                      </div>
                      <div className="text-center p-1.5 sm:p-3 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg sm:rounded-xl border border-red-500/10">
                        <p className="text-sm sm:text-xl md:text-2xl font-bold text-red-400">R$ 2.3k</p>
                        <p className="text-[6px] sm:text-xs text-gray-500 mt-0.5">Despesas</p>
                      </div>
                      <div className="text-center p-1.5 sm:p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg sm:rounded-xl border border-blue-500/10">
                        <p className="text-sm sm:text-xl md:text-2xl font-bold text-blue-400">R$ 3.1k</p>
                        <p className="text-[6px] sm:text-xs text-gray-500 mt-0.5">Economia</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-2 sm:h-4 rounded-b-lg mx-auto w-[105%] -ml-[2.5%]" />
                <div className="bg-gradient-to-b from-gray-600 to-gray-700 h-1 sm:h-2 rounded-b-xl mx-auto w-[90%]" />
              </div>

              {/* Tablet - Right (hidden on very small screens) */}
              <div className="hidden sm:block relative z-10 transform rotate-6 translate-y-4">
                <div className="w-24 sm:w-36 md:w-48 lg:w-56 bg-gray-900 rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-gray-700 shadow-2xl">
                  {/* Tablet screen */}
                  <div className="bg-gray-950 rounded-lg sm:rounded-xl p-2 sm:p-3 h-36 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                    {/* Budget progress view */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-center mb-2 sm:mb-4">
                        <p className="text-gray-400 text-[7px] sm:text-[9px]">Orçamentos do mês</p>
                        <p className="text-white font-bold text-xs sm:text-sm md:text-base">Janeiro 2024</p>
                      </div>

                      {/* Budget items */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[7px] sm:text-[9px] text-gray-300">🍔 Alimentação</span>
                            <span className="text-[6px] sm:text-[8px] text-yellow-400">75%</span>
                          </div>
                          <div className="h-1 sm:h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[7px] sm:text-[9px] text-gray-300">🚗 Transporte</span>
                            <span className="text-[6px] sm:text-[8px] text-green-400">45%</span>
                          </div>
                          <div className="h-1 sm:h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[7px] sm:text-[9px] text-gray-300">🎮 Lazer</span>
                            <span className="text-[6px] sm:text-[8px] text-red-400">92%</span>
                          </div>
                          <div className="h-1 sm:h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[92%] bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[7px] sm:text-[9px] text-gray-300">🏠 Moradia</span>
                            <span className="text-[6px] sm:text-[8px] text-blue-400">60%</span>
                          </div>
                          <div className="h-1 sm:h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[60%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 sm:mt-12 px-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 sm:px-6 py-2 sm:py-3 rounded-full cursor-pointer transition-colors">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
              <span className="font-medium text-xs sm:text-base">Contas</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 sm:px-6 py-2 sm:py-3 rounded-full cursor-pointer transition-colors">
              <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
              <span className="font-medium text-xs sm:text-base">Transações</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 sm:px-6 py-2 sm:py-3 rounded-full cursor-pointer transition-colors">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              <span className="font-medium text-xs sm:text-base">Orçamentos</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 sm:px-6 py-2 sm:py-3 rounded-full cursor-pointer transition-colors">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              <span className="font-medium text-xs sm:text-base">Insights IA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
            Você sabe para onde vai seu dinheiro?
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-8 px-2">
            87% das pessoas não conseguem responder essa pergunta.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Todo mês o salário cai e... desaparece.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            O FinanceAI resolve isso em 10 segundos por dia
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Tudo que você precisa
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              Recursos pensados para simplificar sua vida financeira
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Sparkles,
                title: 'IA que categoriza',
                description: 'Digite "ifood 45" e a IA já sabe que é alimentação. Automático.',
                color: 'from-yellow-500/20 to-orange-500/20',
                iconColor: 'text-yellow-400',
              },
              {
                icon: Bell,
                title: 'Alertas de limite',
                description: 'Defina limites por categoria e receba alertas antes de estourar.',
                color: 'from-red-500/20 to-pink-500/20',
                iconColor: 'text-red-400',
              },
              {
                icon: BarChart3,
                title: 'Relatórios claros',
                description: 'Veja exatamente para onde vai seu dinheiro com gráficos simples.',
                color: 'from-blue-500/20 to-cyan-500/20',
                iconColor: 'text-blue-400',
              },
              {
                icon: Clock,
                title: 'Rápido de verdade',
                description: 'Adicione um gasto em 3 toques. Menos de 10 segundos.',
                color: 'from-green-500/20 to-emerald-500/20',
                iconColor: 'text-green-400',
              },
              {
                icon: PiggyBank,
                title: 'Múltiplas contas',
                description: 'Nubank, Itaú, carteira... Todas suas contas em um só lugar.',
                color: 'from-purple-500/20 to-violet-500/20',
                iconColor: 'text-purple-400',
              },
              {
                icon: Shield,
                title: 'Dados seguros',
                description: 'Criptografia de ponta. Seus dados financeiros protegidos.',
                color: 'from-cyan-500/20 to-teal-500/20',
                iconColor: 'text-cyan-400',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${feature.iconColor}`}>
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
              3 passos simples
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              Menos de 2 minutos para começar
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                step: '01',
                title: 'Crie sua conta grátis',
                description: 'Só precisa do seu email. Em 30 segundos você já está dentro.',
              },
              {
                step: '02',
                title: 'Configure seu salário',
                description: 'Diga quanto você ganha e quando recebe. O app te avisa quando o dinheiro entrar.',
              },
              {
                step: '03',
                title: 'Registre seus gastos',
                description: 'Toque no botão +, digite o valor e a descrição. A IA organiza o resto.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 sm:gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-2xl text-white shadow-lg shadow-blue-600/25">
                  {item.step}
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Investimento que se paga
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              Quem usa economiza em média R$ 400/mês
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2 text-white">Gratuito</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Para experimentar</p>
              <div className="mb-6 sm:mb-8">
                <span className="text-4xl sm:text-5xl font-bold text-white">R$ 0</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {['30 dias completos', 'Todas as funcionalidades', 'IA para categorização', 'Sem cartão de crédito'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full h-10 sm:h-12 border-white/20 text-white hover:bg-white/10 text-sm sm:text-base">
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-500/30">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                Mais popular
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2 text-white">Pro</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Para quem quer resultados</p>
              <div className="mb-6 sm:mb-8">
                <span className="text-4xl sm:text-5xl font-bold text-white">R$ 19</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {['Tudo do plano gratuito', 'Contas ilimitadas', 'Relatórios avançados', 'Suporte prioritário', 'Exportar dados'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                  Começar teste grátis
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6 sm:mt-8 text-xs sm:text-sm">
            Cancele a qualquer momento. Sem multas ou taxas escondidas.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
              Quem usa, recomenda
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              Mais de 2.000 pessoas controlando suas finanças
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Maria S.',
                text: 'Finalmente um app que eu consigo usar! Não preciso ser expert em finanças. Em 2 meses já economizei R$ 800.',
                role: 'Professora',
              },
              {
                name: 'Carlos R.',
                text: 'A IA categorizar automático é genial. Economizo muito tempo e finalmente sei pra onde vai meu dinheiro.',
                role: 'Autônomo',
              },
              {
                name: 'Ana L.',
                text: 'Simples assim que eu queria. Sem frescura, vai direto ao ponto. Melhor investimento que fiz esse ano.',
                role: 'Estudante',
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
              >
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Comece a economizar hoje
          </h2>

          <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-10 px-2">
            30 dias grátis para testar tudo. Sem cartão, sem compromisso.
          </p>

          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-8 sm:px-12 h-14 sm:h-16 rounded-xl shadow-lg shadow-blue-600/25">
              Criar minha conta grátis
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-gray-400 text-sm sm:text-base">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              30 dias grátis
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">FinanceAI</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            © 2024 FinanceAI. Feito com simplicidade em mente.
          </p>
        </div>
      </footer>
    </div>
  );
}
