import { Injectable } from "@nestjs/common";
import { NotFoundError } from "src/application/errors/notFound";
import { AbstractEventRepository } from "src/application/repositories/eventRepository";

interface IDeleteEventUseCaseParams {
  eventId: string;
}

@Injectable()
export class DeleteEventUseCase {
  constructor(private readonly eventRepository: AbstractEventRepository) {}

  async execute({ eventId }: IDeleteEventUseCaseParams) {
    const { affectedRows } = await this.eventRepository.softDeleteById(eventId);

    if (affectedRows == 0) throw new NotFoundError("Event to public not found");
  }
}
