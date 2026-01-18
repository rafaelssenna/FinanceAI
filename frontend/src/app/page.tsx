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
              <Button size="sm">Comecar gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Com inteligencia artificial
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Controle seu dinheiro
            <span className="text-primary"> em 10 segundos</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Esqueca planilhas complicadas. Adicione seus gastos com um toque
            e deixe a IA organizar tudo pra voce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-14 w-full sm:w-auto">
                Comecar agora - e gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Sem cartao de credito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Gratis para sempre
            </div>
          </div>
        </div>
      </section>

      {/* Demo/Preview */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-3xl p-8 md:p-12 border shadow-2xl">
            <div className="bg-background rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Seu saldo</p>
                  <p className="text-3xl font-bold">R$ 2.450,00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500">+ R$ 350 este mes</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍔</span>
                    <div>
                      <p className="font-medium">iFood</p>
                      <p className="text-xs text-muted-foreground">Alimentacao - Hoje</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-semibold">- R$ 45,00</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="font-medium">Uber</p>
                      <p className="text-xs text-muted-foreground">Transporte - Ontem</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-semibold">- R$ 22,00</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-medium">Salario</p>
                      <p className="text-xs text-muted-foreground">Receita - 05/01</p>
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
              Por que o FinanceAI e diferente?
            </h2>
            <p className="text-muted-foreground text-lg">
              Feito pra quem quer simplicidade, nao complicacao
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">IA que entende voce</h3>
                <p className="text-muted-foreground">
                  Escreva "ifood 45" e a IA ja sabe que e alimentacao.
                  Zero configuracao.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rapido de verdade</h3>
                <p className="text-muted-foreground">
                  Adicione um gasto em 3 toques. Menos de 10 segundos
                  do seu tempo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simples de entender</h3>
                <p className="text-muted-foreground">
                  Nada de graficos confusos. So o que voce precisa saber:
                  quanto tem e quanto pode gastar.
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
              Como funciona
            </h2>
            <p className="text-muted-foreground text-lg">
              3 passos simples pra comecar
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Crie sua conta gratis</h3>
                <p className="text-muted-foreground">
                  So precisa do seu email. Em 30 segundos voce ja esta dentro.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Adicione seus gastos</h3>
                <p className="text-muted-foreground">
                  Toque no botao +, digite o valor e a descricao. A IA organiza o resto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Veja pra onde vai seu dinheiro</h3>
                <p className="text-muted-foreground">
                  Acompanhe seus gastos e receba alertas quando estiver gastando muito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que estao dizendo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Maria S.',
                text: 'Finalmente um app que eu consigo usar! Nao preciso ser expert em financas.',
                role: 'Professora'
              },
              {
                name: 'Carlos R.',
                text: 'A IA categorizar automatico e genial. Economizo muito tempo.',
                role: 'Autonomo'
              },
              {
                name: 'Ana L.',
                text: 'Simples assim que eu queria. Sem frescura, vai direto ao ponto.',
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
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Comece em menos de 1 minuto
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto pra controlar seu dinheiro?
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de pessoas que ja simplificaram suas financas.
          </p>

          <Link href="/register">
            <Button size="lg" className="text-lg px-10 h-14">
              Criar minha conta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Gratis para sempre. Sem pegadinhas.
          </p>
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
            2024 FinanceAI. Feito com simplicidade em mente.
          </p>
        </div>
      </footer>
    </div>
  );
}
