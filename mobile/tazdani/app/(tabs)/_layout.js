import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const { userType } = useAuth();

  return (
    <Tabs 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'transactions':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'qr-code':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Dashboard' }}
      />
      <Tabs.Screen 
        name="transactions" 
        options={{ title: 'Transactions' }}
      />
      <Tabs.Screen 
        name="qr-code" 
        options={{ title: 'QR Code' }}
      />
      <Tabs.Screen 
        name="settings" 
        options={{ title: 'Settings' }}
      />
    </Tabs>
  );
}