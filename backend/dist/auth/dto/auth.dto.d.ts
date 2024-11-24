declare class MonthlyExpense {
    name: string;
    amount: number;
}
export declare class AuthDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfPaycheck?: Date;
    monthlyExpenses?: MonthlyExpense[];
}
export {};
