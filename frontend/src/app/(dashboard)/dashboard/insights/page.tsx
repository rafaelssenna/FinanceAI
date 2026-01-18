'use client';

import { useState } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Loader2,
  Sparkles,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInsights } from '@/hooks/use-dashboard';
import { useTransactionSummary, useTransactionsByCategory } from '@/hooks/use-dashboard';
import { useBudgetProgress } from '@/hooks/use-budgets';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Parse insights text into structured sections
function parseInsights(text: string): { title: string; content: string; type: 'tip' | 'warning' | 'success' | 'info' }[] {
  if (!text) return [];

  const sections: { title: string; content: string; type: 'tip' | 'warning' | 'success' | 'info' }[] = [];

  // Simple parsing - split by common patterns
  const lines = text.split('\n').filter(line => line.trim());

  let currentSection: { title: string; content: string; type: 'tip' | 'warning' | 'success' | 'info' } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if it's a header line
    if (trimmed.startsWith('##') || trimmed.startsWith('**') || trimmed.match(/^\d+\./)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const title = trimmed
        .replace(/^#+\s*/, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(/^\d+\.\s*/, '');

      // Determine type based on keywords
      let type: 'tip' | 'warning' | 'success' | 'info' = 'info';
      const lowerTitle = title.toLowerCase();

      if (lowerTitle.includes('alert') || lowerTitle.includes('cuidado') || lowerTitle.includes('atenção')) {
        type = 'warning';
      } else if (lowerTitle.includes('dica') || lowerTitle.includes('sugestão') || lowerTitle.includes('tip')) {
        type = 'tip';
      } else if (lowerTitle.includes('parabéns') || lowerTitle.includes('ótimo') || lowerTitle.includes('sucesso')) {
        type = 'success';
      }

      currentSection = { title, content: '', type };
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? ' ' : '') + trimmed;
    } else {
      // No section yet, create a default one
      currentSection = { title: 'Resumo', content: trimmed, type: 'info' };
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections were parsed, create one from the whole text
  if (sections.length === 0 && text.trim()) {
    sections.push({ title: 'Análise Financeira', content: text, type: 'info' });
  }

  return sections;
}

export default function InsightsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: insights, isLoading: insightsLoading, refetch } = useInsights();

  // Get current month data for quick stats
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: summary } = useTransactionSummary(startDate, endDate);
  const { data: categoryData } = useTransactionsByCategory(startDate, endDate);
  const { data: budgetProgress } = useBudgetProgress(currentDate.getMonth() + 1, currentDate.getFullYear());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const parsedInsights = insights?.insights ? parseInsights(insights.insights) : [];

  // Calculate some quick stats
  const topCategory = categoryData?.sort((a, b) => b.total - a.total)[0];
  const overBudgetCategories = budgetProgress?.filter(b => b.isOverBudget) || [];
  const savingsRate = summary ? ((summary.totalIncome - summary.totalExpense) / summary.totalIncome * 100) : 0;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  const getBadgeForType = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Alerta</Badge>;
      case 'tip':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Dica</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-green-500 border-green-500">Positivo</Badge>;
      default:
        return <Badge variant="outline" className="text-purple-500 border-purple-500">Análise</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Insights IA
          </h1>
          <p className="text-muted-foreground">
            Análises inteligentes das suas finanças com Gemini
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || insightsLoading}
          variant="outline"
        >
          {(isRefreshing || insightsLoading) ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Atualizar Insights
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanço do Mês</CardTitle>
            {summary && summary.balance >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary && summary.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(summary?.balance || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Economia</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-green-500' : savingsRate >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
              {isNaN(savingsRate) ? '0' : savingsRate.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {savingsRate >= 20 ? 'Excelente!' : savingsRate >= 10 ? 'Bom!' : 'Pode melhorar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {topCategory ? (
              <>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <span>{topCategory.categoryIcon}</span>
                  <span>{topCategory.categoryName}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(topCategory.total)} ({topCategory.percentage.toFixed(0)}%)
                </p>
              </>
            ) : (
              <div className="text-muted-foreground">Sem dados</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Estourados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overBudgetCategories.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {overBudgetCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {overBudgetCategories.length > 0
                ? overBudgetCategories.map(b => b.categoryName).join(', ')
                : 'Tudo sob controle!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Análise Inteligente
          </CardTitle>
          <CardDescription>
            Powered by Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insightsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
              <p className="text-muted-foreground">Analisando suas finanças...</p>
              <p className="text-xs text-muted-foreground mt-2">
                A IA está processando seus dados
              </p>
            </div>
          ) : parsedInsights.length > 0 ? (
            <div className="space-y-4">
              {parsedInsights.map((section, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIconForType(section.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{section.title}</h3>
                        {getBadgeForType(section.type)}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Sem insights disponíveis</p>
              <p className="text-muted-foreground mt-2">
                Adicione algumas transações para que a IA possa analisar seus hábitos financeiros
              </p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Dicas de Economia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">50</span>
              <div>
                <p className="font-medium">Regra 50/30/20</p>
                <p className="text-sm text-muted-foreground">
                  50% para necessidades, 30% para desejos, 20% para poupança
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">7</span>
              <div>
                <p className="font-medium">Regra dos 7 dias</p>
                <p className="text-sm text-muted-foreground">
                  Espere 7 dias antes de fazer compras não essenciais
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">3</span>
              <div>
                <p className="font-medium">Fundo de Emergência</p>
                <p className="text-sm text-muted-foreground">
                  Tenha pelo menos 3-6 meses de despesas guardados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!budgetProgress || budgetProgress.length === 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-2xl">1</span>
                <div>
                  <p className="font-medium">Crie seu primeiro orçamento</p>
                  <p className="text-sm text-muted-foreground">
                    Defina limites de gastos por categoria para ter mais controle
                  </p>
                </div>
              </div>
            ) : null}

            {overBudgetCategories.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Revise seus gastos</p>
                  <p className="text-sm text-muted-foreground">
                    {overBudgetCategories.length} categoria(s) estão acima do orçamento
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">2</span>
              <div>
                <p className="font-medium">Registre transações diariamente</p>
                <p className="text-sm text-muted-foreground">
                  Quanto mais dados, melhores serão os insights da IA
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">3</span>
              <div>
                <p className="font-medium">Revise semanalmente</p>
                <p className="text-sm text-muted-foreground">
                  Acompanhe seu progresso toda semana para manter o foco
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
