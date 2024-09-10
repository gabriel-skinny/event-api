import { Controller } from "@nestjs/common";

import { MessagePattern, Transport } from "@nestjs/microservices";
import { CancelEventUseCase } from "src/application/use-cases/event/cancel-event";
import { CreateEventUseCase } from "src/application/use-cases/event/create-event";
import { DeleteEventUseCase } from "src/application/use-cases/event/delete-event";
import { PublicEventUseCase } from "src/application/use-cases/event/public-event";
import { GetManyEventsUseCase } from "../../application/use-cases/event/get-many-events";
import { ICreateEventParams, IPaginationParams } from "./interface";

@Controller()
export class EventController {
  constructor(
    private readonly getManyEventsUseCase: GetManyEventsUseCase,
    private readonly cancelEventUseCase: CancelEventUseCase,
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly publicEventUseCase: PublicEventUseCase
  ) {}

  @MessagePattern({ cmd: "get-many-events" }, Transport.TCP)
  async getMany({ page, perPage }: IPaginationParams) {
    const events = await this.getManyEventsUseCase.execute({ page, perPage });

    return events;
  }

  @MessagePattern({ cmd: "cancel-event" }, Transport.TCP)
  async cancelEvent({ eventId }: { eventId: string }) {
    await this.cancelEventUseCase.execute({ eventId });

    return { message: "Event canceled sucessfully" };
  }

  @MessagePattern({ cmd: "create-event" }, Transport.TCP)
  async createEvent({
    creatorId,
    endSellingDate,
    name,
    ticketGroups,
  }: ICreateEventParams): Promise<{ eventId: string }> {
    const { eventId } = await this.createEventUseCase.execute({
      creatorId,
      endSellingDate,
      name,
      ticketGroups,
    });

    return { eventId };
  }

  @MessagePattern({ cmd: "delete-event" }, Transport.TCP)
  async deleteEvent({ eventId }: { eventId: string }) {
    await this.deleteEventUseCase.execute({ eventId });

    return { message: "Event canceled sucessfully" };
  }

  @MessagePattern({ cmd: "public-event" }, Transport.TCP)
  async publicEvent({ eventId }: { eventId: string }) {
    await this.publicEventUseCase.execute({ eventId });

    return { message: "Event published sucessfully" };
  }
}
