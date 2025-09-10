import React, { useMemo, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/Transaction';
import TransactionItem from './TransactionItem';
import { sortTransactionsByDate } from '../utils/transactionUtils';
import { useThemeContext } from '../contexts/ThemeContext';

interface TransactionListProps {
  transactions: Transaction[];
  headerComponent?: React.ReactElement;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, headerComponent }) => {
  const { isDark } = useThemeContext();
  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(transactions);
  }, [transactions]);

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} />
  ), []);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>📋</Text>
      <Text style={[styles.emptyMessage, { color: isDark ? '#B0B0B0' : '#666666' }]}>
        No transactions yet
      </Text>
      <Text style={[styles.emptySubMessage, { color: isDark ? '#888888' : '#999999' }]}>
        Add your first transaction to get started
      </Text>
    </View>
  ), [isDark]);

  const styles = getStyles(isDark);

  const ListHeaderComponent = useCallback(() => (
    <View>
      {headerComponent}
      <Text style={styles.header}>Recent Transactions</Text>
    </View>
  ), [headerComponent, styles.header]);

  return (
    <FlatList
      style={styles.container}
      data={sortedTransactions}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={headerComponent ? ListHeaderComponent : () => (
        <Text style={styles.header}>Recent Transactions</Text>
      )}
      ListEmptyComponent={renderEmptyComponent}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TransactionList;
