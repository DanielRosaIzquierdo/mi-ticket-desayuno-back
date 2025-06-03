import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DiscountsModule } from './discounts/discounts.module';

@Module({
  imports: [AuthModule, FirebaseModule, PurchasesModule, DiscountsModule],
  controllers: [],

})
export class AppModule { }
