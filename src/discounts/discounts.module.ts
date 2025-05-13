import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { DiscountsRepository } from './discounts.repository';
import { PurchasesModule } from 'src/purchases/purchases.module';

@Module({
  imports: [PurchasesModule],
  controllers: [DiscountsController],
  providers: [DiscountsService, DiscountsRepository],
})
export class DiscountsModule {}
