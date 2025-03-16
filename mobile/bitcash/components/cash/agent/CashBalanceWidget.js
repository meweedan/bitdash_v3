// components/tazdani/agent/CashBalanceWidget.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../../ThemedText';

export function CashBalanceWidget({ balance }) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Cash Balance</ThemedText>
      <ThemedText style={styles.amount}>LYD {balance.toLocaleString()}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});