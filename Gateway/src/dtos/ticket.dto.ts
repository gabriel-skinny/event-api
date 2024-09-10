import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from "class-validator";

class OrderInfoDTO {
  @IsNotEmpty()
  @IsString()
  ticketType: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class OrderTicketsDTO {
  @IsNotEmpty()
  @IsArray()
  @Type(() => OrderInfoDTO)
  ordersInfo: OrderInfoDTO[];
}

export class UpdateTicketsValueDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsInt()
  price: number;
}
