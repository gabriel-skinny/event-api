import { Reflector } from "@nestjs/core";
import { TokenTypeEnum } from "src/auth/interface";

export const Role = Reflector.createDecorator<TokenTypeEnum>();
