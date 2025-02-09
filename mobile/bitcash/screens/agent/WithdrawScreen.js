import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/useAuth';
import { useWithdraw } from '../../hooks/useWithdraw';
import QRScannerModal from '../../components/QRScannerModal';

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isQRVisible, setQRVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [customerPin, setCustomerPin] = useState('');

  const withdrawMutation = useWithdraw({
    onSuccess: () => {
      Alert.alert('Success', 'Withdrawal completed successfully');
      navigation.navigate('Dashboard');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleQRScan = (result) => {
    // Handle QR scan result
    setSelectedCustomer(result.data);
    setQRVisible(false);
  };

  const handleSubmit = () => {
    if (!selectedCustomer || !amount || !customerPin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be greater than zero');
      return;
    }

    withdrawMutation.mutate({ customerId: selectedCustomer.id, amount, customerPin });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.balanceText}>Cash Balance: 0 LYD</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Customer</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by name or phone"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.qrButton} onPress={() => setQRVisible(true)}>
          <Icon name="qr-code" size={20} color="#fff" />
          <Text style={styles.qrButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      {selectedCustomer && (
        <View style={styles.customerCard}>
          <Text style={styles.customerName}>{selectedCustomer.attributes.fullName}</Text>
          <Text style={styles.customerPhone}>{selectedCustomer.attributes.phone}</Text>
        </View>
      )}

      {selectedCustomer && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw Form</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount (LYD)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Customer PIN"
            keyboardType="numeric"
            secureTextEntry
            value={customerPin}
            onChangeText={setCustomerPin}
          />
          <Button title="Complete Withdrawal" onPress={handleSubmit} />
        </View>
      )}

      {isQRVisible && (
        <QRScannerModal
          onRead={handleQRScan}
          showMarker
          reactivate
          reactivateTimeout={5000}
          topContent={<Text style={styles.qrText}>Scan a QR Code</Text>}
          bottomContent={
            <TouchableOpacity style={styles.qrCloseButton} onPress={() => setQRVisible(false)}>
              <Text style={styles.qrCloseButtonText}>Close</Text>
            </TouchableOpacity>
          }
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  customerCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
  },
  qrText: {
    fontSize: 18,
    color: '#fff',
  },
  qrCloseButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  qrCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WithdrawScreen;