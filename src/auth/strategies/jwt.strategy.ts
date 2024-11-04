import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req) => req.cookies?.Authentication,
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
