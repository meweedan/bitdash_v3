// components/cash/agent/TransactionForm.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FormField from '../../FormField';
import { OTPInput } from '../../OTPInput';
import { Button } from '../../SharedComponents';
import theme from '../../../theme/theme';

export const TransactionForm = ({ 
  amount,
  setAmount,
  customerPin,
  setCustomerPin,
  onSubmit,
  isLoading,
  type = 'deposit' // or 'withdraw'
}) => (
  <View style={styles.form}>
    <FormField
      label="Amount (LYD)"
      value={amount}
      onChangeText={setAmount}
      placeholder="0.00"
      keyboardType="numeric"
      required
    />

    <View style={styles.pinContainer}>
      <ThemedText style={styles.pinLabel}>Customer PIN</ThemedText>
      <OTPInput
        value={customerPin}
        onChange={setCustomerPin}
        length={6}
      />
    </View>

    <View style={styles.divider} />

    <Button
      title={`Complete ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
      onPress={onSubmit}
      isLoading={isLoading}
      disabled={!amount || customerPin.length !== 6}
      style={[
        styles.submitButton,
        { backgroundColor: type === 'deposit' ? theme.colors.success : theme.colors.error }
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  customerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 2
      }
    })
  },
  selectedCard: {
    backgroundColor: '#F0FFF4'
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  customerDetails: {
    marginLeft: 12
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  customerPhone: {
    fontSize: 14,
    color: '#666'
  },
  badge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  form: {
    gap: 20
  },
  pinContainer: {
    gap: 8
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16
  },
  submitButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  }
});