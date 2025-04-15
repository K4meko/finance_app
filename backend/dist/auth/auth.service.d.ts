import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    signup(body: AuthDto): Promise<{
        access_token: string;
    }>;
    login(body: AuthDto): Promise<{
        access_token: string;
    }>;
    signJwt(userId: number, email: string, firstName: string, lastName: string): Promise<{
        access_token: string;
    }>;
}
