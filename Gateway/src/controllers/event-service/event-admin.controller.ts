import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthGuard } from "../../guards/Autentication";
import { ICreateEventReturn } from "./interface";
import { BaseControllerReturn } from "../interface";
import { CreateEventDTO } from "src/dtos/event.dto";
import { ILoginTokenData } from "src/auth/Auth";

@UseGuards(AuthGuard)
@Controller("event/admin")
export class EventAdminController {
  constructor(
    @Inject("EVENT_SERVICE")
    private eventService: ClientProxy
  ) {}

  @Get()
  async getMany(
    @Query("perpage", new ParseIntPipe()) perPage: number,
    @Query("page", new ParseIntPipe()) page: number
  ) {
    const events = await firstValueFrom(
      this.eventService.send({ cmd: "get-many-events" }, { page, perPage })
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Events",
      data: { events },
    };
  }

  @Post()
  async createEvent(
    @Body() { endSellingDate, name, ticketGroups }: CreateEventDTO,
    @Req() req: { user: ILoginTokenData }
  ): Promise<BaseControllerReturn<{ eventId: string }>> {
    const adminId = req.user.userId;

    const { eventId } = await firstValueFrom(
      this.eventService.send<ICreateEventReturn>(
        { cmd: "order-tickets" },
        { creatorId: adminId, endSellingDate, name, ticketGroups }
      )
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "Event created",
      data: { eventId },
    };
  }

  @Patch("cancel/:eventId")
  async cancelEvent(
    @Param("eventId") eventId: string
  ): Promise<BaseControllerReturn> {
    await firstValueFrom(
      this.eventService.send<void>({ cmd: "cancel-event" }, { eventId })
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Event canceled sucessffuly",
    };
  }

  @Delete(":eventId")
  async deleteEvent(
    @Param("eventId") eventId: string
  ): Promise<BaseControllerReturn> {
    await firstValueFrom(
      this.eventService.send<void>({ cmd: "delete-event" }, { eventId })
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "Event deleted sucessffuly",
    };
  }

  @Patch("public/:eventId")
  async publicEvent(
    @Param("eventId") eventId: string
  ): Promise<BaseControllerReturn> {
    await firstValueFrom(
      this.eventService.send<void>({ cmd: "public-event" }, { eventId })
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Event published sucessffuly",
    };
  }
}
