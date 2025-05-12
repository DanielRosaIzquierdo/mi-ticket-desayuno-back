import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthRepository {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin) { }

    async saveUser(name: string, email: string, hashedPassword: string): Promise<string> {
        const firestore = admin.firestore();

        const userRef = await firestore.collection('users').add({
            name,
            email,
            passwordHash: hashedPassword,
        });

        return userRef.id;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const firestore = this.firebaseAdmin.firestore();
        const userSnapshot = await firestore.collection('users').where('email', '==', email).limit(1).get();

        if (userSnapshot.empty) {
            return null;
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        const user: User = {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            passwordHash: userData.passwordHash,
        };

        return user;
    }
}
