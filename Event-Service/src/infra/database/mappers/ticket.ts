import { Ticket } from "../../../application/entities/ticket";
import { TicketModel } from "../entities/ticket";

export class TicketMapper {
  static toDatabase(raw: Ticket): TicketModel {
    return {
      _id: raw.id,
      id: raw.id,
      price: raw.price,
      buyed: raw.buyed,
      buyerId: raw.buyerId,
      type: raw.type,
      orderId: raw.orderId,
      eventId: raw.eventId,
      isAvailable: raw.isAvailable,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(model: TicketModel): Ticket {
    return new Ticket({
      id: model.id,
      price: model.price,
      buyed: model.buyed,
      buyerId: model.buyerId,
      type: model.type,
      orderId: model.orderId,
      eventId: model.eventId,
      isAvailable: model.isAvailable,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      updatedAt: model.updatedAt,
    });
  }
}
