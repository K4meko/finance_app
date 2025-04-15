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
        password: string | null;
        hash: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }>;
    updateSalary(id: number, salaryAmount: number): Promise<{
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
        password: string | null;
        hash: string;
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
        password: string | null;
        hash: string;
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
    getSettings(id: number): Promise<{
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
        monthlyExpenses: {
            id: string;
            userId: number;
            type: string;
            monthId: number;
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
        password: string | null;
        hash: string;
        createdAt: Date;
        updatedAt: Date;
        expectedDatePaycheck: Date | null;
        salaryAmount: number | null;
    }>;
    addExpenses(id: number): Promise<{
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
    updateExpenses(new_expenses: MonthlyExpense[], userId: number, monthId: number): Promise<void>;
    findMonthByISO(userId: number, monthISO: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        month: number;
        userId: number;
        timestamp: string;
        year: number;
        salary: number | null;
        paycheck: number;
    }>;
    createMonth(userId: number, monthISO: string, name: string, salary: number, expenses: MonthlyExpense[], budgetItems: BudgetItem[]): Promise<any>;
    updateMonth(monthId: number, name: string, salary: number, expenses: MonthlyExpense[], budgetItems: BudgetItem[]): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        month: number;
        userId: number;
        timestamp: string;
        year: number;
        salary: number | null;
        paycheck: number;
    }>;
    deleteUser(id: number): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
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
    updateMonthBudget(monthId: number, budgetItems: BudgetItem[], userId: number): Promise<void>;
}
