import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Patch,
  Post,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { firstValueFrom } from "rxjs";
import { AbstractAuthService } from "../auth/interface";
import { CreateUserDTO, LoginDTO, UpdatePermissionDTO } from "../dtos/user.dto";
import { BaseControllerReturn } from "./interface";

interface ILoginUserServiceReturnData {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface ICreateUserServiceReturnData {
  userId: string;
}

@Controller("user")
export class ClientController {
  constructor(
    @Inject("CLIENT_SERVICE")
    private clientService: ClientProxy,
    private authService: AbstractAuthService
  ) {}

  @Post()
  async create(
    @Body() { email, name, password }: CreateUserDTO
  ): Promise<BaseControllerReturn<ICreateUserServiceReturnData>> {
    const userData = await firstValueFrom(
      this.clientService.send<ICreateUserServiceReturnData>(
        { cmd: "user-create" },
        {
          email,
          name,
          password,
        }
      )
    );

    return {
      message: "User created succesfully",
      statusCode: HttpStatus.OK,
      data: userData,
    };
  }

  @Post("/login")
  async login(
    @Body() { email, password }: LoginDTO
  ): Promise<BaseControllerReturn<{ token: string }>> {
    const data = await firstValueFrom(
      this.clientService.send<ILoginUserServiceReturnData>(
        { cmd: "user-login" },
        {
          email,
          password,
        }
      )
    );

    const { token } = await this.authService.generateLoginToken({
      userId: data.userId,
      email: data.email,
      name: data.name,
    });

    return {
      message: "loged in succesfully",
      statusCode: HttpStatus.OK,
      data: { token },
    };
  }

  @Patch("update-permission")
  async updatePermission(
    @Body() { isAdmin, userId }: UpdatePermissionDTO
  ): Promise<BaseControllerReturn> {
    await firstValueFrom(
      this.clientService.send<ILoginUserServiceReturnData>(
        { cmd: "update-permission" },
        {
          isAdmin,
          userId,
        }
      )
    );

    return {
      message: "Permission updated",
      statusCode: HttpStatus.OK,
    };
  }
}
