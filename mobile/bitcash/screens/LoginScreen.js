// mobile/bitcash/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import FormField from '../components/FormField';
import { SharedComponents } from '../components/SharedComponents';
import { useTheme } from '@react-navigation/native';

const USER_TYPES = {
  MERCHANT: 'merchant',
  AGENT: 'agent',
  CLIENT: 'client'
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        const userType = await determineUserType(token, user.id);
        if (userType) {
          handleRedirect(userType);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await AsyncStorage.multiRemove(['token', 'user']);
    }
  };

  const checkProfileType = async (token, userId, endpoint) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) return false;
      const { data } = await response.json();
      return data?.[0] ? true : false;
    } catch (error) {
      console.error(`Profile check error for ${endpoint}:`, error);
      return false;
    }
  };

  const determineUserType = async (token, userId) => {
    try {
      // Check merchant profile
      if (await checkProfileType(token, userId, '/api/operators')) {
        return USER_TYPES.MERCHANT;
      }
      
      // Check agent profile
      if (await checkProfileType(token, userId, '/api/agents')) {
        return USER_TYPES.AGENT;
      }
      
      // Check client profile
      if (await checkProfileType(token, userId, '/api/customer-profiles')) {
        return USER_TYPES.CLIENT;
      }
      
      return null;
    } catch (error) {
      console.error('User type determination error:', error);
      return null;
    }
  };

  const handleRedirect = (userType) => {
    const routes = {
      [USER_TYPES.MERCHANT]: 'MerchantDashboard',
      [USER_TYPES.AGENT]: 'AgentDashboard',
      [USER_TYPES.CLIENT]: 'ClientDashboard'
    };

    const route = routes[userType];
    if (route) {
      navigation.reset({
        index: 0,
        routes: [{ name: route }]
      });
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!loginRes.ok) {
        const error = await loginRes.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      const loginData = await loginRes.json();
      
      // Store auth data
      await AsyncStorage.setItem('token', loginData.jwt);
      await AsyncStorage.setItem('user', JSON.stringify(loginData.user));

      // Determine user type and redirect
      const userType = await determineUserType(loginData.jwt, loginData.user.id);
      
      if (userType) {
        handleRedirect(userType);
      } else {
        throw new Error('Invalid account type');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'An unknown error occurred');
      await AsyncStorage.multiRemove(['token', 'user']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <ThemedText style={styles.title}>BitCash Login</ThemedText>

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              disabled={isLoading}
            >
              <ThemedText style={styles.link}>Create Account</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={isLoading}
            >
              <ThemedText style={styles.link}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  link: {
    color: '#2196F3',
    fontSize: 14,
  },
});

export default LoginScreen;