import { format } from 'date-fns';
import { Transaction, TransactionSummary, FilterOptions } from '../types/Transaction';

export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'dd-MM-yyyy');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateSummary = (transactions: Transaction[]): TransactionSummary => {
  let totalIncome = 0;
  let totalExpenses = 0;
  
  // Go through all transactions and add up income/expenses
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });
  
  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
  };
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] => {
  return transactions.filter(transaction => {
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    if (filters.minAmount && transaction.amount < filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount && transaction.amount > filters.maxAmount) {
      return false;
    }
    
    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false;
    }
    
    return true;
  });
};

export const generateTransactionId = (): string => {
  return `transaction_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => {
    // Make sure we're working with actual Date objects
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    
    // Sort newest first
    return dateB.getTime() - dateA.getTime();
  });
};
