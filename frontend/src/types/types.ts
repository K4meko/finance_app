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
export interface JWTPayload {
  exp: number;
  // Add other JWT claims you expect
  iat?: number;
  sub?: string;
}
export interface MonthBudgetItem {
  amount: number;
  type: string;
  monthId: number;
}

export interface MonthlyExpense {
  id?: string;
  type: string;
  amount: number;
  userId: number;
  monthId?: number;
}

export interface Month {
  userId: number;
  year: number;
  timestamp: string;
  paycheck: number;
  createdAt: string; // DateTime is represented as string in JSON
  budgetId: number;
  budget: MonthBudgetItem[];
}
