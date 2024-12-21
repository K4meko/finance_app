import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    getHello(): string;
    signup(body: AuthDto): Promise<{
        jwtToken: string;
    }>;
    login(body: LoginDto): Promise<{
        jwtToken: string;
    }>;
    signJwt(userId: number, email: string, firstName: string, lastName: string): {
        jwtToken: string;
    };
}
