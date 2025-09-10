import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TransactionType, TransactionCategory } from '../types/Transaction';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { useThemeContext } from '../contexts/ThemeContext';

type AddTransactionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTransaction'>;
type AddTransactionScreenRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;

interface AddTransactionScreenProps {
  navigation: AddTransactionScreenNavigationProp;
  route: AddTransactionScreenRouteProp;
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

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({
  navigation,
  route,
}) => {
  const { onAddTransaction } = route.params;
  const { isDark } = useThemeContext();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('Food');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');

  const styles = useMemo(() => getStyles(isDark), [isDark]);

  const handleSubmit = useCallback(() => {
    const numAmount = parseFloat(amount);
    
    // Basic validation to make sure amount is valid
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    onAddTransaction(numAmount, selectedCategory, selectedType, description.trim() || undefined);
    
    // Navigate back to home screen
    navigation.goBack();
  }, [amount, selectedCategory, selectedType, description, onAddTransaction, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#FFFFFF' : '#333333'} 
          />
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
    </SafeAreaView>
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
  backButton: {
    padding: 8,
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

export default AddTransactionScreen;
