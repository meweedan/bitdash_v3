// components/modals/WalletQRModal.js
import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export function WalletQRModal({ visible, onClose, walletData, profileId }) {
  const qrData = JSON.stringify({
    profileId,
    walletId: walletData?.walletId,
    type: 'customer'
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <ThemedText style={styles.title}>Your Wallet QR Code</ThemedText>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          </View>

          <ThemedText style={styles.walletId}>
            Wallet ID: {walletData?.walletId}
          </ThemedText>
          
          <ThemedText style={styles.info}>
            Show this code to agents for deposits and withdrawals
          </ThemedText>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  walletId: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  info: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});