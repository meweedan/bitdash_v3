// mobile/adfaly/screens/client/ClientDashboard.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;

const ClientDashboard = () => {
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = useState(false);
  const [isQRModalVisible, setQRModalVisible] = useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch wallet data
  const { 
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?` +
        `populate[customer][populate][avatar][fields][0]=url` +
        `&populate=*` +
        `&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    refetchInterval: 10000
  });


  // Fetch transactions
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError
  } = useQuery({
    queryKey: ['transactions', walletData?.data?.[0]?.id],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` + 
        `filters[sender][id][$eq]=${walletData.data[0].id}` +
        `&filters[status][$eq]=completed` +
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!walletData?.data?.[0]?.id
  });

  // Calculate transaction stats
  const transactionStats = useMemo(() => {
    if (!transactionsData?.data) return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalPayments: 0,
      monthlySpending: 0
    };

    const transactions = transactionsData.data || [];
    return {
      totalDeposits: transactions
        .filter(t => t?.attributes?.type === 'deposit')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      totalWithdrawals: transactions
        .filter(t => t?.attributes?.type === 'withdrawal')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      totalPayments: transactions
        .filter(t => t?.attributes?.type === 'payment')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      monthlySpending: transactions
        .filter(t => {
          if (!t?.attributes?.createdAt) return false;
          const date = new Date(t.attributes.createdAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear() &&
                 t.attributes.type === 'payment';
        })
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0)
    };
  }, [transactionsData]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchWallet()]).finally(() => setRefreshing(false));
  }, [refetchWallet]);

  if (isWalletLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (walletError || !walletData?.data?.[0]) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={24} color="red" />
        <Text style={styles.errorText}>
          {walletError?.message || 'Failed to load wallet data'}
        </Text>
      </View>
    );
  }

  const wallet = walletData.data[0].attributes;

  const MenuModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isMenuModalVisible}
      onRequestClose={() => setMenuModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setMenuModalVisible(false);
              navigation.navigate('Profile');
            }}
          >
            <Icon name="user" size={20} />
            <Text style={styles.menuItemText}>Profile Settings</Text>
          </TouchableOpacity>
          
          {/* Add other menu items here */}
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutButton]}
            onPress={async () => {
              setMenuModalVisible(false);
              await AsyncStorage.multiRemove(['token', 'user']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            <Icon name="log-out" size={20} color="red" />
            <Text style={[styles.menuItemText, { color: 'red' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              style={styles.avatar}
              source={{ uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}${wallet.customer?.data?.attributes?.avatar?.data?.attributes?.url}` }}
              defaultSource={require('../../assets/images/default-avatar.png')}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {wallet.customer?.data?.attributes?.fullName || 'User'}
              </Text>
              <Text style={styles.userEmail}>{wallet.customer?.data?.attributes?.email}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Transfer')}
            >
              <Icon name="arrow-left-circle" size={24} color="#0066cc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setQRModalVisible(true)}
            >
              <Icon name="credit-card" size={24} color="#6b46c1" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setMenuModalVisible(true)}
            >
              <Icon name="more-vertical" size={24} color="#4a5568" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {showBalance ? wallet.balance.toLocaleString() : '•••••••'} LYD
            </Text>
            <TouchableOpacity
              onPress={() => setShowBalance(!showBalance)}
            >
              <Icon name={showBalance ? "eye-off" : "eye"} size={24} color="#4a5568" />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceMeta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
            <Text style={styles.walletId}>ID: {wallet.walletId}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Daily Limit Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Daily Spending Limit</Text>
            <Text style={styles.statAmount}>
              {((wallet.dailyLimit - transactionStats?.monthlySpending) || 0).toLocaleString()} LYD
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(dailyLimitUsage, 100)}%`,
                    backgroundColor: dailyLimitUsage > 80 ? '#e53e3e' : '#0066cc'
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {dailyLimitUsage.toFixed(1)}% used today
            </Text>
          </View>

          {/* Monthly Activity Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Monthly Activity</Text>
            <Text style={styles.statAmount}>
              {(transactionStats?.monthlySpending || 0).toLocaleString()} LYD
            </Text>
            <View style={styles.activityGrid}>
              <View style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <Icon name="trending-up" size={16} color="#48bb78" />
                  <Text style={styles.activityLabel}>Income</Text>
                </View>
                <Text style={styles.activityAmount}>
                  {(transactionStats?.totalDeposits || 0).toLocaleString()} LYD
                </Text>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <Icon name="trending-down" size={16} color="#e53e3e" />
                  <Text style={styles.activityLabel}>Spent</Text>
                </View>
                <Text style={styles.activityAmount}>
                  {(transactionStats?.totalPayments || 0).toLocaleString()} LYD
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QR Code Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isQRModalVisible}
          onRequestClose={() => setQRModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Your Wallet QR Code</Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={wallet.walletId}
                  size={200}
                />
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setQRModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <MenuModal />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center'
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e2e8f0'
  },
  profileInfo: {
    marginLeft: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 14,
    color: '#718096'
  },
  actionButtons: {
    flexDirection: 'row'
  },
  iconButton: {
    padding: 8,
    marginLeft: 8
  },
  balanceCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  balanceLabel: {
    fontSize: 14,
    color: '#718096'
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748'
  },
  balanceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  badge: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  walletId: {
    marginLeft: 10,
    fontSize: 12,
    color: '#718096'
  },
  statsGrid: {
    padding: 15
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statLabel: {
    fontSize: 14,
    color: '#718096'
  },
  statAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 5
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  activityItem: {
    flex: 1
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5
  },
  activityAmount: {
    fontSize: 14,
    color: '#2d3748',
    marginTop: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: Platform.OS === 'ios' ? 300 : 250
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16
  },
  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 0
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  closeButton: {
    backgroundColor: '#e2e8f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a5568'
  }
});

export default ClientDashboard;