import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TransactionType } from '@prisma/client';
import type { User } from '@prisma/client';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('insights')
  @ApiOperation({ summary: 'Gerar insights financeiros com IA' })
  async getInsights(@CurrentUser() user: User) {
    const insights = await this.aiService.generateInsights(user.id);
    return { insights };
  }

  @Post('suggest-category')
  @ApiOperation({ summary: 'Sugerir categoria para uma descrição' })
  async suggestCategory(
    @Body() body: { description: string; type: TransactionType },
  ) {
    const suggestion = await this.aiService.suggestCategory(body.description, body.type);
    return { suggestion };
  }
}
