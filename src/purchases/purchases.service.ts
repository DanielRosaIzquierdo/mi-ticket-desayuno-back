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

    async registerPurchase(userId: string, purchaseData: PurchasePayloadDto): Promise<string> {
        return await this.purchasesRepository.savePurchase(userId, purchaseData);
    }

}
