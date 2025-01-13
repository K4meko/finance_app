import { BudgetItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateBudget(id: number, newItems: BudgetItem[]): Promise<{
        message: string;
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
            createdAt: Date;
            userId: number;
            year: number;
            paycheck: number;
            budgetId: number;
        }[];
        monthlyExpenses: {
            id: number;
            userId: number;
            type: string;
            amount: number;
        }[];
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
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }) | {
        message: string;
    }>;
    addExpenses(id: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        year: number;
        paycheck: number;
        budgetId: number;
    }[]>;
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
