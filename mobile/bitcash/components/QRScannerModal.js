// components/QRScannerModal.js
import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Icon from 'react-native-vector-icons/Feather';
import ThemedText from './ThemedText';

const QRScannerModal = ({ visible, onClose, onScan }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (!isScanned) {
      setIsScanned(true);
      onScan(data);
      onClose();
      // Reset scan state after a short delay
      setTimeout(() => setIsScanned(false), 1000);
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.container}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.container}>
          <ThemedText style={styles.errorText}>No access to camera</ThemedText>
          <TouchableOpacity 
            onPress={requestPermission} 
            style={styles.permissionButton}
          >
            <ThemedText style={styles.permissionButtonText}>
              Grant Permission
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal 
      visible={visible} 
      transparent={false} 
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeIcon} 
          onPress={onClose}
        >
          <Icon name="x" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.cameraContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            type={CameraType.back}
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: ['qr'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
              <ThemedText style={styles.instructions}>
                Position the QR code within the frame to scan
              </ThemedText>
            </View>
          </Camera>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  closeIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#56bba5',
    backgroundColor: 'transparent'
  },
  instructions: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8
  },
  errorText: {
    color: 'white',
    marginBottom: 20
  },
  permissionButton: {
    backgroundColor: '#56bba5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#56bba5'
  },
  closeButtonText: {
    color: '#56bba5'
  }
});

export default QRScannerModal;