import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRScannerModal from '../../components/QRScannerModal';
import Icon from 'react-native-vector-icons/Feather';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useTransfer } from '../../hooks/useTransfer';

const TransferScreen = () => {
  const navigation = useNavigation();
  const [isQRVisible, setQRVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const transfer = useTransfer();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        `${process.env.API_URL}/api/customer-profiles?search=${searchQuery}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return res.json();
    },
    enabled: searchQuery.length > 2
  });

  const handleSubmit = () => {
    if (!recipient || !amount || !pin) return Alert.alert('Error', 'Please fill all fields');
    if (pin.length !== 6) return Alert.alert('Error', 'PIN must be 6 digits');
    
    transfer.mutate({ 
      recipientId: recipient.id, 
      amount: parseFloat(amount), 
      pin 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.balance}>Balance: 0 LYD</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Recipient</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by name or phone"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => setQRVisible(true)}
        >
          <Icon name="qr-code" size={20} color="white" />
          <Text style={styles.qrButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      {recipient && (
        <View style={styles.recipientCard}>
          <Text style={styles.recipientName}>{recipient.attributes.fullName}</Text>
          <Text style={styles.recipientPhone}>{recipient.attributes.phone}</Text>
        </View>
      )}

      {recipient && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Amount (LYD)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="6-digit PIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />
          <Button 
            title="Send Money" 
            onPress={handleSubmit}
            disabled={transfer.isLoading}
          />
        </View>
      )}

      {isQRVisible && (
        <QRScannerModal
          onRead={({ data }) => {
            setRecipient(JSON.parse(data));
            setQRVisible(false);
          }}
          showMarker
          reactivate
          reactivateTimeout={5000}
          bottomContent={
            <Button title="Close" onPress={() => setQRVisible(false)} />
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
  balance: {
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
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
    color: 'white',
    marginLeft: 10,
  },
  recipientCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipientPhone: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
});

export default TransferScreen;