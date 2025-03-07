import { BudgetItem, MonthlyExpense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateBudget(id: number, newItems: BudgetItem[]): Promise<{
        message: string;
    }>;
    updatePaycheck(id: number, expectedDatePaycheck: Date): Promise<{
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
    updateInformation(id: number, data: {
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
    getUserById(id: number): Promise<{
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
    getUserInfo(id: number): Promise<({
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
    getSettings(id: number): Promise<{
        months: {
            id: number;
            userId: number;
            createdAt: Date;
            timestamp: string;
            year: number;
            paycheck: number;
            budgetId: number | null;
        }[];
        monthlyExpenses: {
            id: string;
            amount: number;
            type: string;
            userId: number;
            monthId: number;
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
    }>;
    addExpenses(id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        timestamp: string;
        year: number;
        paycheck: number;
        budgetId: number | null;
    }[]>;
    updateExpenses(new_expenses: MonthlyExpense[], userId: number, monthId: number): Promise<void>;
    findMonthByISO(userId: number, monthISO: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        timestamp: string;
        year: number;
        paycheck: number;
        budgetId: number | null;
    }>;
    createMonth(userId: number, monthISO: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        timestamp: string;
        year: number;
        paycheck: number;
        budgetId: number | null;
    }>;
    deleteUser(id: number): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
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
}
