import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BalanceSummary from '../components/BalanceSummary';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import FilterModal from '../components/FilterModal';
import Header from '../components/Header';
import SpendingChart from '../components/SpendingChart';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';
import { FilterOptions } from '../types/Transaction';

const HomeScreen: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  const { transactions, addTransaction, summary, loading: transactionsLoading } = useTransactions();
  const { isDark, toggleTheme, loading: themeLoading } = useTheme();

  const filteredTransactions = useMemo(() => {
    // If no filters are active, just return everything
    if (Object.keys(activeFilters).length === 0) {
      return transactions;
    }
    
    // Apply the active filters
    return transactions.filter(transaction => {
      if (activeFilters.type && transaction.type !== activeFilters.type) {
        return false;
      }
      
      if (activeFilters.category && transaction.category !== activeFilters.category) {
        return false;
      }
      
      if (activeFilters.minAmount && transaction.amount < activeFilters.minAmount) {
        return false;
      }
      
      if (activeFilters.maxAmount && transaction.amount > activeFilters.maxAmount) {
        return false;
      }
      
      return true;
    });
  }, [transactions, activeFilters]);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const styles = getStyles(isDark);

  if (transactionsLoading || themeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1E1E1E' : '#FFFFFF'}
      />
      
      <Header
        onToggleTheme={toggleTheme}
        onOpenFilter={() => setShowFilters(true)}
        onOpenAddTransaction={() => setShowAddForm(true)}
        isDark={isDark}
        hasActiveFilters={hasActiveFilters}
      />

      <TransactionList 
        transactions={filteredTransactions} 
        isDark={isDark}
        headerComponent={
          <View>
            <BalanceSummary summary={summary} isDark={isDark} />
            {transactions.length > 0 && (
              <SpendingChart transactions={transactions} isDark={isDark} />
            )}
          </View>
        }
      />

      <AddTransactionForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddTransaction={addTransaction}
        isDark={isDark}
      />

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333333',
  },
});

export default HomeScreen;
