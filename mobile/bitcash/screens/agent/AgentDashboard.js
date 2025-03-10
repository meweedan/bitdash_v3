// mobile/bitcash/screens/agent/AgentDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import QRScannerModal from '../../components/QRScannerModal';
import { useNavigation } from '@react-navigation/native';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import CashBalanceWidget from '../../components/adfaaly/agent/CashBalanceWidget';
import { Card } from '../../components/SharedComponents';

const ProcessingFeesWidget = ({ transactions }) => {
  const calculateProcessingFees = () => {
    if (!transactions?.data?.length) return {
      totalFees: 0,
      depositFees: 0,
      withdrawalFees: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.data.filter(tx => 
      tx.attributes.createdAt.startsWith(today)
    );

    return {
      totalFees: todayTransactions.reduce((sum, tx) => 
        sum + (parseFloat(tx.attributes.fee) || 0), 0
      ),
      depositFees: todayTransactions
        .filter(tx => tx.attributes.type === 'deposit')
        .reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0),
      withdrawalFees: todayTransactions
        .filter(tx => tx.attributes.type === 'withdrawal')
        .reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0)
    };
  };

  const { totalFees, depositFees, withdrawalFees } = calculateProcessingFees();

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="dollar-sign" size={20} color="#666" />
        <ThemedText style={styles.cardTitle}>Processing Fees</ThemedText>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Total Fees</ThemedText>
          <ThemedText style={styles.statValue}>LYD {totalFees.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Deposit Fees</ThemedText>
          <ThemedText style={styles.statValue}>LYD {depositFees.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Withdrawal Fees</ThemedText>
          <ThemedText style={styles.statValue}>LYD {withdrawalFees.toFixed(2)}</ThemedText>
        </View>
      </View>
    </Card>
  );
};

const AgentDashboard = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [scanType, setScanType] = useState(null);
  const [scannedCustomer, setScannedCustomer] = useState(null);
  const [isQRVisible, setQRVisible] = useState(false);

  // Fetch agent data
  const { 
    data: agentData, 
    isLoading: isAgentLoading,
    error: agentError,
    refetch: refetchAgent
  } = useQuery({
    queryKey: ['agentData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?` +
        `filters[users_permissions_user][id][$eq]=${user.id}&` +
        `populate[wallet][populate]=*&` +
        `populate[transactions][limit]=10&` +
        `populate[transactions][sort][0]=createdAt:desc&` +
        `populate[operator][fields][0]=fullName&` +
        `populate[payment_links][filters][status][$eq]=active&` +
        `populate[location]=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch agent data');
      return response.json();
    },
    retry: 1,
    onError: (error) => {
      Alert.alert('Error', error.message);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  });

  const agent = agentData?.data?.[0]?.attributes || {};
  const wallet = agent?.wallet?.data?.attributes || {};

  // Calculate daily stats
  const dailyStats = useMemo(() => {
    if (!agent?.transactions?.data) return {
      totalTransactions: 0,
      totalVolume: 0,
      deposits: 0,
      withdrawals: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = agent.transactions.data.filter(tx =>
      tx.attributes.createdAt.startsWith(today)
    );

    return {
      totalTransactions: todayTransactions.length,
      totalVolume: todayTransactions.reduce((sum, tx) => 
        sum + (parseFloat(tx.attributes.amount) || 0), 0
      ),
      deposits: todayTransactions.filter(tx => 
        tx.attributes.type === 'deposit'
      ).reduce((sum, tx) => sum + (parseFloat(tx.attributes.amount) || 0), 0),
      withdrawals: todayTransactions.filter(tx => 
        tx.attributes.type === 'withdrawal'
      ).reduce((sum, tx) => sum + (parseFloat(tx.attributes.amount) || 0), 0)
    };
  }, [agent?.transactions?.data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAgent();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (isAgentLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading your dashboard...</ThemedText>
      </ThemedView>
    );
  }

  if (agentError || !agent) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Icon name="alert-circle" size={40} color="red" />
        <ThemedText style={styles.errorTitle}>Error Loading Dashboard</ThemedText>
        <ThemedText style={styles.errorText}>
          {agentError?.message || 'Failed to load agent data'}
        </ThemedText>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.navigate('Login')}
        >
          <ThemedText style={styles.errorButtonText}>Return to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.headerTitle}>Agent Dashboard</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {agent?.operator?.data?.attributes?.fullName}
            </ThemedText>
            <View style={[
              styles.badge,
              { backgroundColor: agent?.status === 'active' ? '#48BB78' : '#ED8936' }
            ]}>
              <ThemedText style={styles.badgeText}>
                {agent?.status?.toUpperCase()}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => {
              Alert.alert(
                'Options',
                'Select an option',
                [
                  {
                    text: 'View All Transactions',
                    onPress: () => navigation.navigate('Transactions')
                  },
                  {
                    text: 'Settings',
                    onPress: () => navigation.navigate('Settings')
                  },
                  {
                    text: 'Logout',
                    onPress: handleLogout,
                    style: 'destructive'
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
            }}
          >
            <Icon name="menu" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Cash Balance */}
        <CashBalanceWidget
          data={agent}
          onDeposit={() => navigation.navigate('Deposit')}
          onWithdraw={() => navigation.navigate('Withdraw')}
        />

        {/* Processing Fees */}
        <ProcessingFeesWidget transactions={agent?.transactions} />

        {/* QR Scanner */}
        <QRScannerModal
          visible={isQRVisible}
          onClose={() => setQRVisible(false)}
          onScan={handleScan}
        />

        {/* Transactions List */}
        <Card style={styles.transactionsCard}>
          <View style={styles.transactionsHeader}>
            <ThemedText style={styles.transactionsTitle}>Recent Transactions</ThemedText>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Transactions')}
              style={styles.viewAllButton}
            >
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
              <Icon name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Add TransactionList component here */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 10
  },
  errorButton: {
    backgroundColor: '#E53E3E',
    padding: 12,
    borderRadius: 8,
    marginTop: 20
  },
  errorButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },
  menuButton: {
    padding: 8
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 3
      }
    })
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  transactionsCard: {
    margin: 16,
    marginTop: 0
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewAllText: {
    marginRight: 4,
    color: '#666'
  }
});

export default AgentDashboard;