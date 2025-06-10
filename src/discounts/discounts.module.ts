import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { DiscountsRepository } from './discounts.repository';
import { PurchasesModule } from 'src/purchases/purchases.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PurchasesModule, AuthModule],
  controllers: [DiscountsController],
  providers: [DiscountsService, DiscountsRepository],
})
export class DiscountsModule {}
