import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Payment, PaymentStatusEnum } from "src/application/entities/payment";
import { AbstractPaymentRepository } from "src/application/repositories/paymentRepository";
import { PaymentModel } from "../entities/payment";
import { PaymentMapper } from "../mappers/payment";

@Injectable()
export default class PaymentRepository implements AbstractPaymentRepository {
  constructor(
    @InjectModel(PaymentModel.name) private paymentModel: Model<PaymentModel>
  ) {}

  async save(payment: Payment): Promise<void> {
    const paymentToCreate = PaymentMapper.toDatabase(payment);

    await this.paymentModel.create(paymentToCreate);
  }

  async findPendentByExternalId(externalId: string): Promise<Payment | null> {
    const payment = await this.paymentModel.findOne({
      status: PaymentStatusEnum.PENDENT,
      externalId,
    });

    if (!payment) return null;

    return PaymentMapper.toDomain(payment);
  }

  async findManyByUserId({
    userId,
    skip,
    limit,
  }: {
    userId: string;
    skip: number;
    limit: number;
  }): Promise<Payment[]> {
    const payments = await this.paymentModel.find({
      userId,
    });

    if (!payments) return [];

    return payments.map(PaymentMapper.toDomain);
  }

  async updateById({
    id,
    data,
  }: {
    id: string;
    data: Partial<Payment>;
  }): Promise<void> {
    console.log({ data, id });
    await this.paymentModel.updateOne({ id }, data);
  }
}
