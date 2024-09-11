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

interface IGenerateLoginTokenParams {
  userId: string;
  name: string;
  email: string;
}

export abstract class AbstractAuthService {
  abstract generateLoginToken(data: {
    userId: string;
    email: string;
    name: string;
  }): Promise<{ token: string }>;
  abstract verifyToken(token: string): Promise<IUserTokenData>;
}
