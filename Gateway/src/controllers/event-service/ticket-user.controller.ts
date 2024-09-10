import { Controller, Inject, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard } from "src/guards/Autentication";

@UseGuards(AuthGuard)
@Controller()
export class TicketUserController {
  constructor(
    @Inject("EVENT_SERVICE")
    private eventService: ClientProxy
  ) {}
}
