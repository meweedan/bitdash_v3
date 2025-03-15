// mobile/adfaly/screens/merchant/MerchantDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  SafeAreaView,
  Modal
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Custom Components
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import WalletBalance from '../../components/adfaly/merchant/WalletBalance';
import PaymentLinkGenerator from './PaymentLinkGenerator';
import TransactionsList from './MerchantTransactions';
import { Card } from '../../components/SharedComponents';

const StatCard = ({ label, value, prefix, suffix, icon, color }) => (
  <Card style={styles.statCard}>
    <View style={styles.statHeader}>
      <Icon name={icon} size={24} color={color} />
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
    <ThemedText style={styles.statValue}>
      {prefix ? prefix + ' ' : ''}
      {typeof value === 'number' ? value.toLocaleString() : value}
      {suffix ? ' ' + suffix : ''}
    </ThemedText>
  </Card>
);

const MerchantDashboard = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isPaymentLinkModalVisible, setPaymentLinkModalVisible] = useState(false);

  // Fetch merchant data
  const { data: merchantData, isLoading, refetch } = useQuery({
    queryKey: ['merchantData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants?populate=*&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch merchant data');
      return response.json();
    },
    enabled: true,
    refetchInterval: 30000
  });

  // Export mutation
  const exportTransactions = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      return blob;
    },
    onSuccess: async (blob) => {
      try {
        const fileName = `transactions_${new Date().toISOString()}.csv`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1];
          
          // Save file
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          // Share file
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          }
        };
      } catch (error) {
        Alert.alert('Error', 'Failed to export transactions');
      }
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const showMenu = () => {
    Alert.alert(
      'Menu',
      'Select an option',
      [
        {
          text: 'Create Payment Link',
          onPress: () => setPaymentLinkModalVisible(true)
        },
        {
          text: 'Export Transactions',
          onPress: () => exportTransactions.mutate()
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
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading your dashboard...</ThemedText>
      </ThemedView>
    );
  }

  const merchant = merchantData?.data?.[0]?.attributes || {};

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
            <ThemedText style={styles.businessName}>
              {merchant?.metadata?.businessName || 'Merchant Dashboard'}
            </ThemedText>
            <View style={[
              styles.badge,
              { backgroundColor: merchant?.status === 'active' ? '#48BB78' : '#ECC94B' }
            ]}>
              <ThemedText style={styles.badgeText}>{merchant?.status}</ThemedText>
            </View>
          </View>
          <TouchableOpacity onPress={showMenu}>
            <Icon name="menu" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Wallet Balance */}
        <WalletBalance
          type="merchant"
          walletId={merchant?.wallet?.data?.id}
        />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Revenue"
            value={merchant?.metadata?.totalRevenue || 0}
            prefix="LYD"
            icon="dollar-sign"
            color="#3182CE"
          />
          <StatCard
            label="Today's Sales"
            value={merchant?.metadata?.todaySales || 0}
            prefix="LYD"
            icon="trending-up"
            color="#48BB78"
          />
          <StatCard
            label="Active Links"
            value={merchant?.metadata?.activeLinks || 0}
            icon="link"
            color="#805AD5"
          />
          <StatCard
            label="Success Rate"
            value={merchant?.metadata?.successRate || 0}
            suffix="%"
            icon="credit-card"
            color="#DD6B20"
          />
        </View>

        {/* Business Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Business Details</ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailsContent}>
            <DetailItem 
              label="Business Name" 
              value={merchant?.metadata?.businessName || 'N/A'} 
            />
            <DetailItem 
              label="Registration Number" 
              value={merchant?.metadata?.registrationNumber || 'N/A'} 
            />
            <DetailItem 
              label="Contact Phone" 
              value={merchant?.metadata?.contact?.phone || 'N/A'} 
            />
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Recent Transactions</ThemedText>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={() => exportTransactions.mutate()}
            >
              <Icon name="download" size={16} color="#666" />
              <ThemedText style={styles.exportText}>Export</ThemedText>
            </TouchableOpacity>
          </View>
          
          <TransactionsList merchantId={merchantData?.data?.[0]?.id} />
        </Card>
      </ScrollView>

      {/* Payment Link Generator Modal */}
      <Modal
        visible={isPaymentLinkModalVisible}
        animationType="slide"
        onRequestClose={() => setPaymentLinkModalVisible(false)}
      >
        <PaymentLinkGenerator
          merchantData={merchantData?.data?.[0]}
          onClose={() => setPaymentLinkModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <ThemedText style={styles.detailLabel}>{label}</ThemedText>
    <ThemedText style={styles.detailValue}>{value}</ThemedText>
  </View>
);

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8
  },
  statCard: {
    width: '50%',
    padding: 8
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  statLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  detailsCard: {
    margin: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  detailsContent: {
    gap: 12
  },
  detailItem: {
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 16
  },
  transactionsCard: {
    margin: 16,
    marginTop: 0
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  exportText: {
    fontSize: 14,
    color: '#666'
  }
});

export default MerchantDashboard;