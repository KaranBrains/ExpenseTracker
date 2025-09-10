import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionSummary } from '../types/Transaction';
import { formatCurrency } from '../utils/transactionUtils';
import { useThemeContext } from '../contexts/ThemeContext';

interface BalanceSummaryProps {
  summary: TransactionSummary;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = React.memo(({ summary }) => {
  const { isDark } = useThemeContext();
  const styles = getStyles(isDark);
  
  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={[
          styles.balanceAmount,
          { color: summary.totalBalance >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {formatCurrency(summary.totalBalance)}
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryAmount, styles.incomeText]}>
            {formatCurrency(summary.totalIncome)}
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expenseText]}>
            {formatCurrency(summary.totalExpenses)}
          </Text>
        </View>
      </View>
    </View>
  );
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  balanceCard: {
    backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: isDark ? '#B0B0B0' : '#666666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: isDark ? '#B0B0B0' : '#666666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
});

export default BalanceSummary;
