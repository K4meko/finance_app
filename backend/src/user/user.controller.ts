import {
  Body,
  Controller,
  Delete,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get('me')
  getUserBudgeting(@GetUser() user: User) {
    return this.service.getUserInfo(user.id);
  }

  @Post('expense')
  async AddExpenses(@GetUser() user: User) {
    return this.service.addExpenses(user.id);
  }

  @Delete()
  async DeleteUser(@GetUser() user: User) {
    return this.service.deleteUser(user.id);
  }

  @Put('update')
  async UpdateInformation(
    @GetUser() user: User,
    @Body()
    body: {
      lastName?: string;
      firstName?: string;
      email?: string;
      password?: string;
      oldPassword?: string;
    },
  ) {
    return this.service.updateInformation(user.id, body);
  }

  @Put('settings')
  async UpdateSettings(
    @GetUser() user: User,
    @Body() body: { newItems?: BudgetItem[]; expectedDatePaycheck?: Date },
  ) {
    // console.log(newItems, expectedDatePaycheck);
    if (body.newItems) {
      // console.log(`printing Budget: ${newItems}`);
      await this.service.updateBudget(user.id, body.newItems);
    }
    if (body.expectedDatePaycheck) {
      // console.log(`printing Paycheck: ${expectedDatePaycheck}`);
      await this.service.updatePaycheck(user.id, body.expectedDatePaycheck);
    }
    const updatedUser = await this.service.getSettings(user.id);
    return {
      items: updatedUser.defaultBudget,
      paycheck: updatedUser.expectedDatePaycheck,
    };
  }
}
