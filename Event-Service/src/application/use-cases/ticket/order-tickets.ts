import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { AbstractTicketRepository } from "../../repositories/ticketRepository";
import { WrongValueError } from "../../errors/wrongValue";
import { Ticket } from "../../entities/ticket";
import { randomUUID } from "crypto";

interface IOrderTicketsUseCaseCaseParams {
  eventId: string;
  userId: string;
  ordersInfo: Array<{
    ticketType: string;
    quantity: number;
  }>;
}

interface IOrderTicketsUseCaseReturn {
  orderId: string;
}

@Injectable()
export class OrderTicketsUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    @Inject("KAFKA_SERVICE")
    private kafkaService: ClientKafka
  ) {}

  async execute({
    eventId,
    userId,
    ordersInfo,
  }: IOrderTicketsUseCaseCaseParams): Promise<IOrderTicketsUseCaseReturn> {
    for (const order of ordersInfo) {
      const ticketNumber =
        await this.ticketRepository.countTicketsByEventAndType({
          eventId,
          type: order.ticketType,
          isAvailable: true,
        });

      if (order.quantity > ticketNumber)
        throw new WrongValueError("Does not have that many tickets available");
    }

    const ticketsToOrder: Ticket[] = [];
    for (const order of ordersInfo) {
      const { tickets } = await this.ticketRepository.findManyByEventIdAndType({
        eventId,
        type: order.ticketType,
        isAvailable: true,
        limit: order.quantity,
      });

      ticketsToOrder.push(...tickets);
    }

    let totalPrice = 0;
    ticketsToOrder.forEach((ticket) => (totalPrice += ticket.price));
    const orderId = randomUUID();
    this.kafkaService.emit("create-order", {
      orderValue: totalPrice,
      userId,
      externalId: orderId,
    });

    const ids = ticketsToOrder.map((ticket) => ticket.id);
    await this.ticketRepository.updateManyByIds({
      ids,
      updateData: { isAvailable: false, orderId },
    });

    return { orderId: orderId };
  }
}
