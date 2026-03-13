import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';  // ← capital R
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken ?? null,
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,  // ← add !
      passReqToCallback: true as true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: any, role: UserRole) {
    const refreshToken = req.cookies?.refreshToken;
    return { email: payload.email, refreshToken, role: payload.role };
  }
}