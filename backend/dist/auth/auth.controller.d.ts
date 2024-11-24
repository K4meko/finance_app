import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<string>;
    signup(body: AuthDto): Promise<{
        months: {
            budget: number;
            id: number;
            createdAt: Date;
            userId: number;
            year: number;
            budgetId: number;
        }[];
        monthlyExpenses: {
            id: number;
            userId: number;
            type: string;
            amount: number;
        }[];
        defaultBudget: {
            budgetItems: {
                id: number;
                budgetId: number;
                type: string;
                amount: number;
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
