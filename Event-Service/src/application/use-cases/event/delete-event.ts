import { NotFoundError } from "../errors/notFound";
import { AbstractEventRepository } from "../repositories/eventRepository";

interface IDeleteEventUseCaseParams {
  eventId: string;
}

export class DeleteEventUseCase {
  constructor(private readonly eventRepository: AbstractEventRepository) {}

  async execute({ eventId }: IDeleteEventUseCaseParams) {
    const { affectedRows } = await this.eventRepository.softDeleteById(eventId);

    if (affectedRows == 0) throw new NotFoundError("Event to public not found");
  }
}
