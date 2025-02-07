import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BitCashDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data from AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        setUser(parsedUser);

        // Fetch wallet balance and transactions 
        // This would typically be an API call
        const walletResponse = await fetch(`${process.env.API_URL}/wallet`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        });
        const walletData = await walletResponse.json();
        setBalance(walletData.balance);

        const transactionsResponse = await fetch(`${process.env.API_URL}/transactions`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        });
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.slice(0, 5)); // Last 5 transactions
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      icon: 'arrow-up',
      label: 'Send',
      onPress: () => navigation.navigate('Transfer')
    },
    {
      icon: 'arrow-down',
      label: 'Receive',
      onPress: () => navigation.navigate('Receive')
    },
    {
      icon: 'card',
      label: 'Pay',
      onPress: () => navigation.navigate('PaymentOptions')
    },
    {
      icon: 'wallet',
      label: 'Top Up',
      onPress: () => navigation.navigate('TopUp')
    }
  ];

  const chartConfig = {
    backgroundColor: '#4CAF50',
    backgroundGradientFrom: '#4CAF50',
    backgroundGradientTo: '#45A049',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      {/* Profile & Balance Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image 
            source={
              user?.avatar 
              ? { uri: user.avatar } 
              : require('../assets/default-avatar.png')
            } 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || 'User'}
            </Text>
            <Text style={styles.balanceText}>
              Balance: {balance.toLocaleString()} LYD
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.quickActionButton}
            onPress={action.onPress}
          >
            <Ionicons 
              name={action.icon} 
              size={24} 
              color="#4CAF50" 
            />
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Spending Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Spending Trend</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              data: [50, 80, 90, 70, 100, 120]
            }]
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>
                {transaction.type}
              </Text>
              <Text style={styles.transactionSubtitle}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[
              styles.transactionAmount, 
              transaction.type === 'Deposit' 
                ? styles.depositAmount 
                : styles.withdrawalAmount
            ]}>
              {transaction.amount.toLocaleString()} LYD
            </Text>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <Text style={styles.viewAllText}>View All Transactions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  profileHeader: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceText: {
    color: 'white',
    fontSize: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 16,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    color: '#4CAF50',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  transactionDetails: {},
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionSubtitle: {
    color: 'gray',
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositAmount: {
    color: 'green',
  },
  withdrawalAmount: {
    color: 'red',
  },
  viewAllButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  }
});

export default BitCashDashboard;