import { Injectable } from '@nestjs/common';

import { PurchasesRepository } from './purchases.repository';
import { Purchase } from './interfaces/purchase.interface';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';

@Injectable()
export class PurchasesService {
    constructor(private readonly purchasesRepository: PurchasesRepository) { }

    async getPurchaseHistory(userId: string): Promise<Purchase[]> {
        return await this.purchasesRepository.findPurchasesByUser(userId);
    }

    async registerPurchase(purchaseData: PurchasePayloadDto): Promise<string> {
        return await this.purchasesRepository.savePurchase(purchaseData);
    }

     async getTopPurchasers(): Promise<{ userId: string; purchaseCount: number }[]> {
        return await this.purchasesRepository.findTopPurchasers();
    }

    async getTopSpenders(): Promise<{ userId: string; totalSpent: number }[]> {
        return await this.purchasesRepository.findTopSpenders();
    }

    async getAllPurchases(): Promise<Purchase[]> {
        return await this.purchasesRepository.findAllPurchases();
    }
}
