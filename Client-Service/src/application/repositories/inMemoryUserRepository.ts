import { User } from "../entities/User";
import { AbstractUserRepository } from "./userRepository";

export class InMemoryUserRepository implements AbstractUserRepository {
  public userDatabase: User[] = [];

  async save(user: User): Promise<void> {
    this.userDatabase.push(user);
  }

  updateById(data: {
    id: string;
    updateData: Partial<User>;
  }): Promise<{ affetedRows: number }> {
    throw new Error("Method not implemented.");
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!this.userDatabase.find((user) => user.email == email);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userDatabase.find((user) => user.email == email);
  }

  async existsById(userId: string): Promise<boolean> {
    return !!this.userDatabase.find((user) => user.id == userId);
  }
}
