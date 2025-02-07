import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BitCashTransfer = () => {
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [recentContacts, setRecentContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch wallet balance
        const walletResponse = await fetch(`${process.env.API_URL}/wallet`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        });
        const walletData = await walletResponse.json();
        setBalance(walletData.balance);

        // Fetch recent contacts
        const contactsResponse = await fetch(`${process.env.API_URL}/contacts`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        });
        const contactsData = await contactsResponse.json();
        setRecentContacts(contactsData.slice(0, 5)); // Last 5 contacts
      } catch (error) {
        console.error('Transfer page data fetch error:', error);
        Alert.alert('Error', 'Failed to load transfer data');
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.length < 3) {
      Alert.alert('Search', 'Please enter at least 3 characters');
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/search-contacts?query=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        }
      });
      const searchResults = await response.json();
      
      if (searchResults.length === 0) {
        Alert.alert('Search', 'No contacts found');
      } else {
        // Handle search results (could open a modal or list)
        // For this example, we'll just select the first result
        setRecipient(searchResults[0]);
      }
    } catch (error) {
      console.error('Contact search error:', error);
      Alert.alert('Error', 'Failed to search contacts');
    }
  };

  const handleTransfer = async () => {
    // Validate transfer
    if (!recipient) {
      Alert.alert('Error', 'Please select a recipient');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (transferAmount > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipientId: recipient.id,
          amount: transferAmount,
          note: note
        })
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Transfer completed successfully');
        // Reset form
        setRecipient(null);
        setAmount('');
        setNote('');
        // Optionally navigate back or refresh balance
        navigation.goBack();
      } else {
        Alert.alert('Transfer Failed', result.message || 'Unable to complete transfer');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert('Error', 'Failed to process transfer');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Balance Header */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {balance.toLocaleString()} LYD
          </Text>
        </View>

        {/* Recipient Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts by name or phone"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Recent Contacts */}
        <ScrollView 
          horizontal 
          style={styles.recentContactsContainer}
          showsHorizontalScrollIndicator={false}
        >
          {recentContacts.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.contactItem}
              onPress={() => setRecipient(contact)}
            >
              <Image 
                source={{ uri: contact.avatar }} 
                style={styles.contactAvatar} 
              />
              <Text style={styles.contactName}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Recipient */}
        {recipient && (
          <View style={styles.recipientContainer}>
            <Text style={styles.sectionTitle}>Selected Recipient</Text>
            <View style={styles.selectedRecipientDetails}>
              <Image 
                source={{ uri: recipient.avatar }} 
                style={styles.selectedRecipientAvatar} 
              />
              <View>
                <Text style={styles.selectedRecipientName}>
                  {recipient.name}
                </Text>
                <Text style={styles.selectedRecipientPhone}>
                  {recipient.phone}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Transfer Form */}
        {recipient && (
          <View style={styles.transferFormContainer}>
            <Text style={styles.sectionTitle}>Transfer Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Add a note (optional)"
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity 
              style={styles.transferButton} 
              onPress={handleTransfer}
            >
              <Text style={styles.transferButtonText}>
                Send Money
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  balanceContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContactsContainer: {
    marginBottom: 16,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  contactName: {
    marginTop: 8,
    fontSize: 12,
  },
  recipientContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedRecipientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  selectedRecipientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  selectedRecipientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRecipientPhone: {
    color: 'gray',
  },
  transferFormContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  transferButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BitCashTransfer;