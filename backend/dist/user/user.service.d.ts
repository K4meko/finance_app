import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserById(id: number): Promise<({
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
    addExpenses(id: number): Promise<{
        budget: number;
        id: number;
        createdAt: Date;
        userId: number;
        year: number;
        budgetId: number;
    }[]>;
    deleteUser(id: number): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
    }] | {
        message: string;
    }>;
}
