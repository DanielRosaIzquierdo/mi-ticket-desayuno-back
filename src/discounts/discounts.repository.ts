import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Discount } from './interfaces/discount.interface';
import { DiscountPayloadDto } from './dtos/discount.payload.dto';

@Injectable()
export class DiscountsRepository {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin) { }

    async findDiscounts(): Promise<Discount[]> {
        const firestore = this.firebaseAdmin.firestore();
        const discountsSnapshot = await firestore.collection('discounts').get();

        if (discountsSnapshot.empty) {
            return [];
        }

        return discountsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                establishmentId: data.establishmentId,
                type: data.type,
                value: data.value,
                discount: data.discount,
                conditions: data.conditions,
            } as Discount;
        });
    }

    async saveDiscount(discount: DiscountPayloadDto): Promise<string> {
        const firestore = this.firebaseAdmin.firestore();
        const discountRef = await firestore.collection('discounts').add({ ...discount });
        return discountRef.id;
    }

    async deleteDiscount(id: string): Promise<boolean> {
        const firestore = this.firebaseAdmin.firestore();
        const docRef = firestore.collection('discounts').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return false;
        }
        await docRef.delete();
        return true;
    }
}