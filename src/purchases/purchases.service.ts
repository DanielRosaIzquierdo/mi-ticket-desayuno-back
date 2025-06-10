import { Injectable } from '@nestjs/common';

import { PurchasesRepository } from './purchases.repository';
import { Purchase } from './interfaces/purchase.interface';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class PurchasesService {
    constructor(private readonly purchasesRepository: PurchasesRepository, private readonly authRepository: AuthRepository) { }

    async getPurchaseHistory(userId: string): Promise<Purchase[]> {
        return await this.purchasesRepository.findPurchasesByUser(userId);
    }

    async registerPurchase(purchaseData: PurchasePayloadDto): Promise<string> {
        if (purchaseData.discountId !== '') {
            await this.authRepository.addUsedDiscountToUser(purchaseData.userId, purchaseData.discountId);
        }
        return await this.purchasesRepository.savePurchase(purchaseData);
    }

    async getTopPurchasers(): Promise<{ email: string; purchaseCount: number }[]> {
        return await this.purchasesRepository.findTopPurchasers();
    }

    async getTopSpenders(): Promise<{ email: string; totalSpent: number }[]> {
        return await this.purchasesRepository.findTopSpenders();
    }

    async getAllPurchases(): Promise<Purchase[]> {
        return await this.purchasesRepository.findAllPurchases();
    }

    async deleteAllPurchases(): Promise<void> {
        await this.purchasesRepository.deleteAllPurchases();
    }
}
