import React, { useState, useMemo, useCallback } from 'react';
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
import FilterModal from '../components/FilterModal';
import Header from '../components/Header';
import SpendingChart from '../components/SpendingChart';
import { useTransactions } from '../hooks/useTransactions';
import { useThemeContext } from '../contexts/ThemeContext';
import { FilterOptions } from '../types/Transaction';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/Navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  const { transactions, addTransaction, summary, loading: transactionsLoading } = useTransactions();
  const { isDark, toggleTheme, loading: themeLoading } = useThemeContext();

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

  const hasActiveFilters = useMemo(() => Object.keys(activeFilters).length > 0, [activeFilters]);

  const styles = useMemo(() => getStyles(isDark), [isDark]);

  const handleOpenFilter = useCallback(() => setShowFilters(true), []);
  
  const handleCloseFilter = useCallback(() => setShowFilters(false), []);
  
  const handleOpenAddTransaction = useCallback(() => navigation.navigate('AddTransaction', {
    onAddTransaction: addTransaction,
  }), [navigation, addTransaction]);

  const headerComponent = useMemo(() => (
    <View>
      <BalanceSummary summary={summary} />
      {transactions.length > 0 && (
        <SpendingChart transactions={transactions} />
      )}
    </View>
  ), [summary, transactions]);

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
        onOpenFilter={handleOpenFilter}
        onOpenAddTransaction={handleOpenAddTransaction}
        hasActiveFilters={hasActiveFilters}
      />

      <TransactionList 
        transactions={filteredTransactions} 
        headerComponent={headerComponent}
      />

      <FilterModal
        visible={showFilters}
        onClose={handleCloseFilter}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters}
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
