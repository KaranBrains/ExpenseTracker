import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Transaction } from '../types/Transaction';
import { useThemeContext } from '../contexts/ThemeContext';

interface SpendingChartProps {
  transactions: Transaction[];
}

const { width: screenWidth } = Dimensions.get('window');

const SpendingChart: React.FC<SpendingChartProps> = React.memo(({ transactions }) => {
  const { isDark } = useThemeContext();
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
      return [];
    }

    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];

    return Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        name: category,
        population: amount,
        color: colors[index % colors.length],
        legendFontColor: isDark ? '#FFFFFF' : '#333333',
        legendFontSize: 12,
      }))
      .sort((a, b) => b.population - a.population)
      .slice(0, 8); // Show top 8 categories
  }, [transactions, isDark]);

  const styles = getStyles(isDark);

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spending Breakdown</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📊</Text>
          <Text style={styles.emptyMessage}>No expense data to show</Text>
          <Text style={styles.emptySubMessage}>Add some expenses to see your spending breakdown</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Breakdown</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
    </View>
  );
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#B0B0B0' : '#666666',
    marginBottom: 8,
  },
  emptySubMessage: {
    fontSize: 14,
    color: isDark ? '#888888' : '#999999',
    textAlign: 'center',
  },
});

export default SpendingChart;
