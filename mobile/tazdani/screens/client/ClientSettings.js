import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../../components/ThemedText';
import FormField from '../../components/FormField';
import { Card } from '../../components/SharedComponents';
import theme from '../../src/theme/theme';

const CustomerSettings = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    profilePicture: null
  });
  const [profileUri, setProfileUri] = useState(null);

  // Fetch customer data
  const { data: customerData, isLoading } = useQuery({
    queryKey: ['customerData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?populate=*&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch customer data');
      const data = await response.json();
      return data.data[0];
    },
    onSuccess: (data) => {
      const attributes = data.attributes;
      setFormData({
        fullName: attributes.fullName || '',
        phone: attributes.phone || '',
        email: attributes.email || '',
        address: attributes.address || ''
      });

      if (attributes.profilePicture?.data?.attributes?.url) {
        setProfileUri(`${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.profilePicture.data.attributes.url}`);
      }
    }
  });

  // Update mutation
  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      if (data.profilePicture) {
        const filename = data.profilePicture.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('files.profilePicture', {
          uri: data.profilePicture,
          name: filename,
          type
        });
      }

      formData.append('data', JSON.stringify({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${customerData.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      Alert.alert('Success', 'Profile updated successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    }
  });

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.canceled) {
        setProfileUri(result.uri);
        setFormData(prev => ({ ...prev, profilePicture: result.uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.tazdani[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Profile Settings</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Profile Picture Section */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Profile Picture</ThemedText>
            <TouchableOpacity 
              style={styles.profileContainer}
              onPress={handleImagePick}
            >
              {profileUri ? (
                <Image
                  source={{ uri: profileUri }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Icon name="user" size={40} color="#666" />
                  <ThemedText style={styles.profilePlaceholderText}>
                    Tap to add profile picture
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </Card>

          {/* Personal Information */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            <View style={styles.form}>
              <FormField
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                required
              />
              <FormField
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                label="Address"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="Enter your address"
                multiline
                numberOfLines={2}
              />
            </View>
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              updateProfile.isLoading && styles.saveButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={updateProfile.isLoading}
          >
            {updateProfile.isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    padding: 16,
    gap: 16
  },
  section: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  profileContainer: {
    alignItems: 'center'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC'
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666'
  },
  form: {
    gap: 16
  },
  saveButton: {
    backgroundColor: theme.colors.tazdani[500],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32
  },
  saveButtonDisabled: {
    opacity: 0.7
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CustomerSettings;