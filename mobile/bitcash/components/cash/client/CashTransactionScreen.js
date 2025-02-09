// CashTransactionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { Card, CustomButton, PinInput } from './SharedComponents';
import { Camera } from 'react-native-vision-camera';

const CustomerSearchResult = ({ customer, onSelect, isSelected }) => (
  <TouchableOpacity 
    style={[
      styles.customerCard,
      isSelected && styles.selectedCustomerCard
    ]}
    onPress={() => onSelect(customer)}
  >
    <View style={styles.customerInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {customer.attributes.fullName.charAt(0)}
        </Text>
      </View>
      <View style={styles.customerDetails}>
        <Text style={styles.customerName}>{customer.attributes.fullName}</Text>
        <Text style={styles.customerPhone}>{customer.attributes.phone}</Text>
      </View>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>Selected</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const QRScannerModal = ({ isVisible, onClose, onScan }) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <SafeAreaView style={styles.qrContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={devices.back}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Icon name="x" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const CashTransactionScreen = ({ route, navigation, type = 'deposit' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [isQRVisible, setQRVisible] = useState(false);
  const [isPreloadedCustomer, setIsPreloadedCustomer] = useState(false);

  const { customerId, customerName, customerPhone } = route.params || {};

  useEffect(() => {
    if (customerId && customerName && customerPhone) {
      const prepopulatedCustomer = {
        id: customerId,
        attributes: {
          fullName: decodeURIComponent(customerName),
          phone: decodeURIComponent(customerPhone)
        }
      };
      
      setSelectedCustomer(prepopulatedCustomer);
      setSearchQuery(decodeURIComponent(customerName));
      setIsPreloadedCustomer(true);
    }
  }, [customerId, customerName, customerPhone]);

  // Fetch agent data
  const { 
    data: agentData,
    isLoading: isAgentLoading,
    refetch: refetchAgent
  } = useQuery({
    queryKey: ['agentData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch agent data');
      return response.json();
    },
    refetchInterval: 10000
  });

  // Fetch customers
  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?filters[$or][0][fullName][$contains]=${searchQuery}&filters[$or][1][phone][$contains]=${searchQuery}`
      );
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    enabled: searchQuery.length > 2 && !isPreloadedCustomer
  });

  const handleQRScan = async (result) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${result}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Invalid customer QR code');
      const data = await response.json();
      setSelectedCustomer(data.data);
      setQRVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !amount || !customerPin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than zero');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: selectedCustomer.id,
            amount: parseFloat(amount),
            customerPin
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || `${type} failed`);
      }

      await refetchAgent();
      Alert.alert(
        'Success',
        `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} completed successfully`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <CustomButton
            icon="arrow-left"
            variant="ghost"
            onPress={() => navigation.goBack()}
            title="Back"
          />
          {isAgentLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.balanceText}>
              Cash Balance: {agentData?.data?.[0]?.attributes?.cashBalance?.toLocaleString() || 0} LYD
            </Text>
          )}
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Find Customer</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or phone"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setQRVisible(true)}
            >
              <Icon name="camera" size={20} color="#4A5568" />
              <Text style={styles.qrButtonText}>Scan QR</Text>
            </TouchableOpacity>
          </View>

          {isCustomersLoading && (
            <ActivityIndicator style={styles.loader} />
          )}

          {selectedCustomer ? (
            <CustomerSearchResult
              customer={selectedCustomer}
              onSelect={() => {}}
              isSelected
            />
          ) : (
            <View style={styles.resultsList}>
              {customers?.data?.map(customer => (
                <CustomerSearchResult
                  key={customer.id}
                  customer={customer}
                  onSelect={setSelectedCustomer}
                  isSelected={false}
                />
              ))}
            </View>
          )}
        </Card>

        {selectedCustomer && (
          <Card>
            <Text style={styles.sectionTitle}>
              {type === 'deposit' ? 'Deposit' : 'Withdrawal'} Details
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (LYD)</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.pinContainer}>
              <Text style={styles.inputLabel}>Customer PIN</Text>
              <PinInput
                value={customerPin}
                onChange={setCustomerPin}
                length={6}
              />
            </View>

            <CustomButton
              title={`Complete ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
              onPress={handleSubmit}
              color={type === 'deposit' ? 'green' : 'red'}
              disabled={!amount || customerPin.length !== 6}
              size="lg"
            />
          </Card>
        )}
      </ScrollView>

      <QRScannerModal
        isVisible={isQRVisible}
        onClose={() => setQRVisible(false)}
        onScan={handleQRScan}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  qrButtonText: {
    marginLeft: 4,
    color: '#4A5568',
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  customerCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  selectedCustomerCard: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38B2AC',
    borderWidth: 1
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  customerDetails: {
    marginLeft: 12,
    flex: 1
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  customerPhone: {
    fontSize: 14,
    color: '#718096'
  },
  selectedBadge: {
    backgroundColor: '#38B2AC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4A5568'
  },
  amountInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12
  },
  qrContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20
  }
});

export default CashTransactionScreen;