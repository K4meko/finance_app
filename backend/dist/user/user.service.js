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
    async updateInformation(id, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        if (user.password && data.oldPassword) {
            const pwMatch = await argon.verify(user.password, data.oldPassword);
            if (!pwMatch) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
            updateData.password = await argon.hash(data.password);
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
                monthlyExpenses: true,
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
    async updateExpenses(new_expenses, userId) {
        await this.prisma.month.updateMany({
            data: new_expenses,
            where: { userId },
        });
    }
    async deleteUser(id) {
        console.log(`Deleting user with id: ${id}`);
        if (!id || id === undefined || id === null) {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map