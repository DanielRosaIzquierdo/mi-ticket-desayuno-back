import { Product } from "./product.interface";

export interface Purchase {
    id: string;
    userId: string;
    products: Product[];
    totalAmount: number;
    date: Date;
}