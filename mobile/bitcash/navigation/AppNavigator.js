import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import LoginScreen from '../screens/LoginScreen';
import ClientDashboard from '../screens/client/ClientDashboard';
import TransferScreen from '../screens/client/TransferScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import MapViewScreen from '../screens/MapViewScreen';
import HomeScreen from '../screens/HomeScreen';

// Create Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Map Component (adapted from your frontend)
const MapViewScreen = () => {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    // Fetch locations from your API
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/locations`);
        const data = await response.json();
        setLocations(data);
        // Set center to first location or default
        if (data.length > 0) {
          setCenter([data[0].latitude, data[0].longitude]);
        }
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: center[0],
          longitude: center[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ 
              latitude: location.latitude, 
              longitude: location.longitude 
            }}
            title={location.name}
            description={location.address}
          />
        ))}
      </MapView>
    </View>
  );
};


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: 'white',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'BitCash',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Notifications')}
                style={{ marginRight: 16 }}
              >
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
            )
          }}
        />

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={ClientDashboard} 
          options={{ title: 'BitCash Dashboard' }}
        />
        <Stack.Screen 
          name="Transfer" 
          component={TransferScreen} 
          options={{ title: 'Send Money' }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen} 
          options={{ 
            title: 'Scan QR Code',
            presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name="MapView" 
          component={MapViewScreen} 
          options={{ title: 'Nearby Locations' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;