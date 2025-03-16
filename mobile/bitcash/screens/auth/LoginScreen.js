// app/(auth)/login.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useToast } from '../../hooks/useToast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginScreen() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const { show, Toast } = useToast();

 const determineUserType = async (token, userId) => {
   // Check merchant profile
   const merchantRes = await fetch(
     `${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
     { headers: { Authorization: `Bearer ${token}` } }
   );
   if (merchantRes.ok) {
     const { data } = await merchantRes.json();
     if (data?.[0]) return 'merchant';
   }

   // Check agent profile
   const agentRes = await fetch(
     `${BASE_URL}/api/agents?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
     { headers: { Authorization: `Bearer ${token}` } }
   );
   if (agentRes.ok) {
     const { data } = await agentRes.json();
     if (data?.[0]) return 'agent';
   }

   // Check client profile
   const clientRes = await fetch(
     `${BASE_URL}/api/customer-profiles?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
     { headers: { Authorization: `Bearer ${token}` } }
   );
   if (clientRes.ok) {
     const { data } = await clientRes.json();
     if (data?.[0]) return 'client';
   }

   return null;
 };

 const handleRedirect = (userType) => {
   switch (userType) {
     case 'merchant':
       router.replace('./screens/(merchant)/dashboard');
       break;
     case 'agent':
       router.replace('./(tabs)/agent/dashboard');
       break;
     case 'client':
       router.replace('./(tabs)/client/dashboard');
       break;
     default:
       show('Invalid account type');
   }
 };

 const handleLogin = async () => {
   if (!email || !password) {
     show('Please enter email and password');
     return;
   }

   setIsLoading(true);

   try {
     const loginRes = await fetch(`${BASE_URL}/api/auth/local`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ identifier: email, password }),
     });

     if (!loginRes.ok) {
       throw new Error('Login failed');
     }

     const loginData = await loginRes.json();
     await AsyncStorage.setItem('token', loginData.jwt);
     await AsyncStorage.setItem('user', JSON.stringify(loginData.user));

     const userType = await determineUserType(loginData.jwt, loginData.user.id);
     if (userType) {
       handleRedirect(userType);
       show('Login successful!');
     } else {
       throw new Error('Invalid account type');
     }
   } catch (error) {
     console.error('Login error:', error);
     await AsyncStorage.removeItem('token');
     await AsyncStorage.removeItem('user');
     show(error.message || 'Login failed', 'error');
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <ThemedView style={styles.container}>
     <View style={styles.loginForm}>
       <ThemedText style={styles.title}>tazdani</ThemedText>
       
       <TextInput
         style={styles.input}
         placeholder="Email"
         placeholderTextColor="#666"
         value={email}
         onChangeText={setEmail}
         autoCapitalize="none"
         keyboardType="email-address"
         editable={!isLoading}
       />

       <TextInput
         style={styles.input}
         placeholder="Password"
         placeholderTextColor="#666"
         value={password}
         onChangeText={setPassword}
         secureTextEntry
         editable={!isLoading}
       />

       <TouchableOpacity 
         style={[styles.loginButton, isLoading && styles.disabledButton]}
         onPress={handleLogin}
         disabled={isLoading}
       >
         {isLoading ? (
           <ActivityIndicator color="#fff" />
         ) : (
           <ThemedText style={styles.buttonText}>Login</ThemedText>
         )}
       </TouchableOpacity>

       <View style={styles.links}>
         <TouchableOpacity onPress={() => router.push('./register')}>
           <ThemedText style={styles.link}>Create Account</ThemedText>
         </TouchableOpacity>
         
         <TouchableOpacity onPress={() => router.push('./forgot-password')}>
           <ThemedText style={styles.link}>Forgot Password?</ThemedText>
         </TouchableOpacity>
       </View>
     </View>
     <Toast/>
   </ThemedView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   padding: 20,
 },
 loginForm: {
   width: '100%',
   maxWidth: 400,
   alignSelf: 'center',
 },
 title: {
   fontSize: 32,
   fontWeight: 'bold',
   marginBottom: 30,
   textAlign: 'center',
 },
 input: {
   backgroundColor: 'rgba(255, 255, 255, 0.05)',
   borderWidth: 1,
   borderColor: 'rgba(255, 255, 255, 0.2)',
   borderRadius: 8,
   padding: 15,
   marginBottom: 15,
   color: '#fff',
 },
 loginButton: {
   backgroundColor: '#4CAF50',
   padding: 15,
   borderRadius: 8,
   alignItems: 'center',
   marginTop: 10,
 },
 disabledButton: {
   backgroundColor: '#666',
 },
 buttonText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
 links: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginTop: 20,
 },
 link: {
   color: '#4CAF50',
   textDecorationLine: 'underline',
 },
});