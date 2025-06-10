import { Body, Controller, Get, Post, Request, UseGuards, Delete } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PurchasePayloadDto } from './dtos/purchase.payload.dto';
import { PurchasesService } from './purchases.service';
import { Role } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('stablishment')
    async registerPurchase(@Body() purchaseData: PurchasePayloadDto) {
        const purchaseId = await this.purchasesService.registerPurchase(purchaseData);
        return { purchaseId };
    }

    @Get('top-purchasers')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('stablishment')
    async getTopPurchasers() {
        return await this.purchasesService.getTopPurchasers();
    }

    @Get('top-spenders')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('stablishment')
    async getTopSpenders() {
        return await this.purchasesService.getTopSpenders();
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('stablishment')
    async getAllPurchases() {
        return await this.purchasesService.getAllPurchases();
    }



    @Delete('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('stablishment')
    async deleteAllPurchases() {
        await this.purchasesService.deleteAllPurchases();
        return { message: 'All purchases deleted successfully' };
    }

}
