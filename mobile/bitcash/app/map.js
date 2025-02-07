import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#56bba5', '#77a2e4', '#ff7f50', '#edb26d']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Image 
          source={require('../assets/cash.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>BitCash</Text>
        <Text style={styles.subtitle}>Your Digital Payment Companion</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
            <Ionicons name="log-in" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.outlineButton]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.outlineButtonText}>Create Account</Text>
            <Ionicons name="person-add" size={24} color="#56bba5" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#56bba5',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#56bba5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  outlineButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#56bba5',
  },
  outlineButtonText: {
    color: '#56bba5',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});