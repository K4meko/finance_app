import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(body: AuthDto) {
    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hash = await argon.hash(body.password);
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        hash,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });

    return this.signJwt(user.id, user.email, user.firstName, user.lastName);
  }

  async login(body: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        hash: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMatches = await argon.verify(user.hash, body.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signJwt(user.id, user.email, user.firstName, user.lastName);
  }

  async signJwt(userId: number, email: string, firstName: string, lastName: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      firstName,
      lastName,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
