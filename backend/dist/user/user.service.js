"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateBudget(id, newItems) {
        await this.prisma.budgetItem.deleteMany({
            where: {
                userId: id,
            },
        });
        await this.prisma.budgetItem.createMany({
            data: newItems.map((item) => ({
                amount: item.amount,
                userId: id,
                type: item.type,
            })),
        });
        return { message: 'Budget updated' };
    }
    async updatePaycheck(id, expectedDatePaycheck) {
        return this.prisma.user.update({
            where: { id: id },
            data: {
                expectedDatePaycheck: expectedDatePaycheck,
            },
        });
    }
    async updateSalary(id, salaryAmount) {
        return this.prisma.user.update({
            where: { id: id },
            data: {
                salaryAmount: salaryAmount,
            },
        });
    }
    async updateInformation(id, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                hash: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        if (data.oldPassword && data.password) {
            const pwMatch = await argon.verify(user.hash, data.oldPassword);
            if (!pwMatch) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
            updateData.hash = await argon.hash(data.password);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        return updatedUser;
    }
    async getUserById(id) {
        if (!id) {
            return { message: 'No user found' };
        }
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            include: {
                monthlyExpenses: true,
                months: true,
                defaultBudget: true,
            },
        });
        console.log(`User: ${user}`);
        return user;
    }
    async getUserInfo(id) {
        if (!id) {
            return { message: 'No user found' };
        }
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            include: {
                monthlyExpenses: {
                    include: {
                        month: true,
                    },
                },
                months: true,
                defaultBudget: true,
            },
        });
        console.log(`User: ${user}`);
        return user;
    }
    async getSettings(id) {
        return this.prisma.user.findUnique({
            where: { id: id },
            include: {
                monthlyExpenses: true,
                months: true,
                defaultBudget: true,
            },
        });
    }
    async addExpenses(id) {
        const expenses = await this.prisma.month.findMany({
            where: { userId: id },
        });
        console.log(`Expenses: ${expenses}`);
        return expenses;
    }
    async updateExpenses(new_expenses, userId, monthId) {
        await this.prisma.monthlyExpense.deleteMany({
            where: {
                userId,
                monthId
            }
        });
        if (new_expenses && new_expenses.length > 0) {
            await this.prisma.monthlyExpense.createMany({
                data: new_expenses.map(expense => ({
                    type: expense.type,
                    amount: expense.amount,
                    userId,
                    monthId
                }))
            });
        }
    }
    async findMonthByISO(userId, monthISO) {
        return this.prisma.month.findFirst({
            where: {
                userId,
                timestamp: monthISO,
            },
        });
    }
    async createMonth(userId, monthISO, name, salary, expenses, budgetItems) {
        const [year, month] = monthISO.split('-').map(Number);
        const existingMonth = await this.prisma.month.findFirst({
            where: {
                userId,
                year,
                month,
            },
        });
        let monthRecord;
        if (existingMonth) {
            monthRecord = await this.prisma.month.update({
                where: { id: existingMonth.id },
                data: {
                    name,
                    salary,
                    paycheck: salary,
                },
            });
            await this.prisma.monthlyExpense.deleteMany({
                where: { monthId: existingMonth.id }
            });
            await this.prisma.monthBudgetItem.deleteMany({
                where: { monthId: existingMonth.id }
            });
        }
        else {
            monthRecord = await this.prisma.month.create({
                data: {
                    userId,
                    timestamp: monthISO,
                    year,
                    month,
                    name,
                    salary,
                    paycheck: salary,
                },
            });
        }
        if (expenses && expenses.length > 0) {
            await this.prisma.monthlyExpense.createMany({
                data: expenses.map(expense => ({
                    type: expense.type,
                    amount: expense.amount,
                    userId,
                    monthId: monthRecord.id
                }))
            });
        }
        if (budgetItems && budgetItems.length > 0) {
            await this.prisma.monthBudgetItem.createMany({
                data: budgetItems.map(item => ({
                    amount: item.amount,
                    type: item.type,
                    monthId: monthRecord.id
                }))
            });
        }
        return monthRecord;
    }
    async updateMonth(monthId, name, salary, expenses, budgetItems) {
        const month = await this.prisma.month.update({
            where: { id: monthId },
            data: {
                name,
                salary,
                paycheck: salary
            }
        });
        await this.updateExpenses(expenses, month.userId, monthId);
        await this.updateMonthBudget(monthId, budgetItems, month.userId);
        return month;
    }
    async deleteUser(id) {
        console.log(`Deleting user with id: ${id}`);
        if (!id) {
            return { message: 'No user found' };
        }
        const deleteExpenses = this.prisma.monthlyExpense.deleteMany({
            where: { userId: id },
        });
        const deleteBudgetItems = this.prisma.budgetItem.deleteMany({
            where: {
                userId: id,
            },
        });
        const deleteMonths = this.prisma.month.deleteMany({
            where: { userId: id },
        });
        const deleteUser = this.prisma.user.delete({
            where: { id: id },
        });
        const transaction = await this.prisma.$transaction([
            deleteExpenses,
            deleteBudgetItems,
            deleteMonths,
            deleteUser,
        ]);
        console.log(`User and related expenses deleted: ${transaction}`);
        return transaction;
    }
    async updateMonthBudget(monthId, budgetItems, userId) {
        await this.prisma.monthBudgetItem.deleteMany({
            where: {
                monthId,
            }
        });
        if (budgetItems && budgetItems.length > 0) {
            await this.prisma.monthBudgetItem.createMany({
                data: budgetItems.map(item => ({
                    ...item,
                    monthId,
                })),
            });
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map