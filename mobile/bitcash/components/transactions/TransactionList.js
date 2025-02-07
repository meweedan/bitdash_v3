// components/transactions/TransactionList.js
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';

export function TransactionList({ 
  transactions = [], 
  isLoading,
  limit,
  walletId,
  merchantId 
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'deposit':
        return 'arrow-up-circle';
      case 'withdrawal':
        return 'arrow-down-circle';
      case 'payment':
        return 'card';
      default:
        return 'swap-horizontal';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'deposit':
        return '#4CAF50';
      case 'withdrawal':
        return '#F44336';
      case 'payment':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getIcon(item.attributes.type)} 
          size={24} 
          color={getColor(item.attributes.type)} 
        />
      </View>
      <View style={styles.details}>
        <ThemedText style={styles.type}>
          {item.attributes.type.charAt(0).toUpperCase() + item.attributes.type.slice(1)}
        </ThemedText>
        <ThemedText style={styles.date}>
          {new Date(item.attributes.createdAt).toLocaleDateString()}
        </ThemedText>
      </View>
      <ThemedText 
        style={[
          styles.amount,
          { color: getColor(item.attributes.type) }
        ]}
      >
        {item.attributes.type === 'deposit' ? '+' : '-'} 
        LYD {item.attributes.amount.toLocaleString()}
      </ThemedText>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ThemedText>Loading transactions...</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={limit ? transactions.slice(0, limit) : transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={styles.empty}>
          <ThemedText>No transactions found</ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    padding: 16,
    alignItems: 'center',
  },
  empty: {
    padding: 16,
    alignItems: 'center',
  },
});