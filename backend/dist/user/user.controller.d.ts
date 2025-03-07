import { BudgetItem, MonthlyExpense, User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private service;
    constructor(service: UserService);
    getUserBudgeting(user: User): Promise<({
        months: {
            id: number;
            userId: number;
            createdAt: Date;
            timestamp: string;
            year: number;
            paycheck: number;
            budgetId: number | null;
        }[];
        monthlyExpenses: ({
            month: {
                id: number;
                userId: number;
                createdAt: Date;
                timestamp: string;
                year: number;
                paycheck: number;
                budgetId: number | null;
            };
        } & {
            id: string;
            amount: number;
            type: string;
            userId: number;
            monthId: number;
        })[];
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
    AddExpenses(user: User): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        timestamp: string;
        year: number;
        paycheck: number;
        budgetId: number | null;
    }[]>;
    DeleteUser(user: User): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }] | {
        message: string;
    }>;
    UpdateInformation(user: User, body: {
        lastName?: string;
        firstName?: string;
        email?: string;
        password?: string;
        oldPassword?: string;
    }): Promise<{
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }>;
    UpdateExpenses(user: User, body: {
        new_expenses: MonthlyExpense[];
        monthISO: string;
    }): Promise<void>;
    UpdateSettings(user: User, body: {
        newItems?: BudgetItem[];
        expectedDatePaycheck?: Date;
    }): Promise<{
        items: {
            id: number;
            amount: number;
            type: string;
            userId: number;
        }[];
        paycheck: Date;
    }>;
}
