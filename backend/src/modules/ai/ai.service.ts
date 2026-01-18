import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType } from '@prisma/client';

interface CategoryResult {
  categoryId: string;
  categoryName: string;
  confidence: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  // Regex patterns para categorização rápida (sem custo)
  private readonly regexPatterns: Record<string, RegExp> = {
    'Alimentação': /ifood|uber\s*eats|rappi|restaurante|lanchonete|padaria|mercado|supermercado|açougue|hortifruti|pizza|hamburguer|sushi|comida|almoço|jantar|café|lanche/i,
    'Transporte': /uber|99|taxi|cabify|combustivel|gasolina|alcool|etanol|estacionamento|pedágio|onibus|metrô|passagem|bilhete/i,
    'Moradia': /aluguel|condominio|iptu|luz|energia|agua|gás|internet|wifi|manutenção|reforma/i,
    'Saúde': /farmacia|drogaria|medico|consulta|exame|hospital|clinica|dentista|academia|gym|crossfit/i,
    'Educação': /escola|faculdade|curso|livro|apostila|udemy|alura|coursera|material\s*escolar/i,
    'Lazer': /netflix|spotify|disney|hbo|amazon\s*prime|cinema|teatro|show|ingresso|viagem|hotel|airbnb|jogo|game|steam|playstation|xbox/i,
    'Compras': /shopping|loja|roupa|calçado|sapato|tênis|eletronico|celular|notebook|amazon|mercado\s*livre|shopee|magalu|americanas/i,
    'Serviços': /celular|telefone|plano|assinatura|seguro|banco|tarifa|anuidade|mensalidade/i,
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'sua-chave-gemini-aqui') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.logger.log('Gemini AI inicializado com sucesso');
    } else {
      this.logger.warn('GEMINI_API_KEY não configurada. Usando apenas categorização por regex.');
    }
  }

  async categorizeTransaction(
    description: string,
    amount: number,
    type: TransactionType,
    userId: string,
  ): Promise<CategoryResult | null> {
    // 1. Primeiro, tentar categorização por regex (instantâneo, grátis)
    const regexResult = this.categorizeByRegex(description);
    if (regexResult) {
      const category = await this.findCategoryByName(userId, regexResult, type);
      if (category) {
        this.logger.debug(`Categorizado por regex: ${description} -> ${regexResult}`);
        return {
          categoryId: category.id,
          categoryName: category.name,
          confidence: 0.9,
        };
      }
    }

    // 2. Se não conseguiu com regex e Gemini está configurado, usar IA
    if (this.model) {
      try {
        const geminiResult = await this.categorizeWithGemini(description, amount, type);
        if (geminiResult) {
          const category = await this.findCategoryByName(userId, geminiResult.category, type);
          if (category) {
            this.logger.debug(`Categorizado por Gemini: ${description} -> ${geminiResult.category}`);
            return {
              categoryId: category.id,
              categoryName: category.name,
              confidence: geminiResult.confidence,
            };
          }
        }
      } catch (error) {
        this.logger.error('Erro ao categorizar com Gemini:', error);
      }
    }

    return null;
  }

  private categorizeByRegex(description: string): string | null {
    for (const [category, pattern] of Object.entries(this.regexPatterns)) {
      if (pattern.test(description)) {
        return category;
      }
    }
    return null;
  }

  private async categorizeWithGemini(
    description: string,
    amount: number,
    type: TransactionType,
  ): Promise<{ category: string; confidence: number } | null> {
    const prompt = `Você é um especialista em finanças pessoais brasileiro.
Categorize a transação abaixo em UMA das categorias disponíveis.

TRANSAÇÃO:
Descrição: ${description}
Valor: R$ ${amount.toFixed(2)}
Tipo: ${type === 'EXPENSE' ? 'Despesa' : 'Receita'}

CATEGORIAS DISPONÍVEIS (escolha apenas UMA):
${type === 'EXPENSE'
  ? '- Alimentação\n- Transporte\n- Moradia\n- Saúde\n- Educação\n- Lazer\n- Compras\n- Serviços\n- Outros'
  : '- Salário\n- Freelance\n- Investimentos\n- Outros'
}

Responda APENAS em JSON válido, sem markdown:
{"categoria": "nome_da_categoria", "confianca": 0.0-1.0}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Limpar resposta e fazer parse
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanedResponse);

      return {
        category: parsed.categoria,
        confidence: parsed.confianca,
      };
    } catch (error) {
      this.logger.error('Erro ao fazer parse da resposta do Gemini:', error);
      return null;
    }
  }

  private async findCategoryByName(userId: string, name: string, type: TransactionType) {
    return this.prisma.category.findFirst({
      where: {
        OR: [{ userId }, { isSystem: true }],
        name: { equals: name, mode: 'insensitive' },
        type,
        isActive: true,
      },
    });
  }

  async generateInsights(userId: string): Promise<string> {
    if (!this.model) {
      return 'Configure sua chave do Gemini para receber insights personalizados.';
    }

    // Buscar dados do usuário
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Buscar gastos por categoria
    const expenses = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        accountId: { in: accountIds },
        type: 'EXPENSE',
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    // Buscar nomes das categorias
    const categories = await this.prisma.category.findMany({
      where: { id: { in: expenses.map((e) => e.categoryId) } },
    });

    const gastosFormatados = expenses.map((e) => {
      const cat = categories.find((c) => c.id === e.categoryId);
      return `${cat?.name || 'Outros'}: R$ ${Number(e._sum.amount || 0).toFixed(2)}`;
    }).join('\n');

    // Buscar receitas
    const incomes = await this.prisma.transaction.aggregate({
      where: {
        accountId: { in: accountIds },
        type: 'INCOME',
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    const totalReceitas = Number(incomes._sum.amount || 0);
    const totalDespesas = expenses.reduce((sum, e) => sum + Number(e._sum.amount || 0), 0);

    const prompt = `Você é um assessor financeiro pessoal brasileiro.
Analise os dados financeiros abaixo e forneça 3 insights curtos e práticos.

PERÍODO: ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}

RECEITAS: R$ ${totalReceitas.toFixed(2)}
DESPESAS: R$ ${totalDespesas.toFixed(2)}
SALDO: R$ ${(totalReceitas - totalDespesas).toFixed(2)}

GASTOS POR CATEGORIA:
${gastosFormatados || 'Nenhum gasto registrado'}

Forneça 3 insights curtos (máximo 2 linhas cada) em português brasileiro.
Seja direto e prático. Use emojis para tornar mais visual.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Erro ao gerar insights:', error);
      return 'Não foi possível gerar insights no momento. Tente novamente mais tarde.';
    }
  }

  async suggestCategory(description: string, type: TransactionType): Promise<string | null> {
    // Primeiro tenta regex
    const regexResult = this.categorizeByRegex(description);
    if (regexResult) return regexResult;

    // Se não encontrou e Gemini está disponível
    if (this.model && description.length > 3) {
      try {
        const result = await this.categorizeWithGemini(description, 0, type);
        if (result && result.confidence > 0.7) {
          return result.category;
        }
      } catch (error) {
        this.logger.error('Erro ao sugerir categoria:', error);
      }
    }

    return null;
  }
}
