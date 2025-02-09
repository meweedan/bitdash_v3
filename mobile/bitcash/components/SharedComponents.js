// SharedComponents.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const CustomButton = ({ 
  onPress, 
  title, 
  variant = 'solid', 
  color = 'blue',
  isLoading,
  disabled,
  icon,
  size = 'normal'
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'ghost' && styles.ghostButton,
    color === 'red' && styles.redButton,
    color === 'green' && styles.greenButton,
    disabled && styles.disabledButton,
    size === 'lg' && styles.largeButton
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Icon name={icon} size={20} color="#fff" style={styles.buttonIcon} />}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const PinInput = ({ value, onChange, length = 6 }) => {
  const inputRefs = Array(length).fill(0).map(() => React.createRef());

  return (
    <View style={styles.pinContainer}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={styles.pinInput}
          maxLength={1}
          keyboardType="numeric"
          secureTextEntry
          value={value[index] || ''}
          onChangeText={(text) => {
            const newValue = value.split('');
            newValue[index] = text;
            onChange(newValue.join(''));
            if (text && index < length - 1) {
              inputRefs[index + 1].current.focus();
            }
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
              inputRefs[index - 1].current.focus();
            }
          }}
        />
      ))}
    </View>
  );
};