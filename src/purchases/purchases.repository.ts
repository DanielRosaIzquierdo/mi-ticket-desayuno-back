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

    async savePurchase(purchase: PurchasePayloadDto): Promise<string> {
        const firestore = this.firebaseAdmin.firestore();
        const purchaseRef = await firestore.collection('purchases').add({ ...purchase });
        return purchaseRef.id;
    }

    async findTopPurchasers(): Promise<{ userId: string; purchaseCount: number }[]> {
        const firestore = this.firebaseAdmin.firestore();
        const purchasesSnapshot = await firestore.collection('purchases').get();

        if (purchasesSnapshot.empty) {
            return [];
        }

        const userPurchaseCounts: Record<string, number> = {};

        purchasesSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const userId = data.userId;
            userPurchaseCounts[userId] = (userPurchaseCounts[userId] || 0) + 1;
        });

        return Object.entries(userPurchaseCounts)
            .map(([userId, purchaseCount]) => ({ userId, purchaseCount }))
            .sort((a, b) => b.purchaseCount - a.purchaseCount);
    }

    async findTopSpenders(): Promise<{ userId: string; totalSpent: number }[]> {
        const firestore = this.firebaseAdmin.firestore();
        const purchasesSnapshot = await firestore.collection('purchases').get();

        if (purchasesSnapshot.empty) {
            return [];
        }

        const userTotalSpent: Record<string, number> = {};

        purchasesSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const userId = data.userId;
            const totalAmount = data.totalAmount;
            userTotalSpent[userId] = (userTotalSpent[userId] || 0) + totalAmount;
        });

        return Object.entries(userTotalSpent)
            .map(([userId, totalSpent]) => ({ userId, totalSpent }))
            .sort((a, b) => b.totalSpent - a.totalSpent);
    }

    async findAllPurchases(): Promise<Purchase[]> {
        const firestore = this.firebaseAdmin.firestore();
        const purchasesSnapshot = await firestore.collection('purchases').get();

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
}
