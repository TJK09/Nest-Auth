import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtRefreshStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "../users/user.module";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtRefreshStrategy],
})

export class AuthModule{}