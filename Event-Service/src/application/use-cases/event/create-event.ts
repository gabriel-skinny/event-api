import { Injectable } from "@nestjs/common";
import { Event } from "src/application/entities/event";
import { Ticket } from "src/application/entities/ticket";
import { AbstractEventRepository } from "src/application/repositories/eventRepository";
import { AbstractTicketRepository } from "src/application/repositories/ticketRepository";

interface ICreateEventUseCaseParams {
  name: string;
  creatorId: string;
  endSellingDate: Date;
  ticketGroups: Array<{
    type: string;
    price: number;
    quantity: number;
  }>;
}

interface ICreateEventUseCaseReturn {
  eventId: string;
}

@Injectable()
export class CreateEventUseCase {
  constructor(
    private eventRepository: AbstractEventRepository,
    private ticketRepository: AbstractTicketRepository
  ) {}

  async execute({
    creatorId,
    name,
    endSellingDate,
    ticketGroups,
  }: ICreateEventUseCaseParams): Promise<ICreateEventUseCaseReturn> {
    let ticketNumber = 0;
    ticketGroups.forEach((ticket) => (ticketNumber += ticket.quantity));

    const event = new Event({
      name,
      creatorId,
      endSellingDate,
      ticketNumber,
    });

    const ticketsToCreate: Array<Ticket> = [];
    for (const ticketGroup of ticketGroups) {
      for (let i = 0; i < ticketGroup.quantity; i++) {
        const ticket = new Ticket({
          eventId: event.id,
          price: ticketGroup.price,
          type: ticketGroup.type,
        });

        ticketsToCreate.push(ticket);
      }
    }

    await this.eventRepository.save(event);
    await this.ticketRepository.saveMany(ticketsToCreate);

    return { eventId: event.id };
  }
}
