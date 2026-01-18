import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TransactionType } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  async findAll(
    @CurrentUser() user: User,
    @Query('type') type?: TransactionType,
  ) {
    if (type) {
      return this.categoriesService.findByType(user.id, type);
    }
    return this.categoriesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar categoria personalizada' })
  async create(
    @CurrentUser() user: User,
    @Body() data: { name: string; icon: string; color: string; type: TransactionType },
  ) {
    return this.categoriesService.create(user.id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: { name?: string; icon?: string; color?: string },
  ) {
    return this.categoriesService.update(user.id, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar categoria' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.categoriesService.delete(user.id, id);
  }
}
