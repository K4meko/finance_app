import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        jwtToken: string;
    }>;
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
    hello(): string;
}
