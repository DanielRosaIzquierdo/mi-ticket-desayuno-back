import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                const serviceAccount = JSON.parse(process.env.FIREBASE_KEY!);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                return admin;
            },
        },
    ],
    exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule { }