import { Injectable } from '@nestjs/common';
import { BudgetItem, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateBudget(id: number, newItems: BudgetItem[]) {
    console.log(newItems);
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

    // const items = await newItems.map((item) => {
    //   return this.prisma.budgetItem.create({
    //     data: {
    //       amount: item.amount,
    //       type: item.type,
    //       budget: {
    //         connect: {
    //           userId: id,
    //         },
    //       },
    //     },
    //   });
    // });

    //console.log(items);
    return { message: 'Budget updated' };
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

  async addExpenses(id: number) {
    const expenses = await this.prisma.month.findMany({
      where: { userId: id },
    });
    console.log(`Expenses: ${expenses}`);
    return expenses;
  }
  async deleteUser(id: number) {
    console.log(`Deleting user with id: ${id}`);
    if (!id || id === undefined) {
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
