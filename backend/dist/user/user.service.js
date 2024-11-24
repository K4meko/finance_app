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
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
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
                defaultBudget: {
                    include: {
                        budgetItems: true,
                    },
                },
            },
        });
        console.log(`User: ${user}`);
        return user;
    }
    async addExpenses(id) {
        const expenses = await this.prisma.month.findMany({
            where: { userId: id },
        });
        console.log(`Expenses: ${expenses}`);
        return expenses;
    }
    async deleteUser(id) {
        console.log(`Deleting user with id: ${id}`);
        if (!id || id === undefined) {
            return { message: 'No user found' };
        }
        const deleteExpenses = this.prisma.monthlyExpense.deleteMany({
            where: { userId: id },
        });
        const deleteBudget = this.prisma.budget.deleteMany({
            where: { userId: id },
        });
        const deleteBudgetItems = this.prisma.budgetItem.deleteMany({
            where: {
                budget: {
                    userId: id,
                },
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
            deleteBudget,
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