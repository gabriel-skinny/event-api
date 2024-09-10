import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateTicketsValueDTO } from "src/dtos/ticket.dto";
import { AuthGuard } from "src/guards/Autentication";
import { IUpdateTicketsValueReturn } from "./interface";
import { firstValueFrom } from "rxjs";
import { BaseControllerReturn } from "../interface";

@UseGuards(AuthGuard)
@Controller("event/admin/tickets")
export class TicketAdminController {
  constructor(
    @Inject("EVENT_SERVICE")
    private eventService: ClientProxy
  ) {}

  @Patch("update-value/:eventId")
  async updateTicketsValue(
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Body() { price, type }: UpdateTicketsValueDTO
  ): Promise<BaseControllerReturn> {
    const { message } = await firstValueFrom(
      this.eventService.send<IUpdateTicketsValueReturn>(
        { cmd: "update-tickets-value" },
        { eventId, price, type }
      )
    );

    return {
      statusCode: HttpStatus.CREATED,
      message,
    };
  }
}
