// screens/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useMutation } from '@tanstack/react-query';
import ThemedText from '../../components/ThemedText';
import FormField from '../../components/FormField';
import theme from '../../src/theme/theme.js';
import OTPInput from '../../components/OTPInput';

const STEPS = {
  INITIAL: 'INITIAL',
  OTP: 'OTP',
  NEW_PASSWORD: 'NEW_PASSWORD'
};

const ForgotPasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(STEPS.INITIAL);
  const [identifier, setIdentifier] = useState('');
  const [isEmail, setIsEmail] = useState(true);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Request OTP mutation
  const requestOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier: identifier,
            type: isEmail ? 'email' : 'phone'
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(STEPS.OTP);
      Alert.alert(
        t('auth.otpSent'),
        isEmail 
          ? t('auth.otpSentEmail', { email: identifier })
          : t('auth.otpSentPhone', { phone: identifier })
      );
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    }
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier,
            otp
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid OTP');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(STEPS.NEW_PASSWORD);
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier,
            otp,
            newPassword
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
      
      return response.json();
    },
    onSuccess: () => {
      Alert.alert(
        t('auth.passwordResetSuccess'),
        t('auth.passwordResetSuccessMessage'),
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    }
  });

  const handleRequestOTP = () => {
    if (!identifier) {
      Alert.alert(t('common.error'), t('auth.enterIdentifier'));
      return;
    }
    requestOtpMutation.mutate();
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      Alert.alert(t('common.error'), t('auth.invalidOTP'));
      return;
    }
    verifyOtpMutation.mutate();
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.enterPasswords'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsDoNotMatch'));
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'));
      return;
    }
    resetPasswordMutation.mutate();
  };

  const renderIdentifierStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isEmail && styles.toggleButtonActive]}
          onPress={() => setIsEmail(true)}
        >
          <Icon name="mail" size={20} color={isEmail ? theme.colors.adfaly[500] : '#666'} />
          <ThemedText style={[styles.toggleText, isEmail && styles.toggleTextActive]}>
            {t('auth.email')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isEmail && styles.toggleButtonActive]}
          onPress={() => setIsEmail(false)}
        >
          <Icon name="phone" size={20} color={!isEmail ? theme.colors.adfaly[500] : '#666'} />
          <ThemedText style={[styles.toggleText, !isEmail && styles.toggleTextActive]}>
            {t('auth.phone')}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FormField
        label={isEmail ? t('auth.email') : t('auth.phone')}
        value={identifier}
        onChangeText={setIdentifier}
        placeholder={isEmail ? 'example@email.com' : '+218XXXXXXXXX'}
        keyboardType={isEmail ? 'email-address' : 'phone-pad'}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRequestOTP}
        disabled={requestOtpMutation.isLoading}
      >
        {requestOtpMutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>{t('auth.sendOTP')}</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.formContainer}>
      <ThemedText style={styles.otpHeader}>{t('auth.enterOTP')}</ThemedText>
      <ThemedText style={styles.otpSubheader}>
        {t('auth.otpSentTo', { identifier })}
      </ThemedText>

      <OTPInput
        value={otp}
        onChange={setOtp}
        length={6}
        autoFocus
        />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={verifyOtpMutation.isLoading}
      >
        {verifyOtpMutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>{t('auth.verifyOTP')}</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleRequestOTP}
        disabled={requestOtpMutation.isLoading}
      >
        <ThemedText style={styles.resendText}>{t('auth.resendOTP')}</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordStep = () => (
    <View style={styles.formContainer}>
      <FormField
        label={t('auth.newPassword')}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder={t('auth.enterNewPassword')}
      />

      <FormField
        label={t('auth.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder={t('auth.enterConfirmPassword')}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={resetPasswordMutation.isLoading}
      >
        {resetPasswordMutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>{t('auth.resetPassword')}</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (currentStep === STEPS.INITIAL) {
                navigation.goBack();
              } else if (currentStep === STEPS.OTP) {
                setCurrentStep(STEPS.INITIAL);
              } else {
                setCurrentStep(STEPS.OTP);
              }
            }}
          >
            <Icon name="arrow-left" size={24} color="#666" />
          </TouchableOpacity>

          <ThemedText style={styles.title}>{t('auth.forgotPassword')}</ThemedText>

          {currentStep === STEPS.INITIAL && renderIdentifierStep()}
          {currentStep === STEPS.OTP && renderOTPStep()}
          {currentStep === STEPS.NEW_PASSWORD && renderNewPasswordStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20
  },
  backButton: {
    padding: 8,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30
  },
  formContainer: {
    width: '100%'
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12
  },
  toggleButtonActive: {
    backgroundColor: '#F7FAFC'
  },
  toggleText: {
    marginLeft: 8,
    color: '#666'
  },
  toggleTextActive: {
    color: theme.colors.adfaly[500]
  },
  button: {
    backgroundColor: theme.colors.adfaly[500],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  otpHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  otpSubheader: {
    color: '#666',
    marginBottom: 24
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 16
  },
  resendText: {
    color: theme.colors.adfaly[500],
    fontSize: 14
  }
});

export default ForgotPasswordScreen;