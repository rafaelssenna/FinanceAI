'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">FinanceAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Teste grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            30 dias grátis • Sem cartão de crédito
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Pare de perder dinheiro
            <span className="text-primary"> sem saber onde</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            87% das pessoas não sabem pra onde vai o salário. Com o FinanceAI,
            você descobre em segundos e a IA te ajuda a economizar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-14 w-full sm:w-auto">
                Começar meu teste grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              30 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Cancele quando quiser
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Suporte em português
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-12 px-4 bg-red-500/5 border-y border-red-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Você já se perguntou: "Cadê meu dinheiro?"
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Todo mês a mesma história. O salário cai e desaparece. Você não sabe se pode
            comprar aquele café ou se vai faltar no fim do mês.
          </p>
          <p className="text-primary font-semibold text-lg">
            O FinanceAI resolve isso em 10 segundos por dia.
          </p>
        </div>
      </section>

      {/* Demo/Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Veja como é simples</h2>
            <p className="text-muted-foreground">Interface limpa, sem complicação</p>
          </div>

          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-3xl p-8 md:p-12 border shadow-2xl">
            <div className="bg-background rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Seu saldo</p>
                  <p className="text-3xl font-bold">R$ 2.450,00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    + R$ 350 este mês
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍔</span>
                    <div>
                      <p className="font-medium">iFood</p>
                      <p className="text-xs text-muted-foreground">Alimentação • Categorizado pela IA</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-semibold">- R$ 45,00</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="font-medium">Uber</p>
                      <p className="text-xs text-muted-foreground">Transporte • Categorizado pela IA</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-semibold">- R$ 22,00</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-medium">Salário</p>
                      <p className="text-xs text-muted-foreground">Receita • 05/01</p>
                    </div>
                  </div>
                  <span className="text-green-500 font-semibold">+ R$ 3.500,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para controlar suas finanças
            </h2>
            <p className="text-muted-foreground text-lg">
              Recursos pensados para facilitar sua vida, não complicar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">IA que categoriza sozinha</h3>
                <p className="text-muted-foreground">
                  Digite "ifood 45" e a IA já sabe que é alimentação.
                  Você economiza tempo em cada lançamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Alertas de limite</h3>
                <p className="text-muted-foreground">
                  Defina limites por categoria e receba alertas antes de estourar.
                  Nunca mais seja pego de surpresa.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Relatórios claros</h3>
                <p className="text-muted-foreground">
                  Veja exatamente pra onde vai seu dinheiro.
                  Gráficos simples que qualquer pessoa entende.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rápido de verdade</h3>
                <p className="text-muted-foreground">
                  Adicione um gasto em 3 toques. Menos de 10 segundos
                  do seu tempo por lançamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Múltiplas contas</h3>
                <p className="text-muted-foreground">
                  Nubank, Itaú, carteira... Organize todas as suas contas
                  em um só lugar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seus dados seguros</h3>
                <p className="text-muted-foreground">
                  Criptografia de ponta. Seus dados financeiros
                  ficam protegidos e privados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comece em 3 passos simples
            </h2>
            <p className="text-muted-foreground text-lg">
              Menos de 2 minutos para ter tudo configurado
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Crie sua conta grátis</h3>
                <p className="text-muted-foreground">
                  Só precisa do seu email. Em 30 segundos você já está dentro.
                  Sem cartão de crédito.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Configure seu salário</h3>
                <p className="text-muted-foreground">
                  Diga quanto você ganha e quando recebe. O app te avisa quando
                  o dinheiro entrar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Registre seus gastos</h3>
                <p className="text-muted-foreground">
                  Toque no botão +, digite o valor e a descrição. A IA organiza o resto
                  automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investimento que se paga sozinho
            </h2>
            <p className="text-muted-foreground text-lg">
              Quem usa o FinanceAI economiza em média R$ 400/mês
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <Card className="border-2">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-semibold mb-2">Gratuito</h3>
                <p className="text-muted-foreground text-sm mb-4">Para experimentar</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    30 dias completos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Todas as funcionalidades
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    IA para categorização
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Sem cartão de crédito
                  </li>
                </ul>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full">
                    Começar grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Mais popular
              </div>
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-muted-foreground text-sm mb-4">Para quem quer resultados</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ 19</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Tudo do plano gratuito
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Contas ilimitadas
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Suporte prioritário
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Exportar dados
                  </li>
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full">
                    Começar teste grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Cancele a qualquer momento. Sem multas ou taxas escondidas.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quem usa, recomenda
            </h2>
            <p className="text-muted-foreground">
              Mais de 2.000 pessoas já controlam suas finanças com o FinanceAI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Maria S.',
                text: 'Finalmente um app que eu consigo usar! Não preciso ser expert em finanças. Em 2 meses já economizei R$ 800.',
                role: 'Professora'
              },
              {
                name: 'Carlos R.',
                text: 'A IA categorizar automático é genial. Economizo muito tempo e finalmente sei pra onde vai meu dinheiro.',
                role: 'Autônomo'
              },
              {
                name: 'Ana L.',
                text: 'Simples assim que eu queria. Sem frescura, vai direto ao ponto. Melhor investimento que fiz esse ano.',
                role: 'Estudante'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="pt-6 pb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comece a economizar hoje
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            30 dias grátis para você testar tudo. Se não gostar, é só cancelar.
            Sem cartão, sem compromisso.
          </p>

          <Link href="/register">
            <Button size="lg" className="text-lg px-10 h-14">
              Criar minha conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              30 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-semibold">FinanceAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FinanceAI. Feito com simplicidade em mente.
          </p>
        </div>
      </footer>
    </div>
  );
}
