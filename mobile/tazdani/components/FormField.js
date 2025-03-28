// components/FormField.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

export function FormField({ 
  label, 
  icon, 
  error, 
  style, 
  ...props 
}) {
  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color="#666" 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#666"
          {...props}
        />
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#f44336',
  },
  icon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#fff',
    paddingHorizontal: 12,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
});