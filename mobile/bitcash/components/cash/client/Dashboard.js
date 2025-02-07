import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import {
  Avatar,
  Button,
  Divider,
  HStack,
  VStack,
  Badge,
  IconButton,
  Progress,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import { QRCodeCanvas } from 'qrcode.react';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';
import SpendingChart from '@/components/charts/SpendingChart'; // Import your chart components
import SpendingCategoryChart from '@/components/charts/SpendingCategoryChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionSummary from '@/components/transactions/TransactionSummary';
import AgentLocator from '@/components/cash/customer/AgentLocator';


const ClientDashboard = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const {
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['walletBalance', 'customer', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?` +
          `populate[customer][populate][avatar][fields][0]=url` +
          `&populate=*` +
          `&filters[customer][users_permissions_user][id][<span class="math-inline">eq\]\=</span>{user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Make sure you have token storage
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    refetchInterval: 10000,
    enabled: !!user?.id,
    retry: 2,
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error fetching wallet',
        text2: error.message,
      });
    },
  });

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions', walletData?.data?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` +
          `filters[sender][id][<span class="math-inline">eq\]\=</span>{walletData.data[0].id}` +
          `&filters[status][$eq]=completed` +
          `&sort[0]=createdAt:desc` +
          `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!walletData?.data?.[0]?.id && walletData?.data?.[0]?.id !== undefined,
    refetchInterval: 10000,
  });

  const transactionStats = useMemo(() => {
    // ... (same calculation logic as before)
  }, [transactionsData]);

  const dailyLimitUsage = useMemo(() => {
    // ... (same calculation logic as before)
  }, [walletData, transactionStats]);

  if (isWalletLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (walletError || !walletData?.data?.[0]) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {walletError?.message || 'Failed to load wallet data'}
        </Text>
      </View>
    );
  }

  const wallet = walletData.data[0].attributes;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gradientBackground} />
      <View style={styles.header}>
        <HStack space={3} alignItems="center">
          <Avatar
            size="2xl"
            source={
              user?.customer_profile?.avatar?.data?.attributes?.url
                ? {
                    uri: `<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_BACKEND\_URL\}</span>{user.customer_profile.avatar.data.attributes.url}`,
                  }
                : null
            }
            bg="blue.500"
            color="white"
          >
           {user?.customer_profile?.fullName
              ? user.customer_profile.fullName[0]
              : user?.username
              ? user.username[0]
              : 'U'}
          </Avatar>
          <VStack space={0}>
            <Text style={styles.heading}>
              {user?.customer_profile?.fullName || user?.username || 'User'}
            </Text>
            <Text style={styles.emailText}>{user?.email || 'No email'}</Text>
          </VStack>
        </HStack>
        <HStack space={3}>
          <IconButton
            icon={<Icon name="arrow-left-circle" size={24} color="black" />}
            onPress={() => navigation.navigate('Transfer')}
            variant="ghost"
            size="lg"
          />
          <IconButton
            icon={<Icon name="credit-card" size={24} color="black" />}
            onPress={() => setIsQROpen(true)}
            variant="ghost"
            size="lg"
          />
          <IconButton
            icon={<Icon name="more-vertical" size={24} color="black" />}
            onPress={() => setIsMenuModalOpen(true)}
            variant="ghost"
            size="lg"
          />
        </HStack>
      </View>

      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        size="xs"
      >
        <Modal.Content>
          <Modal.Header>Quick Actions</Modal.Header>
          <Modal.CloseButton />
          <Modal.Body pb={6}>
            <VStack space={4} w="full">
              <Button
                leftIcon={<Icon name="user" size={16} color="black" />}
                onPress={() => {
                  setIsMenuModalOpen(false);
                  navigation.navigate('Profile'); // Navigate to Profile screen
                }}
                w="full"
                justifyContent="flex-start"
              >
                Profile Settings
              </Button>
              <Button
                leftIcon={<Icon name="link" size={16} color="black" />}
                onPress={() => {
                  setIsMenuModalOpen(false);
                  navigation.navigate('PaymentLinks'); // Navigate to PaymentLinks screen
                }}
                w="full"
                justifyContent="flex-start"
              >
                Payment Links
              </Button>
              <Button
                leftIcon={<Icon name="users" size={16} color="black" />}
                onPress={() => {
                  setIsMenuModalOpen(false);
                  navigation.navigate('Contacts'); // Navigate to Contacts screen
                }}
                w="full"
                justifyContent="flex-start"
              >
                Contacts
              </Button>
              <Button
                leftIcon={<Icon name="share-2" size={16} color="black" />}
                onPress={() => {
                  setIsMenuModalOpen(false);
                  Toast.show({
                    type: 'info',
                    text1: 'Share Wallet',
                    text2: 'Wallet sharing functionality coming soon',
                  });
                }}
                w="full"
                justifyContent="flex-start"
              >
                Share Wallet
              </Button>
              <Button
                leftIcon={<Icon name="log-out" size={16} color="black" />}
                onPress={() => {
                  setIsMenu