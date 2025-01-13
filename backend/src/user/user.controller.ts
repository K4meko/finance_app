import { Body, Controller, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { GuardsConsumer } from '@nestjs/core/guards';
import { AuthGuard } from '@nestjs/passport';
import { BudgetItem, User } from '@prisma/client';
import { request } from 'express';
import { get } from 'http';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('home')
  async Home(@GetUser() user: User) {
    const foundUser = await this.service.getUserById(user.id);
    if (foundUser) {
      return foundUser;
    } else {
      return { message: 'User not found' };
    }
  }
  @Get('get-user-info')
  getUserBudgeting(@GetUser() user: User) {
    return this.service.getUserInfo(user.id);
  }
  @Get('find-user')
  FindUser(@GetUser() user: User) {
    return this.service.getUserById(user.id);
  }

  @Post('add-expenses')
  async AddExpenses(@GetUser() user: User) {
    this.service.addExpenses(user.id);
  }

  @Delete('delete-user')
  async DeleteUser(@GetUser() user: User) {
    this.service.deleteUser(user.id);
  }
  @Put('update-budget')
  async UpdateBudget(@GetUser() user: User, @Body() newItems: BudgetItem[]) {
    return this.service.updateBudget(user.id, newItems);
  }
}
