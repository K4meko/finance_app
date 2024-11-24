import { AuthGuard } from '@nestjs/passport';
import passport from 'passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    if (err || !user) {
      return err || info;
    }
    return user;
  }
}
