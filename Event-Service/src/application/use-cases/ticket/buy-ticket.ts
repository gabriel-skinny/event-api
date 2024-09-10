import { Injectable } from "@nestjs/common";
import { AbstractTicketRepository } from "src/application/repositories/ticketRepository";

interface IBuyTicketUseCaseParams {
  ticketId: string;
  userId: string;
}

@Injectable()
export class BuyTicketUseCase {
  constructor(private ticketRepository: AbstractTicketRepository) {}

  async execute({ ticketId, userId }: IBuyTicketUseCaseParams): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);

    ticket.buy(userId);

    await this.ticketRepository.save(ticket);
  }
}
