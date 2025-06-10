import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Purchase } from './interfaces/purchase.interface';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class PurchasesRepository {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin, private readonly authRepository: AuthRepository) { }

    async deleteAllPurchases(): Promise<void> {
        const firestore = this.firebaseAdmin.firestore();
        const purchasesSnapshot = await firestore.collection('purchases').get();

        const batch = firestore.batch();
        purchasesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

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

    async findTopPurchasers(): Promise<{ email: string; purchaseCount: number }[]> {
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

        const results: { email: string; purchaseCount: number }[] = [];
        for (const [userId, purchaseCount] of Object.entries(userPurchaseCounts)) {
            const user = await this.authRepository.findUserById(userId);
            results.push({
                email: user?.email || 'Usuario eliminado',
                purchaseCount,
            });
        }
        return results.sort((a, b) => b.purchaseCount - a.purchaseCount);
    }

    async findTopSpenders(): Promise<{ email: string; totalSpent: number }[]> {
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

        const results: { email: string; totalSpent: number }[] = [];
        for (const [userId, totalSpent] of Object.entries(userTotalSpent)) {
            const user = await this.authRepository.findUserById(userId);
            results.push({
                email: user?.email || 'Usuario eliminado',
                totalSpent,
            });
        }
        return results.sort((a, b) => b.totalSpent - a.totalSpent);
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