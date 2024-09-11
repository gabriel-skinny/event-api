import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  AbstractAuthService,
  IGenerateLoginTokenParams,
  IUserTokenData,
  TokenTypeEnum,
} from "./interface";

@Injectable()
export class AuthService implements AbstractAuthService {
  constructor(private jwtService: JwtService) {}

  async generateLoginToken(
    data: IGenerateLoginTokenParams
  ): Promise<{ token: string }> {
    const payload: IUserTokenData = {
      sub: data.userId,
      username: data.name,
      useremail: data.email,
      type: TokenTypeEnum.USER,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async verifyToken(token: string): Promise<IUserTokenData> {
    const data = await this.jwtService.verifyAsync<IUserTokenData>(token, {
      secret: process.env.JWT_SECRET,
    });

    return {
      sub: data.sub,
      type: data.type,
      username: data.username,
      useremail: data.useremail,
    };
  }
}
