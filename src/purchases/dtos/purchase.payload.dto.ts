import { IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { Product } from "../interfaces/product.interface";
import { Type } from "class-transformer";

export class PurchasePayloadDto {
    @IsString()
    userId: string;

    @IsArray()
    products: Product[];

    @IsNumber()
    totalAmount: number;

    @IsDate()
    @Type(() => Date)
    date: Date;
}