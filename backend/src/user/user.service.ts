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

  async updateSalary(id: number, salaryAmount: number) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        salaryAmount: salaryAmount,
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
      select: {
        id: true,
        hash: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    if (data.oldPassword && data.password) {
      const pwMatch = await argon.verify(user.hash, data.oldPassword);
      if (!pwMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      updateData.hash = await argon.hash(data.password);
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
  async updateExpenses(
    new_expenses: MonthlyExpense[],
    userId: number,
    monthId: number,
  ) {
    // Delete existing expenses for the month
    await this.prisma.monthlyExpense.deleteMany({ 
      where: { 
        userId,
        monthId 
      } 
    });

    // Create new expenses
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
  async findMonthByISO(userId: number, monthISO: string) {
    return this.prisma.month.findFirst({
      where: {
        userId,
        timestamp: monthISO,
      },
    });
  }
  async createMonth(
    userId: number,
    monthISO: string,
    name: string,
    salary: number,
    expenses: MonthlyExpense[],
    budgetItems: BudgetItem[]
  ) {
    // Extract year and month from ISO string
    const [year, month] = monthISO.split('-').map(Number);
    
    // Check if month already exists for this user and year/month
    const existingMonth = await this.prisma.month.findFirst({
      where: {
        userId,
        year,
        month,
      },
    });

    let monthRecord;
    if (existingMonth) {
      // Update existing month
      monthRecord = await this.prisma.month.update({
        where: { id: existingMonth.id },
        data: {
          name,
          salary,
          paycheck: salary,
        },
      });

      // Delete existing expenses and budget items
      await this.prisma.monthlyExpense.deleteMany({
        where: { monthId: existingMonth.id }
      });
      await this.prisma.monthBudgetItem.deleteMany({
        where: { monthId: existingMonth.id }
      });
    } else {
      // Create new month
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

    // Create expenses for the month
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

    // Create budget items for the month
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

  async updateMonth(
    monthId: number,
    name: string,
    salary: number,
    expenses: MonthlyExpense[],
    budgetItems: BudgetItem[]
  ) {
    // Update month details
    const month = await this.prisma.month.update({
      where: { id: monthId },
      data: {
        name,
        salary,
        paycheck: salary
      }
    });

    // Update expenses
    await this.updateExpenses(expenses, month.userId, monthId);

    // Update budget items
    await this.updateMonthBudget(monthId, budgetItems, month.userId);

    return month;
  }

  async deleteUser(id: number) {
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

  async updateMonthBudget(
    monthId: number,
    budgetItems: BudgetItem[],
    userId: number
  ) {
    // Delete existing budget items for the month
    await this.prisma.monthBudgetItem.deleteMany({ 
      where: { 
        monthId,
      } 
    });

    // Create new budget items
    if (budgetItems && budgetItems.length > 0) {
      await this.prisma.monthBudgetItem.createMany({
        data: budgetItems.map(item => ({
          ...item,
          monthId,
        })),
      });
    }
  }
}
