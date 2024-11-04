import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signup(body: AuthDto) {
    const hash = await argon.hash(body.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hash,
          firstName: body.firstName,
          lastName: body.lastName,
          monthlyExpenses: {
            create: [],
          },
          months: {
            create: [],
          },
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Handle unique constraint violation
          throw new ForbiddenException(`Email ${body.email} already exists`);
        }
      }
      throw error;
    }
  }

  async login(body: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: body.email },
        select: { userId: true, email: true, password: true },
      });

      if (!user) {
        throw new ForbiddenException(`Email ${body.email} does not exist`);
      }

      const passwordMatches = await argon.verify(user.password, body.password);
      if (!passwordMatches) {
        throw new ForbiddenException('Password is incorrect');
      }

      const accessToken = await this.signJwt(user.userId, user.email);
      return {
        access_token: accessToken,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new ForbiddenException('User not found');
        }
      }
      throw error;
    }
  }

  signJwt(userId: number, email: string) {
    const payload = { sub: userId, email: email };
    return this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
