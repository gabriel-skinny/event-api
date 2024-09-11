import { Injectable } from "@nestjs/common";
import { AbstractUserRepository } from "../repositories/userRepository";
import { NotFoundError } from "../errors/notFound";

interface IUpdatePermisionUseCase {
  userId: string;
  isAdmin: boolean;
}

@Injectable()
export class UpdatePermisionUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute({ isAdmin, userId }: IUpdatePermisionUseCase): Promise<void> {
    const { affetedRows } = await this.userRepository.updateById({
      id: userId,
      updateData: { isAdmin },
    });

    if (affetedRows <= 0) throw new NotFoundError("User to update not found");
  }
}
