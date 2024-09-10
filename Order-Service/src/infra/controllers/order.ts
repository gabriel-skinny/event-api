import { Controller, HttpStatus } from "@nestjs/common";

import { EventPattern, MessagePattern, Transport } from "@nestjs/microservices";
import { OrderStatusEnum } from "src/application/entities/status";
import { GetOrdersByUserIdUseCase } from "src/application/use-cases/get-orders-by-user-id";
import MakePaymentUseCase from "src/application/use-cases/make-payment";
import UpdateOrderStatusUseCase from "src/application/use-cases/update-order-status";
import { IOrderViewModel, OrderViewModel } from "../view-models/order";
import { CreateOrderUseCase } from "src/application/use-cases/create-order";

interface IMakePaymentParams {
  orderId: string;
  userId: string;
  creditCardExpirationDate: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
}

interface IPayoutorderParams {
  value: { paymentId: string; orderId: string; userId: string };
}

interface ICreateOrderParams {
  value: { ticketId: string; ticketValue: number; userId: string };
}

@Controller()
export class OrderController {
  constructor(
    private readonly makePaymentUseCase: MakePaymentUseCase,
    private readonly updateStatusOrderUseCase: UpdateOrderStatusUseCase,
    private readonly getOrdersByUserIdUseCase: GetOrdersByUserIdUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase
  ) {}

  @MessagePattern({ cmd: "make-payment" }, Transport.TCP)
  async makePayment({
    userId,
    orderId,
    creditCardExpirationDate,
    creditCardNumber,
    creditCardSecurityNumber,
  }: IMakePaymentParams) {
    await this.makePaymentUseCase.execute({
      orderId,
      userId,
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
    });

    return {
      message: "Payment sent",
    };
  }

  @MessagePattern({ cmd: "get-many-by-user" }, Transport.TCP)
  async getOrdersByUserId({
    userId,
    page,
    perPage,
  }: {
    userId: string;
    perPage: number;
    page: number;
  }): Promise<{ orders: IOrderViewModel[] }> {
    const orders = await this.getOrdersByUserIdUseCase.execute({
      userId,
      page,
      perPage,
    });

    return {
      orders: orders.map(OrderViewModel.toHttp),
    };
  }

  @EventPattern("create-order")
  async createOrder(data: ICreateOrderParams) {
    const { ticketId, ticketValue, userId } = data.value;
    console.log("Create-order", data);

    await this.createOrderUseCase.execute({
      ticketId,
      ticketValue,
      userId,
    });
  }

  @EventPattern("payment-confirmed")
  async payoutOrder(data: IPayoutorderParams) {
    console.log({ data, payment: "payment" });
    await this.updateStatusOrderUseCase.execute({
      newStatus: OrderStatusEnum.PAYED,
      orderId: data.value.orderId,
    });
  }
}
