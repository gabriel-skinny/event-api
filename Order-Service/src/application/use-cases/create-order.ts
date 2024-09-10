import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order';
import { AbstractOderRepository } from '../repositories/orderRepository';
import { AbstractKafkaService } from '../services/Kafka';
import { AlreadyCreatedError } from '../errors/alreadyCreated';

interface ICreateOrderParams {
  ticketId: string;
  userId: string;
  ticketValue: number;
}

interface ICreateOrderReturn {
  orderId: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: AbstractOderRepository,
    /* private kafkaService: AbstractKafkaService, */
  ) {}

  async execute({
    ticketId,
    userId,
    ticketValue,
  }: ICreateOrderParams): Promise<ICreateOrderReturn> {
    if (!(await this.orderRepository.existsOrderAvilableByTicketId(ticketId)))
      throw new AlreadyCreatedError(
        'A Order available already exists for that ticket',
      );

    const order = new Order({ ticketId, userId, value: ticketValue });

    await this.orderRepository.save(order);

    /*   this.kafkaService.sendEvent({
      eventName: 'ORDER CREATED',
      data: { orderId: order.id, ticketId: ticketId, userId },
    }); */

    return { orderId: order.id };
  }
}
