import { Body, Controller, Get, Post, Request, UseGuards, Delete, Param, NotFoundException } from '@nestjs/common';
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


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('stablishment')
  async deleteDiscount(@Param('id') id: string) {
    const deleted = await this.discountsService.deleteDiscount(id);
    if (!deleted) {
      throw new NotFoundException('Discount not found');
    }
    return { message: 'Discount deleted successfully' };
  }
}
