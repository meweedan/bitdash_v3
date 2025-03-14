// src/components/merchant/PaymentLinkGenerator.js
import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Share,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText';
import FormField from '../../components/FormField';

const PaymentLinkGenerator = ({ merchantData, visible, onClose }) => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [paymentLink, setPaymentLink] = useState(null);
  const [isDarkQR, setIsDarkQR] = useState(false);
  const { colors } = useTheme();

  const frontendUrl = 'https://adfaaly.bitdash.app';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const businessName = merchantData?.attributes?.metadata?.businessName 
    ? merchantData.attributes.metadata.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    : 'merchant';

  const createPaymentLink = useMutation({
    mutationFn: async (data) => {
      // Generate unique link ID
      const linkId = `${businessName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
      
      // Calculate expiry (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);

      const response = await fetch(
        `${backendUrl}/api/payment-links`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(data.amount),
              currency: 'LYD',
              merchant: merchantData.id,
              status: 'active',
              payment_type: 'fixed',
              pin: data.pin,
              link_id: linkId,
              expiry: expiry.toISOString(),
              description: `Payment to ${merchantData.attributes.metadata.businessName}`,
              success_url: `${frontendUrl}/payments/success`,
              cancel_url: `${frontendUrl}/payments/cancel`,
              metadata: {
                businessName: merchantData.attributes.metadata.businessName,
                merchantId: merchantData.id,
                createdAt: new Date().toISOString(),
                merchantPhone: merchantData.attributes.phone,
                merchantEmail: merchantData.attributes.email,
                linkType: 'qr',
                platform: 'mobile'
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create payment link');
      }

      const responseData = await response.json();
      const fullUrl = `${frontendUrl}/${businessName}/${linkId}`;
      
      return {
        ...responseData.data,
        url: fullUrl
      };
    },
    onSuccess: (data) => {
      setPaymentLink(data);
      Alert.alert('Success', 'Payment link created successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    }
  });

  const handleGenerateLink = () => {
    if (!amount || !pin) {
      Alert.alert('Error', 'Please enter both amount and PIN');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    if (pin.length !== 6 || isNaN(pin)) {
      Alert.alert('Error', 'PIN must be 6 digits');
      return;
    }

    createPaymentLink.mutate({ amount, pin });
  };

  const handleShare = async () => {
    if (paymentLink?.url) {
      try {
        await Share.share({
          message: `Pay ${businessName} - ${paymentLink.attributes.amount} LYD\n${paymentLink.url}`
        });
      } catch (error) {
        await Clipboard.setStringAsync(paymentLink.url);
        Alert.alert('Copied', 'Payment link copied to clipboard');
      }
    }
  };

  const handleCopy = async () => {
    if (paymentLink?.url) {
      await Clipboard.setStringAsync(paymentLink.url);
      Alert.alert('Copied', 'Payment link copied to clipboard');
    }
  };

  const resetForm = () => {
    setAmount('');
    setPin('');
    setPaymentLink(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={paymentLink ? null : onClose}
      transparent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.headerText}>Generate Payment Link</ThemedText>
            {!paymentLink && (
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {!paymentLink ? (
              <View style={styles.form}>
                <FormField
                  label="Amount (LYD)"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />

                <FormField
                  label="Merchant PIN"
                  value={pin}
                  onChangeText={setPin}
                  placeholder="Enter 6-digit PIN"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={6}
                />

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={handleGenerateLink}
                  disabled={createPaymentLink.isLoading}
                >
                  {createPaymentLink.isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <ThemedText style={styles.buttonText}>Generate Payment Link</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={paymentLink.url}
                    size={250}
                    backgroundColor={isDarkQR ? '#000000' : '#FFFFFF'}
                    color={isDarkQR ? '#FFFFFF' : '#000000'}
                  />
                </View>

                <ThemedText style={styles.amount}>
                  {parseFloat(paymentLink.attributes.amount).toLocaleString()} LYD
                </ThemedText>

                <ThemedText style={styles.url} numberOfLines={2}>
                  {paymentLink.url}
                </ThemedText>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setIsDarkQR(!isDarkQR)}
                  >
                    <Icon name={isDarkQR ? 'sun' : 'moon'} size={24} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleCopy}
                  >
                    <Icon name="copy" size={24} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.shareButton, { backgroundColor: colors.primary }]}
                    onPress={handleShare}
                  >
                    <Icon name="share-2" size={20} color="white" />
                    <ThemedText style={styles.shareButtonText}>Share</ThemedText>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.newLinkButton}
                  onPress={resetForm}
                >
                  <ThemedText style={styles.newLinkText}>Generate New Link</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '90%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
  },
  form: {
    gap: 16
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  qrContainer: {
    alignItems: 'center',
    gap: 20
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  url: {
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  newLinkButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  newLinkText: {
    color: '#666',
    fontWeight: '600'
  }
});

export default PaymentLinkGenerator;