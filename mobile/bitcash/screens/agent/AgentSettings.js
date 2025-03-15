// mobile/adfaly/screens/agent/AgentSettings.js
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
import theme from '../../src/theme/theme';

const BusinessHoursInput = ({ value, onChange, userType }) => {
  // Only show business hours for merchants
  if (userType !== 'merchant') return null;

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

const AgentSettings = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    registrationNumber: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    businessHours: {},
    // Agent specific fields
    idNumber: '',
    operatingArea: '',
    commission: '',
    maxDailyTransactions: '',
    logo: null
  });
  const [logoUri, setLogoUri] = useState(null);

  // Determine user type and fetch data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      // Try merchant first
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants?populate=*&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      let data = await response.json();

      if (data.data?.length > 0) {
        setUserType('merchant');
        return { type: 'merchant', data: data.data[0] };
      }

      // Try agent
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?populate=*&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      data = await response.json();

      if (data.data?.length > 0) {
        setUserType('agent');
        return { type: 'agent', data: data.data[0] };
      }

      throw new Error('User profile not found');
    },
    onSuccess: (data) => {
      const attributes = data.data.attributes;
      setFormData({
        businessName: attributes.metadata?.businessName || '',
        registrationNumber: attributes.metadata?.registrationNumber || '',
        phone: attributes.phone || '',
        email: attributes.email || '',
        address: attributes.metadata?.address || '',
        description: attributes.metadata?.description || '',
        businessHours: attributes.metadata?.businessHours || {},
        idNumber: attributes.metadata?.idNumber || '',
        operatingArea: attributes.metadata?.operatingArea || '',
        commission: attributes.metadata?.commission || '',
        maxDailyTransactions: attributes.metadata?.maxDailyTransactions || ''
      });

      if (attributes.logo?.data?.attributes?.url) {
        setLogoUri(`${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.logo.data.attributes.url}`);
      }
    }
  });

  // Update mutation
  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

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

      const endpoint = userType === 'merchant' ? 'merchants' : 'agents';
      const metadata = {
        ...data,
        logo: undefined // Remove logo from metadata
      };

      formData.append('data', JSON.stringify({ metadata }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${endpoint}/${userData.data.id}`,
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
        setLogoUri(result.uri);
        setFormData(prev => ({ ...prev, logo: result.uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    const requiredFields = userType === 'merchant' 
      ? ['businessName'] 
      : ['idNumber'];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    updateProfile.mutate(formData);
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
          <ThemedText style={styles.headerTitle}>
            {userType === 'merchant' ? 'Business Settings' : 'Agent Settings'}
          </ThemedText>
        </View>

        <View style={styles.content}>
          {/* Logo Section */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {userType === 'merchant' ? 'Business Logo' : 'Profile Picture'}
            </ThemedText>
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
                    Tap to add {userType === 'merchant' ? 'logo' : 'picture'}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </Card>

          {/* Main Details */}
          <Card style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {userType === 'merchant' ? 'Business Details' : 'Agent Details'}
            </ThemedText>
            <View style={styles.form}>
              {userType === 'merchant' ? (
                <>
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
                </>
              ) : (
                <>
                  <FormField
                    label="ID Number"
                    value={formData.idNumber}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, idNumber: text }))}
                    placeholder="Enter ID number"
                    required
                  />
                  <FormField
                    label="Operating Area"
                    value={formData.operatingArea}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, operatingArea: text }))}
                    placeholder="Enter operating area"
                  />
                  <FormField
                    label="Commission Rate (%)"
                    value={formData.commission}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, commission: text }))}
                    placeholder="Enter commission rate"
                    keyboardType="numeric"
                  />
                  <FormField
                    label="Max Daily Transactions"
                    value={formData.maxDailyTransactions}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, maxDailyTransactions: text }))}
                    placeholder="Enter max daily transactions"
                    keyboardType="numeric"
                  />
                </>
              )}
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
                placeholder="Enter address"
                multiline
                numberOfLines={2}
              />
            </View>
          </Card>

          {/* Business Hours (Merchants Only) */}
          {userType === 'merchant' && (
            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Business Hours</ThemedText>
              <BusinessHoursInput
                value={formData.businessHours}
                onChange={(hours) => setFormData(prev => ({ ...prev, businessHours: hours }))}
                userType={userType}
              />
            </Card>
          )}

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

export default AgentSettings;