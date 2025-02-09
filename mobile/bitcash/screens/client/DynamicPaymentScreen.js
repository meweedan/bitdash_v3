// [paymentLinkId].js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Image
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CustomButton, PinInput } from '../../components/SharedComponents';

const TransactionConfirmationModal = ({
  isVisible,
  onClose,
  beforeBalance,
  afterBalance,
  amount,
  merchantName,
  isSuccess,
  transactionId
}) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Icon 
            name={isSuccess ? "check-circle" : "alert-circle"} 
            size={24} 
            color={isSuccess ? '#48BB78' : '#E53E3E'} 
          />
          <Text style={styles.modalHeaderText}>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </Text>
        </View>

        <View style={styles.modalBody}>
          <InfoRow label="Merchant" value={merchantName} />
          <InfoRow 
            label="Amount" 
            value={`${amount.toLocaleString()} LYD`} 
            valueColor="#48BB78" 
          />
          {transactionId && (
            <InfoRow label="Transaction ID" value={transactionId} />
          )}
          <View style={styles.divider} />
          <InfoRow label="Balance Before" value={`${beforeBalance.toLocaleString()} LYD`} />
          <InfoRow label="Balance After" value={`${afterBalance.toLocaleString()} LYD`} />
          <InfoRow label="Time" value={new Date().toLocaleString()} />
        </View>

        <CustomButton
          title="Close"
          onPress={onClose}
          color="blue"
        />
      </View>
    </View>
  </Modal>
);

const DynamicPaymentScreen = ({ route, navigation }) => {
  const { businessName, paymentLinkId } = route.params;
  const [showBalance, setShowBalance] = useState(false);
  const [pin, setPin] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch wallet data
  const { 
    data: walletData,
    isLoading: isWalletLoading
  } = useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    }
  });

  const handlePayment = async () => {
    if (!pin || pin.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit PIN');
      return;
    }

    setIsProcessing(true);
    try {
      // ... payment processing logic ...
      const result = await processPayment();
      setTransactionResult(result);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isWalletLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card>
          <View style={styles.merchantHeader}>
            <Image
              style={styles.merchantLogo}
              source={{ uri: merchantDetails?.logo }}
              defaultSource={require('../../assets/images/default-avatar.png')}
            />
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>{businessName}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Verified Merchant</Text>
              </View>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Payment Amount</Text>
            <Text style={styles.amount}>
              {paymentDetails?.amount?.toLocaleString()} LYD
            </Text>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceRow}>
              <Icon name="user" size={20} />
              <Text style={styles.balanceLabel}>Your Balance</Text>
            </View>
            <Text style={styles.balance}>
              {walletData?.data?.attributes?.balance?.toLocaleString()} LYD
            </Text>
          </View>

          <View style={styles.pinContainer}>
            <Text style={styles.pinLabel}>Enter PIN</Text>
            <PinInput
              value={pin}
              onChange={setPin}
              length={6}
            />
          </View>

          <CustomButton
            title="Confirm Payment"
            onPress={handlePayment}
            isLoading={isProcessing}
            disabled={pin.length !== 6}
            size="lg"
          />
        </Card>

        <TransactionConfirmationModal
          isVisible={!!transactionResult}
          onClose={() => {
            setTransactionResult(null);
            setPin('');
            navigation.navigate(transactionResult?.isSuccess ? 'PaymentSuccess' : 'Home');
          }}
          {...transactionResult}
          merchantName={businessName}
          amount={paymentDetails?.amount}
        />
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  merchantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  merchantInfo: {
    marginLeft: 12,
    flex: 1
  },
  merchantName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  badgeContainer: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  badgeText: {
    color: '#fff',
    fontSize: 12
  },
  amountContainer: {
    alignItems: 'center',
    padding: 16,
    marginVertical: 16
  },
  amountLabel: {
    fontSize: 14,
    color: '#718096'
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48BB78',
    marginTop: 4
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    marginBottom: 20
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceLabel: {
    marginLeft: 8,
    fontSize: 14
  },
  balance: {
    fontWeight: 'bold'
  },
  pinContainer: {
    marginBottom: 20
  },
  pinLabel: {
    fontSize: 14,
    marginBottom: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  modalBody: {
    marginBottom: 16
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12
  },
  button: {
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3182CE'
  },
  redButton: {
    backgroundColor: '#E53E3E'
  },
  greenButton: {
    backgroundColor: '#48BB78'
  },
  disabledButton: {
    opacity: 0.5
  },
  largeButton: {
    padding: 20
  },
  pinInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 4
  }
});

export default DynamicPaymentScreen;