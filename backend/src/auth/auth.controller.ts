import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorator/public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  @Post('signup')
  signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }
}
