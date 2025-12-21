import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { useTransactions } from '@/hooks/useTransactions';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isEdit = !!id;

  const [amount, setAmount] = useState(params.amount as string || '');
  const [title, setTitle] = useState(params.title as string || '');

  const categories = [
    { id: 'food', icon: 'cart.fill', label: 'Food' },
    { id: 'transport', icon: 'car.fill', label: 'Transport' },
    { id: 'ent', icon: 'tv.fill', label: 'Entertainment' },
    { id: 'health', icon: 'heart.fill', label: 'Health' },
  ];

  const initialCategory = categories.find(c => c.id === params.categoryId) || categories[0];
  const [category, setCategory] = useState(initialCategory);

  const { addTransaction, updateTransaction } = useTransactions();

  const handleSave = async () => {
    if (!amount || !title) {
      Alert.alert('Missing Info', 'Please enter amount and title');
      return;
    }

    let success = false;
    if (isEdit) {
      success = (await updateTransaction(id, amount, title, category)) ?? false;
    } else {
      success = (await addTransaction(amount, title, category)) ?? false;
    }

    if (success) {
      // Alert.alert('Success', isEdit ? 'Expense Updated!' : 'Expense Added!'); // Option: remove alert for speed
      router.dismiss();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ThemedText type="title" style={styles.title}>{isEdit ? 'Edit Expense' : 'New Expense'}</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <View style={styles.amountContainer}>
          <ThemedText style={styles.currency}>$</ThemedText>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="What is this for?"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catButton, category.id === cat.id && styles.catActive]}
              onPress={() => setCategory(cat)}
            >
              <IconSymbol name={cat.icon as any} size={24} color={category.id === cat.id ? '#FFF' : '#666'} />
              <ThemedText style={[styles.catLabel, category.id === cat.id && styles.catLabelActive]}>{cat.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  currency: {
    fontSize: 40,
    marginRight: 10,
    color: '#333',
  },
  amountInput: {
    fontSize: 40,
    flex: 1,
    color: '#333',
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    color: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    width: 75,
  },
  catActive: {
    backgroundColor: '#4c669f',
  },
  catLabel: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  catLabelActive: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
