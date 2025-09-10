export type TransactionType = 'income' | 'expense';

// All the different categories we support for transactions
export type TransactionCategory = 
  | 'Food' 
  | 'Travel' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Bills' 
  | 'Healthcare' 
  | 'Education' 
  | 'Salary' 
  | 'Business' 
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  date: Date;
  description?: string;
}

export interface TransactionSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface FilterOptions {
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ThemeMode {
  isDark: boolean;
}
