import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { IUserTokenData, TokenTypeEnum } from "src/auth/interface";
import { Role } from "src/decoretors/role.decoretor";
import { OrderTicketsDTO } from "src/dtos/ticket.dto";
import { AuthGuard } from "src/guards/Autentication";
import { BaseControllerReturn, IBasePagination } from "../interface";
import {
  IGetTicketsByBuyerIdReturn,
  IOrderTicketReturn,
  ITicketViewModel,
} from "./interface";

@UseGuards(AuthGuard)
@Role(TokenTypeEnum.USER)
@Controller("event/user/tickets")
export class TicketUserController {
  constructor(
    @Inject("EVENT_SERVICE")
    private eventService: ClientProxy
  ) {}

  @Get(":buyerId")
  async getTicketsByBuyerId(
    @Param("buyerId", ParseUUIDPipe) buyerId: string,
    @Query("perpage", new ParseIntPipe()) perPage: number,
    @Query("page", new ParseIntPipe()) page: number
  ): Promise<BaseControllerReturn<IBasePagination<ITicketViewModel[]>>> {
    const { tickets, totalTickets } = await firstValueFrom(
      this.eventService.send<IGetTicketsByBuyerIdReturn>(
        {
          cmd: "get-tickets-by-buyer-id",
        },
        { buyerId, perPage, page }
      )
    );

    return {
      message: "Tickets",
      statusCode: HttpStatus.OK,
      data: {
        actualPage: page,
        perPage,
        data: tickets,
        totalCount: totalTickets,
        isNext: page * perPage + perPage - totalTickets < perPage,
      },
    };
  }

  @Post("order-tickets/:eventId")
  async orderTickets(
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Body() { ordersInfo }: OrderTicketsDTO,
    @Req() req: { user: IUserTokenData }
  ): Promise<BaseControllerReturn<{ orderId: string }>> {
    const userId = req.user.sub;

    const { orderId } = await firstValueFrom(
      this.eventService.send<IOrderTicketReturn>(
        { cmd: "order-tickets" },
        { eventId, userId, ordersInfo }
      )
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "Create Order to ticket requested",
      data: { orderId },
    };
  }
}
