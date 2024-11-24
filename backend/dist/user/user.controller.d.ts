import { User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private service;
    constructor(service: UserService);
    Home(user: User): Promise<({
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
    }) | {
        message: string;
    }>;
    FindUser(user: User): Promise<({
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
    }) | {
        message: string;
    }>;
    AddExpenses(user: User): Promise<void>;
    DeleteUser(user: User): Promise<void>;
}
