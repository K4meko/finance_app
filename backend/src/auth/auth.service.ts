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
            create:
              body.monthlyExpenses?.map((expense) => ({
                type: expense.name,
                amount: expense.amount,
              })) || [],
          },
          months: {
            create: [],
          },
          expectedDatePaycheck: body.dateOfPaycheck,
          defaultBudget: { create: [] },
        },
        include: {
          monthlyExpenses: true,
          months: true,
          defaultBudget: true,
        },
      });

      return this.signJwt(user.id, user.email, user.firstName, user.lastName);
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
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        throw new ForbiddenException(`User ${body.email} does not exist`);
      }

      const passwordMatches = await argon.verify(user.password, body.password);
      if (!passwordMatches) {
        throw new ForbiddenException('Password is incorrect');
      }

      return this.signJwt(user.id, user.email, user.firstName, user.lastName);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new ForbiddenException('User not found');
        }
      }
      throw error;
    }
  }

  signJwt(userId: number, email: string, firstName: string, lastName: string) {
    const payload = {
      sub: userId,
      email: email,
      firstName: firstName,
      lastName: lastName,
    };
    return {
      jwtToken: this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}
