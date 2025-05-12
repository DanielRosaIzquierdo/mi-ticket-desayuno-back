import { IsArray, IsDate, IsNumber } from "class-validator";
import { Product } from "../interfaces/product.interface";
import { Type } from "class-transformer";

export class PurchasePayloadDto {
    @IsArray()
    products: Product[];

    @IsNumber()
    totalAmount: number;

    @IsDate()
    @Type(() => Date)
    date: Date;
}