// src/screens/merchant/MerchantSettings.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
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
import theme from '../../src/theme/theme.js';

const BusinessHoursInput = ({ value, onChange }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const updateHours = (day, field, time) => {
    const newHours = { ...value };
    if (!newHours[day]) newHours[day] = {};
    newHours[day][field] = time;
    onChange(newHours);
  };

  return (
    <View style={styles.hoursContainer}>
      {days.map(day => (
        <View key={day} style={styles.dayRow}>
          <ThemedText style={styles.dayText}>{day}</ThemedText>
          <View style={styles.hoursInputs}>
            <FormField
              placeholder="09:00"
              value={value[day]?.open || ''}
              onChangeText={text => updateHours(day, 'open', text)}
              style={styles.timeInput}
            />
            <ThemedText style={styles.toText}>to</ThemedText>
            <FormField
              placeholder="17:00"
              value={value[day]?.close || ''}
              onChangeText={text => updateHours(day, 'close', text)}
              style={styles.timeInput}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const MerchantSettings = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    registrationNumber: '',
    businessHours: {},
    logo: null
  });
  const [logoUri, setLogoUri] = useState(null);

  // Fetch merchant data
  const { data: merchantData, isLoading } = useQuery({
    queryKey: ['merchantData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants?populate=*&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch merchant data');
      const data = await response.json();
      
      // Update form data with fetched data
      const merchant = data.data[0]?.attributes;
      if (merchant) {
        setFormData({
          businessName: merchant.metadata?.businessName || '',
          address: merchant.metadata?.address || '',
          phone: merchant.phone || '',
          email: merchant.email || '',
          description: merchant.metadata?.description || '',
          registrationNumber: merchant.metadata?.registrationNumber || '',
          businessHours: merchant.metadata?.businessHours || {},
        });
        
        if (merchant.logo?.data?.attributes?.url) {
          setLogoUri(`${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.logo.data.attributes.url}`);
        }
      }
      
      return data;
    }
  });

  // Update merchant mutation
  const updateMerchant = useMutation({
    mutationFn: async (data) => {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      // Append logo if changed
      if (data.logo) {
        const filename = data.logo.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('files.logo', {
          uri: data.logo,
          name: filename,
          type
        });
      }

      // Append merchant data
      formData.append('data', JSON.stringify({
        metadata: {
          businessName: data.businessName,
          address: data.address,
          description: data.description,
          registrationNumber: data.registrationNumber,
          businessHours: data.businessHours
        },
        phone: data.phone,
        email: data.email
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/${merchantData.data[0].id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to update merchant');
      return response.json();
    },
    onSuccess: () => {
      Alert.alert('Success', 'Settings updated successfully');
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
        setLogoUri(result.uri);
        setFormData(prev => ({ ...prev, logo: result.uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    if (!formData.businessName) {
      Alert.alert('Error', 'Business name is required');
      return;
    }
    updateMerchant.mutate(formData);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.adfaly[500]} />
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
          <ThemedText style={styles.headerTitle}>Business Settings</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Logo Section */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Business Logo</ThemedText>
            <TouchableOpacity 
              style={styles.logoContainer}
              onPress={handleImagePick}
            >
              {logoUri ? (
                <Image
                  source={{ uri: logoUri }}
                  style={styles.logo}
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Icon name="image" size={40} color="#666" />
                  <ThemedText style={styles.logoPlaceholderText}>
                    Tap to add logo
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </Card>

          {/* Business Details */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Business Details</ThemedText>
            <View style={styles.form}>
              <FormField
                label="Business Name"
                value={formData.businessName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                placeholder="Enter business name"
                required
              />

              <FormField
                label="Registration Number"
                value={formData.registrationNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, registrationNumber: text }))}
                placeholder="Enter registration number"
              />

              <FormField
                label="Description"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter business description"
                multiline
                numberOfLines={3}
              />
            </View>
          </Card>

          {/* Contact Information */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
            <View style={styles.form}>
              <FormField
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />

              <FormField
                label="Email"
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
                placeholder="Enter business address"
                multiline
                numberOfLines={2}
              />
            </View>
          </Card>

          {/* Business Hours */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Business Hours</ThemedText>
            <BusinessHoursInput
              value={formData.businessHours}
              onChange={(hours) => setFormData(prev => ({ ...prev, businessHours: hours }))}
            />
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              updateMerchant.isLoading && styles.saveButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={updateMerchant.isLoading}
          >
            {updateMerchant.isLoading ? (
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
  logoContainer: {
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC'
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666'
  },
  form: {
    gap: 16
  },
  hoursContainer: {
    gap: 12
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dayText: {
    width: 100
  },
  hoursInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  timeInput: {
    flex: 1
  },
  toText: {
    color: '#666'
  },
  saveButton: {
    backgroundColor: theme.colors.adfaly[500],
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

export default MerchantSettings;