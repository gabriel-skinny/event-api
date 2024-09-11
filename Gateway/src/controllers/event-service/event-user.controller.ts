import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { TokenTypeEnum } from "src/auth/interface";
import { Role } from "src/decoretors/role.decoretor";
import { AuthGuard } from "../../guards/Autentication";

@UseGuards(AuthGuard)
@Role(TokenTypeEnum.USER)
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
