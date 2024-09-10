import {
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

import { AuthGuard } from "../../guards/Autentication";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ILoginTokenData } from "src/auth/Auth";
import { BaseControllerReturn } from "../interface";

@UseGuards(AuthGuard)
@Controller("event/user")
export class EventUserController {
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
}
