import { Controller } from "@nestjs/common";
import { OrderTicketsUseCaseCase } from "src/application/use-cases/ticket/order-tickets";
import {
  IOrderTicketsParams,
  IPaginationParams,
  IPayoutTicketParams,
  IUpdateTicketsValueParams,
} from "./interface";
import { EventPattern, MessagePattern, Transport } from "@nestjs/microservices";
import { GetTicketsByBuyerIdUseCase } from "src/application/use-cases/ticket/get-tickets-by-buyer-id";
import { UpdateTicketsValueUseCase } from "src/application/use-cases/ticket/update-tickets-value";
import { MakeTicketAvailableUseCase } from "src/application/use-cases/ticket/make-ticket-available";
import { BuyTicketUseCase } from "src/application/use-cases/ticket/buy-ticket";

@Controller()
export class TicketController {
  constructor(
    private orderTicketUseCase: OrderTicketsUseCaseCase,
    private updateTicketsValueUseCase: UpdateTicketsValueUseCase,
    private getTicketsByBuyerIdUseCase: GetTicketsByBuyerIdUseCase,
    private makeTicketAvailableUseCase: MakeTicketAvailableUseCase,
    private buyTicketUseCase: BuyTicketUseCase
  ) {}

  @MessagePattern({ cmd: "order-tickets" }, Transport.TCP)
  async orderTicket({ eventId, userId, ordersInfo }: IOrderTicketsParams) {
    const { orderId } = await this.orderTicketUseCase.execute({
      eventId,
      userId,
      ordersInfo,
    });

    return { orderId };
  }

  @MessagePattern({ cmd: "get-tickets-by-buyer-id" }, Transport.TCP)
  async getTicketsByBuyerId({
    buyerId,
    page,
    perPage,
  }: { buyerId: string } & IPaginationParams) {
    const { tickets, totalTickets } =
      await this.getTicketsByBuyerIdUseCase.execute({ buyerId, page, perPage });

    return { tickets, totalTickets };
  }

  @MessagePattern({ cmd: "update-tickets-value" }, Transport.TCP)
  async updateTicketsValue({
    eventId,
    newPrice,
    type,
  }: IUpdateTicketsValueParams) {
    await this.updateTicketsValueUseCase.execute({ eventId, newPrice, type });

    return { message: "Tickets updated" };
  }

  @EventPattern("order-canceled")
  async makeTicketAvailable({ ticketId }: { ticketId: string }) {
    await this.makeTicketAvailableUseCase.execute({ ticketId });

    return { message: "Ticket available" };
  }

  @EventPattern("order-payed")
  async payTicket(data: IPayoutTicketParams) {
    await this.buyTicketUseCase.execute({
      ticketId: data.value.ticketId,
      userId: data.value.userId,
    });
  }
}
