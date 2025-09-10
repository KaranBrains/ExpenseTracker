import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { FilterOptions, TransactionType, TransactionCategory } from '../types/Transaction';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  isDark: boolean;
}

const CATEGORIES: TransactionCategory[] = [
  'Food',
  'Travel',
  'Shopping',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Salary',
  'Business',
  'Other',
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
  isDark,
}) => {
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>(currentFilters.type);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | undefined>(currentFilters.category);
  const [minAmount, setMinAmount] = useState(currentFilters.minAmount?.toString() || '');
  const [maxAmount, setMaxAmount] = useState(currentFilters.maxAmount?.toString() || '');

  const styles = getStyles(isDark);

  const handleApply = () => {
    const filters: FilterOptions = {
      type: selectedType,
      category: selectedCategory,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setSelectedType(undefined);
    setSelectedCategory(undefined);
    setMinAmount('');
    setMaxAmount('');
    onApplyFilters({});
    onClose();
  };

  const handleCancel = () => {
    // Reset to current filters
    setSelectedType(currentFilters.type);
    setSelectedCategory(currentFilters.category);
    setMinAmount(currentFilters.minAmount?.toString() || '');
    setMaxAmount(currentFilters.maxAmount?.toString() || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filter Transactions</Text>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Filter */}
          <View style={styles.section}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  !selectedType && styles.selectedTypeButton,
                ]}
                onPress={() => setSelectedType(undefined)}
              >
                <Text
                  style={[
                    styles.typeText,
                    !selectedType && styles.selectedTypeText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'expense' && styles.selectedTypeButton,
                ]}
                onPress={() => setSelectedType('expense')}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === 'expense' && styles.selectedTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'income' && styles.selectedTypeButton,
                ]}
                onPress={() => setSelectedType('income')}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === 'income' && styles.selectedTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  !selectedCategory && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(undefined)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    !selectedCategory && styles.selectedCategoryText,
                  ]}
                >
                  All Categories
                </Text>
              </TouchableOpacity>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Range Filter */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount Range</Text>
            <View style={styles.amountContainer}>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Min Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  value={minAmount}
                  onChangeText={setMinAmount}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Max Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  value={maxAmount}
                  onChangeText={setMaxAmount}
                  placeholder="No limit"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: isDark ? '#FF6B6B' : '#F44336',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    color: isDark ? '#FFA726' : '#FF9800',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
  },
  selectedTypeButton: {
    backgroundColor: isDark ? '#2196F3' : '#2196F3',
    borderColor: isDark ? '#2196F3' : '#2196F3',
  },
  typeText: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  selectedTypeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
    backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
  },
  selectedCategoryButton: {
    backgroundColor: isDark ? '#2196F3' : '#2196F3',
    borderColor: isDark ? '#2196F3' : '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  amountInputContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    color: isDark ? '#B0B0B0' : '#666666',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333333' : '#E0E0E0',
  },
  applyButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
