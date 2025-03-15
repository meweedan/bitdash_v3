// src/navigation/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import theme from '../../src/theme/theme.js';

// Auth Screens
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../../screens/auth/ForgotPasswordScreen';

// Merchant Screens
import MerchantDashboard from '../../screens/merchant/MerchantDashboard';
import MerchantTransactions from '../../screens/merchant/MerchantTransactions';
import MerchantSettings from '../../screens/merchant/MerchantSettings';
import PaymentLinkGenerator from '../../screens/merchant/PaymentLinkGenerator';

// Agent Screens
import AgentDashboard from '../../screens/agent/AgentDashboard';
import AgentSettings from '../../screens/agent/AgentSettings';
import DepositScreen from '../../screens/agent/DepositScreen';
import WithdrawScreen from '../../screens/agent/WithdrawScreen';

// Client Screens
import ClientDashboard from '../../screens/client/ClientDashboard';
import DynamicPaymentScreen from '../../screens/client/DynamicPaymentScreen';
import ClientSettings from '../../screens/client/ClientSettings';
import SendMoneyScreen from '../../screens/client/SendMoneyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Merchant Tab Navigator
const MerchantTabs = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.adfaly[500],
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MerchantDashboard"
        component={MerchantDashboard}
        options={{
          tabBarLabel: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MerchantTransactions"
        component={MerchantTransactions}
        options={{
          tabBarLabel: t('transactions.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MerchantSettings"
        component={MerchantSettings}
        options={{
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Agent Tab Navigator
const AgentTabs = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.adfaly[500],
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AgentDashboard"
        component={AgentDashboard}
        options={{
          tabBarLabel: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AgentSettings"
        component={AgentSettings}
        options={{
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Client Tab Navigator
const ClientTabs = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.adfaly[500],
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ClientDashboard"
        component={ClientDashboard}
        options={{
          tabBarLabel: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientSettings"
        component={ClientSettings}
        options={{
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Stack
export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Stack */}
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}}/>
      </Stack.Group>

      {/* Merchant Stack */}
      <Stack.Group>
        <Stack.Screen name="MerchantTabs" component={MerchantTabs} />
        <Stack.Screen 
        name="MerchantSettings" 
        component={MerchantSettings}
        options={{ headerShown: false }}
        />
      </Stack.Group>

      {/* Agent Stack */}
      <Stack.Group>
        <Stack.Screen name="AgentTabs" component={AgentTabs} />
        <Stack.Screen 
        name="AgentSettings" 
        component={AgentSettings}
        options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Deposit" 
          component={DepositScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen 
          name="Withdraw" 
          component={WithdrawScreen}
          options={{ headerShown: true }}
        />
      </Stack.Group>

      {/* Client Stack */}
      <Stack.Group>
        <Stack.Screen name="ClientTabs" component={ClientTabs} />
        <Stack.Screen 
          name="SendMoney" 
          component={SendMoneyScreen}
          options={{ headerShown: true }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;