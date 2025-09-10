import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';

interface HeaderProps {
  onOpenFilter: () => void;
  onOpenAddTransaction: () => void;
  hasActiveFilters: boolean;
}

const Header: React.FC<HeaderProps> = React.memo(({
  onOpenFilter,
  onOpenAddTransaction,
  hasActiveFilters,
}) => {
  const { isDark, toggleTheme } = useThemeContext();
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Track your finances</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onOpenFilter}
          accessibilityLabel="Filter transactions"
        >
          <Ionicons 
            name="filter" 
            size={24} 
            color={isDark ? '#FFFFFF' : '#333333'} 
          />
          {hasActiveFilters && <View style={styles.filterIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme"
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={isDark ? '#FFFFFF' : '#333333'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={onOpenAddTransaction}
          accessibilityLabel="Add transaction"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: isDark ? '#B0B0B0' : '#666666',
    marginTop: 2,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 12,
    marginLeft: 4,
  },
});

export default Header;
