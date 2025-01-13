export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  createdAt: string; // DateTime is represented as string in JSON
  updatedAt: string; // DateTime is represented as string in JSON
  expectedDatePaycheck?: string; // DateTime is represented as string in JSON
  salaryAmount?: number;
  months: Month[];
  monthlyExpenses: MonthlyExpense[];
  defaultBudget: BudgetItem[];
}

export interface BudgetItem {
  amount: number;
  type: string;
}

export interface MonthBudgetItem {
  amount: number;
  type: string;
  monthId: number;
}

export interface MonthlyExpense {
  type: string;
  amount: number;
  userId: number;
}

export interface Month {
  userId: number;
  year: number;
  paycheck: number;
  createdAt: string; // DateTime is represented as string in JSON
  budgetId: number;
  budget: MonthBudgetItem[];
}
