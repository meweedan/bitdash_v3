// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);
    
    if (token && user) {
      // Redirect to appropriate dashboard if needed
      const userData = JSON.parse(user);
      setUserType(userData.type);
    }
  };

  const renderAuthButtons = () => (
    <View style={styles.authButtons}>
      <TouchableOpacity 
        style={[styles.button, styles.loginButton]}
        onPress={() => router.push('./(auth)/register')}
      >
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.registerButton]}
        onPress={() => router.push('/(auth)/register')}
      >
        <ThemedText style={styles.buttonText}>Register</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderDashboard = () => (
    <View style={styles.dashboard}>
      <ThemedText style={styles.welcomeText}>
        Welcome back to BitCash!
      </ThemedText>
      
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Send Money</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Request Payment</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Scan QR</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ParallaxScrollView
      headerHeight={200}
      renderHeader={() => (
        <View style={styles.header}>
          <Image 
            source={require('@/assets/tazdani.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.headerTitle}>BitCash</ThemedText>
        </View>
      )}
    >
      <ThemedView style={styles.container}>
        {isAuthenticated ? renderDashboard() : renderAuthButtons()}
        
        <View style={styles.features}>
          <ThemedText style={styles.featuresTitle}>
            Why Choose BitCash?
          </ThemedText>
          
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureTitle}>Fast & Secure</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Instant transactions with bank-grade security
            </ThemedText>
          </View>
          
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureTitle}>Low Fees</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Competitive rates for all transactions
            </ThemedText>
          </View>
          
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureTitle}>Wide Network</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Growing network of merchants and agents
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  authButtons: {
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboard: {
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '30%',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  features: {
    marginTop: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    opacity: 0.8,
  },
});