import { IsString, IsNumber, IsIn, Min, Max, IsInt } from 'class-validator';

export class DiscountPayloadDto {

  @IsIn(['spending', 'purchases'])
  type: 'spending' | 'purchases';

  @IsNumber()
  value: number;

  @IsString()
  conditions: string;

  @IsInt()
  @Min(1)
  @Max(100)
  discount: number;
}