import { Module } from "@nestjs/common";

import { EventController } from "./controllers/event";
import { DatabaseModule } from "./database/database.module";
import { ServiceModule } from "./services/services.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TicketController } from "./controllers/ticket";
import { GetManyEventsUseCase } from "src/application/use-cases/event/get-many-events";
import { OrderTicketsUseCaseCase } from "src/application/use-cases/ticket/order-tickets";
import { CancelEventUseCase } from "src/application/use-cases/event/cancel-event";
import { CreateEventUseCase } from "src/application/use-cases/event/create-event";
import { DeleteEventUseCase } from "src/application/use-cases/event/delete-event";
import { PublicEventUseCase } from "src/application/use-cases/event/public-event";
import { UpdateTicketsValueUseCase } from "src/application/use-cases/ticket/update-tickets-value";
import { GetTicketsByBuyerIdUseCase } from "src/application/use-cases/ticket/get-tickets-by-buyer-id";
import { MakeTicketAvailableUseCase } from "src/application/use-cases/ticket/make-ticket-available";
import { BuyTicketUseCase } from "src/application/use-cases/ticket/buy-ticket";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "event-service",
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: "consumer",
          },
        },
      },
    ]),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [
    GetManyEventsUseCase,
    CancelEventUseCase,
    CreateEventUseCase,
    DeleteEventUseCase,
    PublicEventUseCase,
    OrderTicketsUseCaseCase,
    UpdateTicketsValueUseCase,
    GetTicketsByBuyerIdUseCase,
    MakeTicketAvailableUseCase,
    BuyTicketUseCase,
  ],
  controllers: [EventController, TicketController],
})
export class InfraModule {}
