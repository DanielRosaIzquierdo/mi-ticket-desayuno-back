import { IsString, IsNumber, IsIn } from 'class-validator';

export class DiscountPayloadDto {

  @IsIn(['spending', 'purchases'])
  type: 'spending' | 'purchases';

  @IsNumber()
  value: number;

  @IsString()
  conditions: string;
}