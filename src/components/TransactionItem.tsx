import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/Transaction';
import { formatDate, formatCurrency } from '../utils/transactionUtils';
import { useThemeContext } from '../contexts/ThemeContext';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = React.memo(({ transaction }) => {
  const { isDark } = useThemeContext();
  const styles = getStyles(isDark);
  const isIncome = transaction.type === 'income';
  
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: isIncome ? '#E8F5E8' : '#FFF3E0' }
        ]}>
          <Text style={styles.categoryEmoji}>
            {getCategoryIcon(transaction.category)}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
          {transaction.description && (
            <Text style={styles.description}>{transaction.description}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: isIncome ? '#4CAF50' : '#F44336' }
        ]}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={[
          styles.type,
          { color: isIncome ? '#4CAF50' : '#F44336' }
        ]}>
          {transaction.type.toUpperCase()}
        </Text>
      </View>
    </View>
  );
});

// Simple function to get emoji for each category
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    Food: '🍽️',
    Travel: '✈️',
    Shopping: '🛒',
    Entertainment: '🎬',
    Bills: '📄',
    Healthcare: '🏥',
    Education: '📚',
    Salary: '💰',
    Business: '💼',
    Other: '📝',
  };
  return iconMap[category] || '📝';
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: isDark ? '#B0B0B0' : '#666666',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TransactionItem;
