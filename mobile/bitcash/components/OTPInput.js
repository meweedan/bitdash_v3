// src/components/OTPInput.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native';
import theme from './../src/theme/theme.js';

const OTPInput = ({ 
  value, 
  onChange, 
  length = 6,
  autoFocus = true 
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (text, index) => {
    const newValue = value.split('');
    newValue[index] = text;
    onChange(newValue.join(''));

    // Move to next input if there's a value
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getString();
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
      if (cleaned.length > 0) {
        onChange(cleaned);
        if (cleaned.length === length) {
          Keyboard.dismiss();
        } else {
          inputRefs.current[cleaned.length]?.focus();
        }
      }
    } catch (err) {
      console.warn('Failed to paste OTP:', err);
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(length)].map((_, index) => (
        <TextInput
          key={index}
          ref={ref => inputRefs.current[index] = ref}
          style={[
            styles.input,
            value[index] && styles.inputFilled,
            Platform.OS === 'ios' && styles.inputIOS
          ]}
          value={value[index] || ''}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onPaste={handlePaste}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          selectionColor={theme.colors.adfaly[500]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#1A202C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputFilled: {
    borderColor: theme.colors.adfaly[500],
    backgroundColor: '#F7FAFC',
  },
  inputIOS: {
    paddingVertical: 10,
  }
});

export default OTPInput;