import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { TransactionType, TransactionCategory } from '../types/Transaction';

interface AddTransactionFormProps {
  visible: boolean;
  onClose: () => void;
  onAddTransaction: (
    amount: number,
    category: TransactionCategory,
    type: TransactionType,
    description?: string
  ) => void;
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

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  visible,
  onClose,
  onAddTransaction,
  isDark,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('Food');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');

  const styles = getStyles(isDark);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    // Basic validation to make sure amount is valid
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    onAddTransaction(numAmount, selectedCategory, selectedType, description.trim() || undefined);
    
    // Clear form and close modal
    setAmount('');
    setSelectedCategory('Food');
    setSelectedType('expense');
    setDescription('');
    onClose();
  };

  const handleCancel = () => {
    // Just reset everything and close
    setAmount('');
    setSelectedCategory('Food');
    setSelectedType('expense');
    setDescription('');
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
          <Text style={styles.title}>Add Transaction</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>

          {/* Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'expense' && styles.selectedTypeButton,
                  selectedType === 'expense' && { backgroundColor: '#F44336' },
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
                  selectedType === 'income' && { backgroundColor: '#4CAF50' },
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

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
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

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              multiline
              returnKeyType="done"
            />
          </View>
        </ScrollView>
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
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: isDark ? '#4CAF50' : '#2196F3',
    fontSize: 16,
    fontWeight: '600',
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
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    borderBottomWidth: 2,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
    paddingVertical: 8,
    textAlign: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: isDark ? '#333333' : '#E0E0E0',
    alignItems: 'center',
  },
  selectedTypeButton: {
    borderColor: 'transparent',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  descriptionInput: {
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default AddTransactionForm;
