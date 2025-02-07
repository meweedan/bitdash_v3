// components/cash/agent/DailyLimitTracker.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../../ThemedText';

export function DailyLimitTracker({ limit, used }) {
  const percentage = (used / limit) * 100;
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Daily Limit</ThemedText>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${Math.min(percentage, 100)}%` }
          ]} 
        />
      </View>
      <View style={styles.stats}>
        <ThemedText style={styles.amount}>
          {used.toLocaleString()} / {limit.toLocaleString()} LYD
        </ThemedText>
        <ThemedText style={styles.percentage}>
          {percentage.toFixed(1)}%
        </ThemedText>
      </View>
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
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amount: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 14,
    opacity: 0.7,
  },
});