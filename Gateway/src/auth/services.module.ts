import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./Auth";
import { AbstractAuthService } from "./interface";
import { JWT_EXPIRES_IN } from "src/constants/jwt";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
  ],
  exports: [AbstractAuthService],
})
export class ServiceModule {}
