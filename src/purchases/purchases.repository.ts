import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Purchase } from './interfaces/purchase.interface';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';

@Injectable()
export class PurchasesRepository {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin) { }

    async findPurchasesByUser(userId: string): Promise<Purchase[]> {
        const firestore = this.firebaseAdmin.firestore();
        const purchasesSnapshot = await firestore
            .collection('purchases')
            .where('userId', '==', userId)
            .get();

        if (purchasesSnapshot.empty) {
            return [];
        }

        const purchases: Purchase[] = [];
        purchasesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const purchase: Purchase = {
                id: doc.id,
                userId: data.userId,
                products: data.products,
                totalAmount: data.totalAmount,
                date: data.date.toDate(),
            };
            purchases.push(purchase);
        });
        return purchases;
    }

    async savePurchase(userId: string, purchase: PurchasePayloadDto): Promise<string> {
        const firestore = this.firebaseAdmin.firestore();
        const purchaseRef = await firestore.collection('purchases').add({ userId, ...purchase });
        return purchaseRef.id;
    }
}
