import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BitCashHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="#4CAF50" 
        barStyle="light-content" 
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons 
            name="menu" 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>

        <Image 
          source={require('../assets/adfaly-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />

        <View style={styles.rightIcons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')}
            style={styles.iconContainer}
          >
            <Ionicons 
              name="notifications-outline" 
              size={22} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          {isLoggedIn ? (
            <TouchableOpacity 
              onPress={handleLogout}
              style={styles.iconContainer}
            >
              <Ionicons 
                name="log-out-outline" 
                size={22} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.iconContainer}
            >
              <Ionicons 
                name="log-in-outline" 
                size={22} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    height: 40,
    width: 120,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 12,
  }
});

export default BitCashHeader;