import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscountsService } from './discounts.service';
import { DiscountPayloadDto } from './dtos/discount.payload.dto';
import { Role } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDiscounts() {
    return await this.discountsService.getDiscounts();
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  async getDiscountProgress(@Request() req) {
    const userId: string = req.user.sub;    
    return await this.discountsService.getDiscountProgress(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('stablishment')
  async createDiscount(@Body() discountData: DiscountPayloadDto) {
    const discountId = await this.discountsService.createDiscount(discountData);
    return { discountId };
  }
}
