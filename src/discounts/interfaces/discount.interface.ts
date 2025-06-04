export interface Discount {
  id: string;
  type: 'spending' | 'purchases';
  value: number;
  conditions: string;
  discount: number;
}