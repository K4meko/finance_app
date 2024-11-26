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
        months: {
            id: number;
            createdAt: Date;
            userId: number;
            year: number;
            budget: number;
            budgetId: number;
        }[];
        monthlyExpenses: {
            id: number;
            type: string;
            amount: number;
            userId: number;
        }[];
        defaultBudget: {
            budgetItems: {
                id: number;
                type: string;
                amount: number;
                budgetId: number;
            }[];
        } & {
            id: number;
            userId: number;
        };
    } & {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
    }>;
    login(body: LoginDto): Promise<{
        jwtToken: string;
    }>;
    signJwt(userId: number, email: string, firstName: string, lastName: string): {
        jwtToken: string;
    };
}
