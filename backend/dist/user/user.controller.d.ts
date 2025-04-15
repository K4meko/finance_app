import { BudgetItem, MonthlyExpense, User } from '@prisma/client';
import { UserService } from './user.service';
export declare class UserController {
    private service;
    constructor(service: UserService);
    getUserBudgeting(user: User): Promise<({
        months: {
            id: number;
            createdAt: Date;
            name: string;
            month: number;
            userId: number;
            timestamp: string;
            year: number;
            salary: number | null;
            paycheck: number;
        }[];
        monthlyExpenses: ({
            month: {
                id: number;
                createdAt: Date;
                name: string;
                month: number;
                userId: number;
                timestamp: string;
                year: number;
                salary: number | null;
                paycheck: number;
            };
        } & {
            id: string;
            userId: number;
            type: string;
            monthId: number;
            amount: number;
        })[];
        defaultBudget: {
            id: number;
            userId: number;
            type: string;
            amount: number;
        }[];
    } & {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string | null;
        hash: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }) | {
        message: string;
    }>;
    AddExpenses(user: User): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        month: number;
        userId: number;
        timestamp: string;
        year: number;
        salary: number | null;
        paycheck: number;
    }[]>;
    DeleteUser(user: User): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string | null;
        hash: string;
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
        password: string | null;
        hash: string;
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
        salaryAmount?: number;
    }): Promise<{
        items: {
            id: number;
            userId: number;
            type: string;
            amount: number;
        }[];
        paycheck: Date;
        salaryAmount: number;
    }>;
    saveMonth(user: User, body: {
        monthISO: string;
        name: string;
        salary: number;
        expenses: MonthlyExpense[];
        budgetItems: BudgetItem[];
    }): Promise<{
        message: string;
        month: {
            id: number;
            createdAt: Date;
            name: string;
            month: number;
            userId: number;
            timestamp: string;
            year: number;
            salary: number | null;
            paycheck: number;
        };
    }>;
}
