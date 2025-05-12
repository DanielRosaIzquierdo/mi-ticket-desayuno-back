import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getPurchaseHistory(@Request() req) {
        const userId = req.user.sub;
        return await this.purchasesService.getPurchaseHistory(userId);
    }

    @Post('register')
    @UseGuards(JwtAuthGuard)
    async registerPurchase(@Request() req, @Body() purchaseData: PurchasePayloadDto) {
        const userId = req.user.sub;
        const purchaseId = await this.purchasesService.registerPurchase(userId, purchaseData);
        return { purchaseId };
    }
}
