import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRScannerScreen() {
  return (
    <View style={styles.container}>
      <Text>QR Scanner Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});