import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BudgetItem, MonthlyExpense, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateBudget(id: number, newItems: BudgetItem[]) {
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

  async updatePaycheck(id: number, expectedDatePaycheck: Date) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        expectedDatePaycheck: expectedDatePaycheck,
      },
    });
  }
  async updateInformation(
    id: number,
    data: {
      lastName?: string;
      firstName?: string;
      email?: string;
      password?: string;
      oldPassword?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    if (user.password && data.oldPassword) {
      const pwMatch = await argon.verify(user.password, data.oldPassword);
      if (!pwMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      updateData.password = await argon.hash(data.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  }
  async getUserById(id: number) {
    if (!id) {
      return { message: 'No user found' };
    }
    const user: User = await this.prisma.user.findUnique({
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
  async getUserInfo(id: number) {
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

  async getSettings(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
      include: {
        monthlyExpenses: true,
        months: true,
        defaultBudget: true,
      },
    });
  }

  async addExpenses(id: number) {
    const expenses = await this.prisma.month.findMany({
      where: { userId: id },
    });
    console.log(`Expenses: ${expenses}`);
    return expenses;
  }
  async updateExpenses(new_expenses: MonthlyExpense[], userId: number) {
    await this.prisma.month.updateMany({
      data: new_expenses,
      where: { userId },
    });
  }
  async deleteUser(id: number) {
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
}
