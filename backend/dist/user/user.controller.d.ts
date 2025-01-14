import { BudgetItem, User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private service;
    constructor(service: UserService);
    Home(user: User): Promise<{
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    } | {
        message: string;
    }>;
    getUserBudgeting(user: User): Promise<({
        months: {
            id: number;
            userId: number;
            createdAt: Date;
            year: number;
            paycheck: number;
            budgetId: number;
        }[];
        monthlyExpenses: {
            id: number;
            amount: number;
            type: string;
            userId: number;
        }[];
        defaultBudget: {
            id: number;
            amount: number;
            type: string;
            userId: number;
        }[];
    } & {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }) | {
        message: string;
    }>;
    FindUser(user: User): Promise<{
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    } | {
        message: string;
    }>;
    AddExpenses(user: User): Promise<void>;
    DeleteUser(user: User): Promise<void>;
    UpdateBudget(user: User, newItems: BudgetItem[]): Promise<{
        message: string;
    }>;
}
