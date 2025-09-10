import { TransactionType, TransactionCategory } from './Transaction';

export type RootStackParamList = {
  Home: undefined;
  AddTransaction: {
    onAddTransaction: (
      amount: number,
      category: TransactionCategory,
      type: TransactionType,
      description?: string
    ) => void;
    isDark: boolean;
  };
};
