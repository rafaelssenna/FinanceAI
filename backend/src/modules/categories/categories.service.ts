import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ userId }, { isSystem: true }],
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByType(userId: string, type: TransactionType) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ userId }, { isSystem: true }],
        type,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    userId: string,
    data: { name: string; icon: string; color: string; type: TransactionType },
  ) {
    return this.prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    data: { name?: string; icon?: string; color?: string },
  ) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.isSystem) {
      throw new Error('Categorias do sistema não podem ser editadas');
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.isSystem) {
      throw new Error('Categorias do sistema não podem ser deletadas');
    }

    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Categoria deletada com sucesso' };
  }
}
