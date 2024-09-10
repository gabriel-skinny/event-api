import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  endSellingDate: Date;

  @IsNotEmpty()
  @IsArray()
  @Type(() => TicketGroupDTO)
  ticketGroups: TicketGroupDTO[];
}

class TicketGroupDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
