export enum TokenTypeEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface IUserTokenData {
  sub: string;
  useremail?: string;
  username: string;
  type: TokenTypeEnum;
}

export interface IGenerateLoginTokenParams {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export abstract class AbstractAuthService {
  abstract generateLoginToken(data: {
    userId: string;
    email: string;
    name: string;
  }): Promise<{ token: string }>;
  abstract verifyToken(token: string): Promise<IUserTokenData>;
}
