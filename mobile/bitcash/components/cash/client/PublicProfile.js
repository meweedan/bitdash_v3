import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Avatar,
  Button,
  Divider,
  HStack,
  VStack,
  Badge,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather'; // Or your preferred icon library
import Toast from 'react-native-toast-message'; // For toast messages

const PublicProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clientName } = route.params; // Access route parameters

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!clientName) return;

      setLoading(true);
      setError(null);

      try {
        const responses = [
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
            `filters[wallet_qr_code][$eq]=${clientName}` +
            `&populate[avatar][fields][0]=url` +
            `&populate=*`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${clientName}?` +
            `populate[avatar][fields][0]=url` +
            `&populate=*`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
            `filters[$or][0][phone][$eq]=${clientName}` +
            `&filters[$or][1][wallet_qr_code][$eq]=${clientName}` +
            `&populate[avatar][fields][0]=url` +
            `&populate=*`)
        ];

        let response;
        for (const fetchPromise of responses) {
          response = await fetchPromise;
          if (response.ok) break;
        }

        if (!response || !response.ok) {
          throw new Error('Profile not found');
        }

        const jsonData = await response.json();
        const profileData = jsonData.data.length ? jsonData.data[0] : jsonData.data;

        if (!profileData || !profileData.attributes) {
          throw new Error('Invalid profile structure');
        }

        setProfile(profileData);
      } catch (err) {
        console.error('Profile Fetch Error:', err);
        setError(err.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    if (clientName) {
      fetchProfile();
    }
  }, [clientName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Failed to load profile'}</Text>
      </View>
    );
  }

  const attributes = profile.attributes || {};
  const walletData = attributes.wallet?.data?.attributes || {};
  const avatarSource = attributes.avatar?.data
    ? { uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.avatar.data.attributes.url}` }
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <VStack space={6} alignItems="center">
          <Avatar
            size="2xl"
            source={avatarSource}
            bg="blue.500"
            color="white"
          >
            {attributes.fullName ? attributes.fullName[0] : 'U'} {/* Display first letter */}
          </Avatar>

          <Badge
            colorScheme={attributes.wallet_status === 'active' ? 'green' : 'red'}
            px={3}
            py={2}
            borderRadius="full"
            alignSelf="center"
            fontSize="sm"
          >
            {(attributes.wallet_status || 'unknown').toUpperCase()}
          </Badge>

          <VStack space={3} alignItems="center">
            <Text style={styles.heading}>{attributes.fullName || 'Unknown User'}</Text>
            <HStack space={2}>
              <Icon name="phone" size={16} color="black" />
              <Text>{attributes.phone || 'No phone'}</Text>
            </HStack>
          </VStack>

          <Divider thickness={2} />

          <VStack space={4} alignItems="stretch">
            <HStack space={2}>
              <Icon name="user" size={16} color="black" />
              <Text fontWeight="bold">Customer ID:</Text>
              <Text>{profile.id}</Text>
            </HStack>
            <Divider />
            <Button
              colorScheme="blue"
              size="lg"
              leftIcon={<Icon name="arrow-up-right" size={16} color="white" />}
              onPress={() =>
                navigation.navigate('Transfer', { // Navigate to your transfer screen
                  recipientId: profile.id,
                  recipientName: attributes.fullName,
                  recipientPhone: attributes.phone,
                })
              }
              width="full"
            >
              Send Money
            </Button>
          </VStack>
        </VStack>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0', // Light background
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PublicProfile;