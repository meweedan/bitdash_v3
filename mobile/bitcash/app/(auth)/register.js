// app/(auth)/register.js
import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useToast } from '@/hooks/useToast';
import ApiService from '@/services/api';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const ROLES = {
 MERCHANT: 8,
 AGENT: 7,
 CLIENT: 4
};

export default function RegisterScreen() {
 const toast = useToast();
 const [loading, setLoading] = useState(false);
 const [progress, setProgress] = useState(0);
 const [userType, setUserType] = useState('client');
 const [showPassword, setShowPassword] = useState(false);
 const {show, Toast} = useToast();

 const [formData, setFormData] = useState({
   // Common fields
   email: '',
   password: '',
   confirmPassword: '',
   fullName: '',
   phone: '',
   status: 'pending',

   // Merchant fields
   businessName: '',
   businessLicense: '',
   taxId: '',
   registrationNumber: '',
   address: '',
   monthlyVolume: 0,

   // Bank Details
   bankDetails: {
     bankName: '',
     accountNumber: '',
     swiftCode: ''
   },

   // Agent fields
   location: {
     address: '',
     coordinates: { lat: 0, lng: 0 },
     type: 'Point'
   },
   operatingHours: {
     open: '09:00',
     close: '17:00'
   },
   dailyTransactionLimit: 10000,
   supportedCurrencies: ['LYD'],
   ratingScore: 0,
   
   // Client fields
   wallet_pin: '',
   allergies: '',
   dietary_preferences: ''
 });

 const handleChange = (field, value) => {
   if (field.includes('.')) {
     const [parent, child] = field.split('.');
     setFormData(prev => ({
       ...prev,
       [parent]: {
         ...prev[parent],
         [child]: value
       }
     }));
   } else {
     setFormData(prev => ({
       ...prev,
       [field]: value
     }));
   }
 };

 const validateForm = () => {
   if (!formData.email || !formData.email.includes('@')) {
     show('Invalid email address');
     return false;
   }

   if (formData.password.length < 8) {
     show('Password must be at least 8 characters');
     return false;
   }

   if (formData.password !== formData.confirmPassword) {
     show('Passwords do not match');
     return false;
   }

   const requiredCommonFields = ['fullName', 'phone'];
   for (const field of requiredCommonFields) {
     if (!formData[field]) {
       show(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
       return false;
     }
   }

   if (userType === 'merchant') {
     const requiredFields = ['businessName', 'businessLicense', 'taxId', 'bankDetails.bankName', 'bankDetails.accountNumber'];
     for (const field of requiredFields) {
       const value = field.includes('.') 
         ? field.split('.').reduce((obj, key) => obj?.[key], formData)
         : formData[field];
         
       if (!value) {
         show(`${field.split('.').pop().replace(/([A-Z])/g, ' $1').trim()} is required`);
         return false;
       }
     }
   }

   if (userType === 'agent') {
     const requiredFields = ['location.address', 'bankDetails.bankName', 'bankDetails.accountNumber'];
     for (const field of requiredFields) {
       const value = field.includes('.') 
         ? field.split('.').reduce((obj, key) => obj?.[key], formData)
         : formData[field];
         
       if (!value) {
         show(`${field.split('.').pop().replace(/([A-Z])/g, ' $1').trim()} is required`);
         return false;
       }
     }
   }

   if (userType === 'client' && (!formData.wallet_pin || formData.wallet_pin.length !== 6)) {
     show('6-digit wallet PIN is required');
     return false;
   }

   return true;
 };

 const handleRegister = async () => {
   if (!validateForm()) return;

   setLoading(true);
   try {
     // 1. Create user
     setProgress(20);
     const registerRes = await fetch(`${BASE_URL}/api/auth/local/register`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         username: formData.email.split('@')[0],
         email: formData.email,
         password: formData.password,
         role: ROLES[userType.toUpperCase()]
       })
     });

     if (!registerRes.ok) {
       const error = await registerRes.json();
       throw new Error(error.error?.message || 'Registration failed');
     }

     const userData = await ApiService.register(formData, userType);
     const { jwt, user } = userData;

     // 2. Create profile based on user type
     setProgress(40);
     let profileData = {
       data: {
         fullName: formData.fullName,
         phone: formData.phone,
         status: formData.status,
         users_permissions_user: user.id
       }
     };

     if (userType === 'merchant') {
       profileData.data = {
         ...profileData.data,
         businessName: formData.businessName,
         businessLicense: formData.businessLicense,
         taxId: formData.taxId,
         registrationNumber: formData.registrationNumber,
         address: formData.address,
         monthlyVolume: formData.monthlyVolume,
         bankDetails: formData.bankDetails
       };
     } else if (userType === 'agent') {
       profileData.data = {
         ...profileData.data,
         location: formData.location,
         operatingHours: formData.operatingHours,
         dailyTransactionLimit: formData.dailyTransactionLimit,
         supportedCurrencies: formData.supportedCurrencies,
         ratingScore: formData.ratingScore,
         bankDetails: formData.bankDetails
       };
     } else {
       profileData.data = {
         ...profileData.data,
         wallet_pin: parseInt(formData.wallet_pin),
         allergies: formData.allergies ? formData.allergies.split(',').map(i => i.trim()) : [],
         dietary_preferences: formData.dietary_preferences ? formData.dietary_preferences.split(',').map(i => i.trim()) : []
       };
     }

     setProgress(60);
     const profileEndpoint = userType === 'merchant' 
       ? '/api/merchants'
       : userType === 'agent'
         ? '/api/agents'
         : '/api/customer-profiles';

     const profileRes = await fetch(`${BASE_URL}${profileEndpoint}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${jwt}`
       },
       body: JSON.stringify(profileData)
     });

     if (!profileRes.ok) {
       throw new Error('Failed to create profile');
     }

     const profile = await profileRes.json();

     // 3. Create wallet
     setProgress(80);
     const walletData = {
       data: {
         balance: 0,
         currency: 'LYD',
         isActive: true,
         walletId: `W${Date.now()}`,
         dailyLimit: userType === 'merchant' ? 50000 : userType === 'agent' ? 100000 : 5000,
         monthlyLimit: userType === 'merchant' ? 1000000 : userType === 'agent' ? 2000000 : 100000,
         lastActivity: new Date().toISOString(),
         [userType]: profile.data.id
       }
     };

     const walletRes = await fetch(`${BASE_URL}/api/wallets`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${jwt}`
       },
       body: JSON.stringify(walletData)
     });

     if (!walletRes.ok) {
       throw new Error('Failed to create wallet');
     }

     setProgress(100);
     show('Registration successful!', 'success');
     
     // Store auth data temporarily
     await AsyncStorage.setItem('token', jwt);
     await AsyncStorage.setItem('user', JSON.stringify({
       ...user,
       profile: profile.data
     }));

     // Redirect to login
     router.replace('/(auth)/login');

   } catch (error) {
     console.error('Registration error:', error);
     show(error.message || 'Registration failed', 'error');
   } finally {
     setLoading(false);
     setProgress(0);
   }
 };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>Join BitCash Today</ThemedText>
        </View>

        {/* User Type Selection */}
        <View style={styles.accountTypes}>
          <TouchableOpacity 
            style={[styles.typeButton, userType === 'client' && styles.selectedType]}
            onPress={() => setUserType('client')}
          >
            <Ionicons 
              name="person" 
              size={24} 
              color={userType === 'client' ? '#fff' : '#4CAF50'} 
            />
            <ThemedText style={[
              styles.typeText,
              userType === 'client' && styles.selectedTypeText
            ]}>Client</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeButton, userType === 'merchant' && styles.selectedType]}
            onPress={() => setUserType('merchant')}
          >
            <Ionicons 
              name="business" 
              size={24} 
              color={userType === 'merchant' ? '#fff' : '#4CAF50'} 
            />
            <ThemedText style={[
              styles.typeText,
              userType === 'merchant' && styles.selectedTypeText
            ]}>Merchant</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeButton, userType === 'agent' && styles.selectedType]}
            onPress={() => setUserType('agent')}
          >
            <Ionicons 
              name="people" 
              size={24} 
              color={userType === 'agent' ? '#fff' : '#4CAF50'} 
            />
            <ThemedText style={[
              styles.typeText,
              userType === 'agent' && styles.selectedTypeText
            ]}>Agent</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Common Fields */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Details</ThemedText>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#666"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>

        {/* Merchant Fields */}
        {userType === 'merchant' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Business Details</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                placeholderTextColor="#666"
                value={formData.businessName}
                onChangeText={(value) => handleChange('businessName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Business License"
                placeholderTextColor="#666"
                value={formData.businessLicense}
                onChangeText={(value) => handleChange('businessLicense', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Tax ID"
                placeholderTextColor="#666"
                value={formData.taxId}
                onChangeText={(value) => handleChange('taxId', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Business Address"
                placeholderTextColor="#666"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
              />
            </View>

            {/* Bank Details Section */}
            <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>Bank Details</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                placeholderTextColor="#666"
                value={formData.bankDetails.bankName}
                onChangeText={(value) => handleChange('bankDetails.bankName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Account Number"
                placeholderTextColor="#666"
                value={formData.bankDetails.accountNumber}
                onChangeText={(value) => handleChange('bankDetails.accountNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="SWIFT Code"
                placeholderTextColor="#666"
                value={formData.bankDetails.swiftCode}
                onChangeText={(value) => handleChange('bankDetails.swiftCode', value)}
              />
            </View>
          </View>
        )}

        {/* Agent Fields */}
        {userType === 'agent' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Agent Details</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Operating Address"
                placeholderTextColor="#666"
                value={formData.location.address}
                onChangeText={(value) => handleChange('location.address', value)}
              />
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <ThemedText style={styles.timeLabel}>Opening Time</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor="#666"
                  value={formData.operatingHours.open}
                  onChangeText={(value) => handleChange('operatingHours.open', value)}
                />
              </View>

              <View style={styles.timeInput}>
                <ThemedText style={styles.timeLabel}>Closing Time</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="17:00"
                  placeholderTextColor="#666"
                  value={formData.operatingHours.close}
                  onChangeText={(value) => handleChange('operatingHours.close', value)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Daily Transaction Limit"
                placeholderTextColor="#666"
                value={formData.dailyTransactionLimit.toString()}
                onChangeText={(value) => handleChange('dailyTransactionLimit', parseFloat(value) || 0)}
                keyboardType="numeric"
              />
            </View>

            {/* Bank Details Section */}
            <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>Bank Details</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                placeholderTextColor="#666"
                value={formData.bankDetails.bankName}
                onChangeText={(value) => handleChange('bankDetails.bankName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Account Number"
                placeholderTextColor="#666"
                value={formData.bankDetails.accountNumber}
                onChangeText={(value) => handleChange('bankDetails.accountNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="SWIFT Code"
                placeholderTextColor="#666"
                value={formData.bankDetails.swiftCode}
                onChangeText={(value) => handleChange('bankDetails.swiftCode', value)}
              />
            </View>
          </View>
        )}

        {/* Client Fields */}
        {userType === 'client' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Wallet Security</ThemedText>
            
            <View style={styles.pinContainer}>
              <ThemedText style={styles.pinLabel}>6-Digit Wallet PIN</ThemedText>
              <View style={styles.pinInputRow}>
                {[...Array(6)].map((_, index) => (
                  <TextInput
                    key={index}
                    style={styles.pinInput}
                    maxLength={1}
                    keyboardType="numeric"
                    secureTextEntry
                    value={formData.wallet_pin[index] || ''}
                    onChangeText={(value) => {
                      const newPin = formData.wallet_pin.split('');
                      newPin[index] = value;
                      handleChange('wallet_pin', newPin.join(''));

                      // Auto-advance to next input
                      if (value && index < 5) {
                        const nextInput = index + 1;
                        // Find and focus next input
                      }
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Allergies (optional, comma-separated)"
                placeholderTextColor="#666"
                value={formData.allergies}
                onChangeText={(value) => handleChange('allergies', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Dietary Preferences (optional)"
                placeholderTextColor="#666"
                value={formData.dietary_preferences}
                onChangeText={(value) => handleChange('dietary_preferences', value)}
              />
            </View>
          </View>
        )}

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}

        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?
          </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <ThemedText style={styles.footerLink}>Login</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  accountTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedType: {
    backgroundColor: '#4CAF50',
  },
  typeText: {
    marginTop: 4,
    fontSize: 12,
    color: '#4CAF50',
  },
  selectedTypeText: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    color: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pinContainer: {
    marginBottom: 20,
  },
  pinLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pinInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pinInput: {
    width: 40,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginVertical: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footerLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});