import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Criar categorias padrão para o usuário
    await this.createDefaultCategories(user.id);

    // Nota: Conta bancária será criada no onboarding pelo usuário

    // Gerar token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        plan: user.plan,
      },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        plan: user.plan,
      },
      accessToken: token,
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }

  private async createDefaultCategories(userId: string) {
    const defaultCategories = [
      // DESPESAS
      { name: 'Alimentação', icon: '🍔', color: '#ef4444', type: 'EXPENSE' as const },
      { name: 'Transporte', icon: '🚗', color: '#f97316', type: 'EXPENSE' as const },
      { name: 'Moradia', icon: '🏠', color: '#eab308', type: 'EXPENSE' as const },
      { name: 'Saúde', icon: '💊', color: '#22c55e', type: 'EXPENSE' as const },
      { name: 'Educação', icon: '📚', color: '#3b82f6', type: 'EXPENSE' as const },
      { name: 'Lazer', icon: '🎮', color: '#8b5cf6', type: 'EXPENSE' as const },
      { name: 'Compras', icon: '🛒', color: '#ec4899', type: 'EXPENSE' as const },
      { name: 'Serviços', icon: '📱', color: '#6366f1', type: 'EXPENSE' as const },
      { name: 'Outros', icon: '📦', color: '#64748b', type: 'EXPENSE' as const },
      // RECEITAS
      { name: 'Salário', icon: '💰', color: '#22c55e', type: 'INCOME' as const },
      { name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'INCOME' as const },
      { name: 'Investimentos', icon: '📈', color: '#8b5cf6', type: 'INCOME' as const },
      { name: 'Outros', icon: '💵', color: '#64748b', type: 'INCOME' as const },
    ];

    await this.prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        ...cat,
        userId,
        isSystem: false,
      })),
    });
  }
}
