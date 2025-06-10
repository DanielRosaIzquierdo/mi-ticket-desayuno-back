import { Injectable, Inject } from '@nestjs/common';
import { DiscountsRepository } from './discounts.repository';

import { Discount } from './interfaces/discount.interface';
import { DiscountPayloadDto } from './dtos/discount.payload.dto';
import { PurchasesService } from 'src/purchases/purchases.service';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly discountsRepository: DiscountsRepository,
    private readonly purchaseService: PurchasesService,
    private readonly authRepository: AuthRepository,
  ) { }

  async deleteDiscount(id: string): Promise<boolean> {
    return await this.discountsRepository.deleteDiscount(id);
  }

  async getDiscounts(): Promise<Discount[]> {
    return await this.discountsRepository.findDiscounts();
  }

  async createDiscount(discountData: DiscountPayloadDto): Promise<string> {
    return await this.discountsRepository.saveDiscount(discountData);
  }

  async getDiscountProgress(userId: string): Promise<{ id: string, type: string, value: number, conditions: string, discount: number, progress: number, }[]> {
    const discounts = await this.discountsRepository.findDiscounts();
    const purchases = await this.purchaseService.getPurchaseHistory(userId);

    const user = await this.authRepository.findUserById(userId);
    const usedDiscounts = user?.usedDiscounts || [];

    return discounts
      .filter(discount => !usedDiscounts.includes(discount.id))
      .map(discount => {
        let progress = 0;

        if (discount.type === 'spending') {
          const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
          progress = Math.min(totalSpent / discount.value, 1);
        } else if (discount.type === 'purchases') {
          const totalPurchases = purchases.length;
          progress = Math.min(totalPurchases / discount.value, 1);
        }

        return {
          id: discount.id,
          type: discount.type,
          value: discount.value,
          conditions: discount.conditions,
          discount: discount.discount,
          progress,
        };
      });
  }
}
