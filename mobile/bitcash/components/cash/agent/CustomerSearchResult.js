// components/Adfaly/agent/CustomerSearchResult.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedText from '../../ThemedText';
import { Avatar } from '../../SharedComponents';

export const CustomerSearchResult = ({ customer, onSelect, isSelected }) => (
  <TouchableOpacity 
    style={[styles.customerCard, isSelected && styles.selectedCard]} 
    onPress={() => onSelect(customer)}
  >
    <View style={styles.customerInfo}>
      <Avatar 
        size={40} 
        name={customer.attributes.fullName}
      />
      <View style={styles.customerDetails}>
        <ThemedText style={styles.customerName}>
          {customer.attributes.fullName}
        </ThemedText>
        <ThemedText style={styles.customerPhone}>
          {customer.attributes.phone}
        </ThemedText>
      </View>
    </View>
    {isSelected && (
      <View style={styles.badge}>
        <ThemedText style={styles.badgeText}>Selected</ThemedText>
      </View>
    )}
  </TouchableOpacity>
);
