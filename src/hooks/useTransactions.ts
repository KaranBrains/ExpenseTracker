import { useMemo, useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, TransactionType, TransactionCategory, FilterOptions } from '../types/Transaction';
import { generateTransactionId, calculateSummary, filterTransactions } from '../utils/transactionUtils';

const STORAGE_KEY = 'expense_tracker_transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load saved transactions when component mounts

  // Load transactions from storage with proper date parsing
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const item = await AsyncStorage.getItem(STORAGE_KEY);
        if (item !== null) {
          const parsedTransactions = JSON.parse(item);
          // Need to convert date strings back to proper Date objects
          const validTransactions = parsedTransactions
            .filter((t: any) => t && t.id && t.amount !== undefined && t.date)
            .map((t: any) => ({
              ...t,
              date: new Date(t.date),
              amount: Number(t.amount),
            }))
            .filter((t: Transaction) => !isNaN(t.date.getTime()));
          
          setTransactions(validTransactions);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        // Clear any corrupted data if something goes wrong
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const saveTransactions = useCallback(async (newTransactions: Transaction[]) => {
    try {
      setTransactions(newTransactions);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }, []);

  const addTransaction = useCallback(async (
    amount: number,
    category: TransactionCategory,
    type: TransactionType,
    description?: string
  ) => {
    const newTransaction: Transaction = {
      id: generateTransactionId(),
      amount,
      category,
      type,
      date: new Date(),
      description,
    };

    const updatedTransactions = [...transactions, newTransaction];
    await saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  const getFilteredTransactions = useCallback((filters: FilterOptions) => {
    return filterTransactions(transactions, filters);
  }, [transactions]);

  const clearAllTransactions = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTransactions([]);
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  }, []);

  const summary = useMemo(() => {
    return calculateSummary(transactions);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getFilteredTransactions,
    clearAllTransactions,
    summary,
    loading,
  };
};
