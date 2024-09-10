import { Module } from "@nestjs/common";
import "dotenv/config";
import { ClientController } from "./controllers/client.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ServiceModule } from "./auth/services.module";

import { OrderController } from "./controllers/order.controller";
import { PaymentController } from "./controllers/payment.controller";
import { EventUserController } from "./controllers/event-service/event-user.controller";
import { EventAdminController } from "./controllers/event-service/event-admin.controller";
import { TicketUserController } from "./controllers/event-service/ticket-user.controller";
import { TicketAdminController } from "./controllers/event-service/ticket-admin.controller";

const services = [
  "CLIENT_SERVICE",
  "EVENT_SERVICE",
  "ORDER_SERVICE",
  "PAYMENT_SERVICE",
];

@Module({
  imports: [
    ClientsModule.register(
      services.map((serviceName) => ({
        name: serviceName,
        transport: Transport.TCP,
        options: {
          host: process.env[`${serviceName}_HOST`],
          port: Number(process.env[`${serviceName}_PORT`]),
        },
      }))
    ),
    ServiceModule,
  ],
  controllers: [
    ClientController,
    EventUserController,
    EventAdminController,
    TicketUserController,
    TicketAdminController,
    OrderController,
    PaymentController,
  ],
  providers: [],
})
export class AppModule {}
