import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { useTransactions } from '@/hooks/useTransactions';

const screenWidth = Dimensions.get('window').width;

// Premium "Dark/Modern" Chart Config
const chartConfig = {
  backgroundColor: "#4c669f",
  backgroundGradientFrom: "#3b5998",
  backgroundGradientTo: "#192f6a",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { transactions, chartData, deleteTransaction, filter, setFilter } = useTransactions();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) }
      ]
    );
  };

  const FilterButton = ({ label, value }: { label: string, value: '1W' | '1M' | '1Y' }) => (
    <TouchableOpacity
      style={[styles.filterBtn, filter === value && styles.filterBtnActive]}
      onPress={() => setFilter(value)}
    >
      <ThemedText style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <View>
          <ThemedText style={styles.greeting}>Hello,</ThemedText>
          <ThemedText type="title" style={styles.username}>{user?.email?.split('@')[0] || 'User'}</ThemedText>
        </View>
        <View style={styles.filterContainer}>
          <FilterButton label="1W" value="1W" />
          <FilterButton label="1M" value="1M" />
          <FilterButton label="1Y" value="1Y" />
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => auth.signOut()}>
          <IconSymbol name="person.circle" size={32} color="#4c669f" />
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/modal')}>
          <View style={styles.iconCircle}>
            <IconSymbol name="plus" size={24} color="#FFF" />
          </View>
          <ThemedText style={styles.actionText}>Add Expense</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/scan')}>
          <View style={[styles.iconCircle, { backgroundColor: '#192f6a' }]}>
            <IconSymbol name="camera.viewfinder" size={24} color="#FFF" />
          </View>
          <ThemedText style={styles.actionText}>Scan Receipt</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent Transactions</ThemedText>
        <View style={styles.list}>
          {transactions.length === 0 ? (
            <ThemedText style={{ opacity: 0.5, marginTop: 20 }}>No transactions yet.</ThemedText>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  <IconSymbol name={item.icon as any} size={20} color="#3b5998" />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText style={styles.tTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.tDate}>{item.date}</ThemedText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <ThemedText style={styles.tAmount}>-${item.amount}</ThemedText>
                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    <TouchableOpacity onPress={() => router.push({
                      pathname: '/modal',
                      params: {
                        id: item.id,
                        amount: item.amount,
                        title: item.title,
                        categoryId: item.category
                      }
                    })} style={{ marginRight: 10 }}>
                      <IconSymbol name="pencil" size={16} color="#4c669f" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <IconSymbol name="trash" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ThemedView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 28,
  },
  profileButton: {
    padding: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    shadowColor: "#3b5998",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  list: {
    marginTop: 15,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  tTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f6',
    borderRadius: 20,
    padding: 4,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  filterBtnActive: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#4c669f',
  }
});
