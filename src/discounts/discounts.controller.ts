import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscountsService } from './discounts.service';
import { DiscountPayloadDto } from './dtos/discount.payload.dto';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDiscounts() {
    return await this.discountsService.getDiscounts();
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  async getDiscountProgress(@Query('userId') userId: string) {
    return await this.discountsService.getDiscountProgress(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDiscount(@Body() discountData: DiscountPayloadDto) {
    const discountId = await this.discountsService.createDiscount(discountData);
    return { discountId };
  }
}
