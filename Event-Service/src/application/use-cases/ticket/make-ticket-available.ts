import { NotFoundError } from "src/application/errors/notFound";
import { AbstractTicketRepository } from "src/application/repositories/ticketRepository";

interface IMakeTicketAvailableUseCaseParams {
  ticketId: string;
}

export class MakeTicketAvailableUseCase {
  constructor(private ticketRepository: AbstractTicketRepository) {}

  async execute({
    ticketId,
  }: IMakeTicketAvailableUseCaseParams): Promise<void> {
    const { rowsAffected } = await this.ticketRepository.updateById({
      id: ticketId,
      updateData: {
        isAvailable: true,
      },
    });

    if (rowsAffected == 0)
      throw new NotFoundError("Ticket to make available not found");
  }
}
