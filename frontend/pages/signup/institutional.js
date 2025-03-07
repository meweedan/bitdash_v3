import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Text,
  useToast,
  SimpleGrid,
  Tooltip,
  Heading,
  useColorMode,
  FormHelperText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  useColorModeValue,
  AccordionPanel,
  Link as ChakraLink,
  Checkbox,
  Image,
  Avatar,
  Select,
  Textarea,
  Alert,
  AlertIcon,
  Divider,
  Stack,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Flex
} from '@chakra-ui/react';
import { InfoIcon, PhoneIcon, EmailIcon } from '@chakra-ui/icons';
import { FaBuilding, FaIdCard, FaGlobe, FaUsers, FaFileContract, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import RiskDisclosure from '@/components/RiskDisclosure';

const ROLES = {
  INSTITUTIONAL_CLIENT: 16, // Adjust this to match your actual institutional client role ID
};

const ENTITY_TYPES = [
  { value: 'corporation', label: 'Corporation' },
  { value: 'fund', label: 'Investment Fund' },
  { value: 'bank', label: 'Bank' },
  { value: 'trust', label: 'Trust' },
  { value: 'insurance', label: 'Insurance Company' },
  { value: 'pension_fund', label: 'Pension Fund' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'other', label: 'Other' }
];

const SUPPORT_LEVELS = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium (min. $250,000 investment)' },
  { value: 'enterprise', label: 'Enterprise (min. $1,000,000 investment)' },
  { value: 'custom', label: 'Custom (Tailored arrangement)' }
];

const formStyles = {
  position: "relative",
  maxW: "800px",
  mx: "auto",
  p: 8,
  borderRadius: "xl",
  boxShadow: "xl",
  backdropFilter: "blur(10px)",
  bg: "rgba(255, 255, 255, 0.05)",
  border: "1px solid",
  borderColor: "whiteAlpha.200"
};

const inputStyles = {
  bg: "rgba(255, 255, 255, 0.05)",
  borderColor: "whiteAlpha.300",
  _hover: {
    borderColor: "whiteAlpha.400",
  },
  _focus: {
    borderColor: "blue.400",
    bg: "rgba(255, 255, 255, 0.08)",
  }
};

export default function InstitutionalSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [agreedToRiskDisclosure, setAgreedToRiskDisclosure] = useState(false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleRiskAcceptance = (accepted) => {
    if (accepted) {
      setAgreedToRiskDisclosure(true);
    }
  };
  
  const [formData, setFormData] = useState({
    // Account credentials
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Company information
    companyName: '',
    legalEntityType: 'corporation',
    businessRegistrationNumber: '',
    countryOfIncorporation: '',
    taxIdentificationNumber: '',
    establishedDate: '',
    totalAssets: '',
    annualRevenue: '',
    creditRating: '',
    
    // Platform preferences
    platformType: 'bitstock',
    
    // Contact information
    primaryContactPerson: {
      name: '',
      position: '',
      email: '',
      phone: ''
    },
    authorizedPersons: [{
      name: '',
      position: '',
      email: '',
      phone: ''
    }],
    
    // Address information
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    operationalAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    sameAddress: true,
    
    // Compliance
    kycVerified: false,
    amlChecked: false,
    serviceAgreementSigned: false,
    
    // Support and services
    supportLevel: 'standard',
    apiAccess: false,
    
    // Financial details
    tradingVolume: '',
    customFeePlan: JSON.stringify({
      enabled: false,
      tradingFeeDiscount: 0,
      minimumVolume: 0
    }),
    withdrawalInstructions: '',
    
    // Terms and documents
    agreedToTerms: false,
    
    // Company logo
    logo: null
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  const nextTab = () => {
    // Validate current tab before proceeding
    if (validateCurrentTab()) {
      setCurrentTab(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevTab = () => {
    setCurrentTab(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleAuthorizedPersonChange = (index, field, value) => {
    setFormData(prev => {
      const updatedPersons = [...prev.authorizedPersons];
      updatedPersons[index] = {
        ...updatedPersons[index],
        [field]: value
      };
      return {
        ...prev,
        authorizedPersons: updatedPersons
      };
    });
  };

  const addAuthorizedPerson = () => {
    setFormData(prev => ({
      ...prev,
      authorizedPersons: [
        ...prev.authorizedPersons,
        { name: '', position: '', email: '', phone: '' }
      ]
    }));
  };

  const removeAuthorizedPerson = (index) => {
    if (formData.authorizedPersons.length <= 1) {
      toast({
        title: t('error'),
        description: t('mustHaveOneAuthorizedPerson'),
        status: 'error'
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      authorizedPersons: prev.authorizedPersons.filter((_, i) => i !== index)
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // If user checks "same address", copy billing address to operational address
    if (name === 'sameAddress' && checked) {
      setFormData(prev => ({
        ...prev,
        operationalAddress: {...prev.billingAddress}
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: t('error'),
          description: t('invalidFileType'),
          status: 'error'
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: t('error'),
          description: t('fileTooLarge'),
          status: 'error'
        });
        return;
      }

      // Set form data and create preview
      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCurrentTab = () => {
    // Validate account tab
    if (currentTab === 0) {
      if (!formData.username || formData.username.length < 3) {
        toast({
          title: t('error'),
          description: t('usernameTooShort'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.email || !formData.email.includes('@')) {
        toast({
          title: t('error'),
          description: t('invalidEmail'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.password || formData.password.length < 8) {
        toast({
          title: t('error'),
          description: t('passwordTooShort'),
          status: 'error'
        });
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t('error'),
          description: t('passwordsDoNotMatch'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate company tab
    else if (currentTab === 1) {
      if (!formData.companyName) {
        toast({
          title: t('error'),
          description: t('companyNameRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.businessRegistrationNumber) {
        toast({
          title: t('error'),
          description: t('registrationNumberRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.countryOfIncorporation) {
        toast({
          title: t('error'),
          description: t('countryRequired'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate contact tab
    else if (currentTab === 2) {
      if (!formData.primaryContactPerson.name || !formData.primaryContactPerson.email) {
        toast({
          title: t('error'),
          description: t('primaryContactRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.billingAddress.street || !formData.billingAddress.city || !formData.billingAddress.country) {
        toast({
          title: t('error'),
          description: t('billingAddressRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.sameAddress && 
         (!formData.operationalAddress.street || !formData.operationalAddress.city || !formData.operationalAddress.country)) {
        toast({
          title: t('error'),
          description: t('operationalAddressRequired'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate terms tab (final tab)
    else if (currentTab === 3) {
      if (!formData.agreedToTerms) {
        toast({
          title: t('error'),
          description: t('mustAgreeToTerms'),
          status: 'error'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentTab()) return;

    setLoading(true);
    try {
      // 1. Register user
      const userResponse = await fetch(`${BASE_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmed: false, // Set to false as institutional clients need approval
          blocked: false,
          role: ROLES.INSTITUTIONAL_CLIENT
        })
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create institutional client profile
      const institutionalPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'pending',
          companyName: formData.companyName,
          legalEntityType: formData.legalEntityType,
          businessRegistrationNumber: formData.businessRegistrationNumber,
          countryOfIncorporation: formData.countryOfIncorporation,
          taxIdentificationNumber: formData.taxIdentificationNumber,
          platformType: formData.platformType,
          primaryContactPerson: JSON.stringify(formData.primaryContactPerson),
          authorizedPersons: JSON.stringify(formData.authorizedPersons),
          billingAddress: JSON.stringify(formData.billingAddress),
          operationalAddress: JSON.stringify(formData.operationalAddress),
          kycVerified: false,
          amlChecked: false,
          serviceAgreementSigned: false,
          apiAccess: formData.apiAccess,
          supportLevel: formData.supportLevel,
          creditRating: formData.creditRating,
          totalAssets: parseFloat(formData.totalAssets) || 0,
          annualRevenue: parseFloat(formData.annualRevenue) || 0,
          establishedDate: formData.establishedDate || null,
          customFeePlan: formData.customFeePlan,
          tradingVolume: 0,
          withdrawalInstructions: formData.withdrawalInstructions,
          publishedAt: new Date().toISOString()
        }
      };

      const institutionalResponse = await fetch(`${BASE_URL}/api/institutional-clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(institutionalPayload)
      });

      const institutionalData = await institutionalResponse.json();
      if (!institutionalResponse.ok) {
        throw new Error(t('institutionalProfileCreationFailed'));
      }

      // 3. Create primary wallet for the institution
      const walletPayload = {
        data: {
          balance: 0,
          currency: 'USD',
          isActive: true,
          walletId: `INST-${userData.user.id}-${Date.now()}`,
          wallet_type: 'corporate',
          dailyLimit: 1000000, // High limits for institutional clients
          monthlyLimit: 10000000,
          institutional_client: institutionalData.data.id
        }
      };

      const walletResponse = await fetch(`${BASE_URL}/api/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(walletPayload)
      });

      if (!walletResponse.ok) {
        throw new Error(t('walletCreationFailed'));
      }

      // 4. Upload logo if selected
      if (formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append('files', formData.logo);
        logoFormData.append('ref', 'api::institutional-client.institutional-client');
        logoFormData.append('refId', institutionalData.data.id);
        logoFormData.append('field', 'logo');

        const logoUploadResponse = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userData.jwt}`
          },
          body: logoFormData
        });

        if (!logoUploadResponse.ok) {
          console.warn('Logo upload failed:', await logoUploadResponse.json());
          // Non-critical error, continue with registration
        }
      }

      toast({
        title: t('success'),
        description: t('institutionalRegistrationSubmitted'),
        status: 'success',
        duration: 5000
      });

      // Redirect to confirmation page
      router.push('/institutional/registration-confirmation');

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Tab content - Account Information
  const renderAccountTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaIdCard} mr={2} color={accentColor} />
          {t('accountCredentials')}
        </Flex>
      </Heading>
      
      <FormControl isRequired>
        <FormLabel>{t('username')}</FormLabel>
        <Input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder={t('enterUsername')}
          size="lg"
          {...inputStyles}
        />
        <FormHelperText>
          {t('usernameForLogin')}
        </FormHelperText>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>{t('email')}</FormLabel>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t('enterEmail')}
          size="lg"
          {...inputStyles}
        />
        <FormHelperText>
          {t('primaryAdminEmail')}
        </FormHelperText>
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('password')}</FormLabel>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('enterPassword')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('confirmPassword')}</FormLabel>
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('confirmPassword')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <Box pt={4}>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={nextTab}
          width="full"
        >
          {t('next')}
        </Button>
      </Box>
    </VStack>
  );

  // Tab content - Company Information
  const renderCompanyTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaBuilding} mr={2} color={accentColor} />
          {t('companyInformation')}
        </Flex>
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('companyName')}</FormLabel>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder={t('enterCompanyName')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('legalEntityType')}</FormLabel>
          <Select
            name="legalEntityType"
            value={formData.legalEntityType}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          >
            {ENTITY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('businessRegistrationNumber')}</FormLabel>
          <Input
            name="businessRegistrationNumber"
            value={formData.businessRegistrationNumber}
            onChange={handleInputChange}
            placeholder={t('enterRegistrationNumber')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('countryOfIncorporation')}</FormLabel>
          <Input
            name="countryOfIncorporation"
            value={formData.countryOfIncorporation}
            onChange={handleInputChange}
            placeholder={t('enterCountry')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('taxIdentificationNumber')}</FormLabel>
          <Input
            name="taxIdentificationNumber"
            value={formData.taxIdentificationNumber}
            onChange={handleInputChange}
            placeholder={t('enterTaxID')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('establishedDate')}</FormLabel>
          <Input
            name="establishedDate"
            type="date"
            value={formData.establishedDate}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('totalAssets')}</FormLabel>
          <InputGroup size="lg">
            <InputLeftAddon>$</InputLeftAddon>
            <Input
              name="totalAssets"
              type="number"
              value={formData.totalAssets}
              onChange={handleInputChange}
              placeholder={t('enterAmount')}
              {...inputStyles}
            />
            <InputRightAddon>USD</InputRightAddon>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>{t('annualRevenue')}</FormLabel>
          <InputGroup size="lg">
            <InputLeftAddon>$</InputLeftAddon>
            <Input
              name="annualRevenue"
              type="number"
              value={formData.annualRevenue}
              onChange={handleInputChange}
              placeholder={t('enterAmount')}
              {...inputStyles}
            />
            <InputRightAddon>USD</InputRightAddon>
          </InputGroup>
        </FormControl>
      </SimpleGrid>

      <FormControl>
        <FormLabel>{t('creditRating')}</FormLabel>
        <Input
          name="creditRating"
          value={formData.creditRating}
          onChange={handleInputChange}
          placeholder={t('enterCreditRating')}
          size="lg"
          {...inputStyles}
        />
        <FormHelperText>
          {t('creditRatingHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('companyLogo')}</FormLabel>
        <HStack spacing={4} align="center">
          {previewLogo && (
            <Box boxSize="80px" borderRadius="md" overflow="hidden">
              <Image 
                src={previewLogo}
                alt={formData.companyName}
                objectFit="contain"
                width="100%"
                height="100%"
              />
            </Box>
          )}
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/svg+xml"
            onChange={handleFileChange}
            variant="filled"
            size="lg"
            {...inputStyles}
          />
        </HStack>
        <FormHelperText>
          {t('companyLogoHelper')}
        </FormHelperText>
      </FormControl>

      <HStack justify="space-between" pt={4}>
        <Button
          variant="outline"
          onClick={prevTab}
        >
          {t('back')}
        </Button>
        <Button
          colorScheme="blue"
          onClick={nextTab}
        >
          {t('next')}
        </Button>
      </HStack>
    </VStack>
  );

  // Tab content - Contact Information
  const renderContactTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaUsers} mr={2} color={accentColor} />
          {t('contactInformation')}
        </Flex>
      </Heading>

      <Box bg={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="md">
        <Heading size="sm" mb={3}>{t('primaryContactPerson')}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isRequired>
            <FormLabel>{t('name')}</FormLabel>
            <Input
              value={formData.primaryContactPerson.name}
              onChange={(e) => handleNestedInputChange('primaryContactPerson', 'name', e.target.value)}
              placeholder={t('enterName')}
              size="lg"
              {...inputStyles}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t('position')}</FormLabel>
            <Input
              value={formData.primaryContactPerson.position}
              onChange={(e) => handleNestedInputChange('primaryContactPerson', 'position', e.target.value)}
              placeholder={t('enterPosition')}
              size="lg"
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t('email')}</FormLabel>
            <Input
              type="email"
              value={formData.primaryContactPerson.email}
              onChange={(e) => handleNestedInputChange('primaryContactPerson', 'email', e.target.value)}
              placeholder={t('enterEmail')}
              size="lg"
              {...inputStyles}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t('phone')}</FormLabel>
            <Input
              value={formData.primaryContactPerson.phone}
              onChange={(e) => handleNestedInputChange('primaryContactPerson', 'phone', e.target.value)}
              placeholder={t('enterPhone')}
              size="lg"
              {...inputStyles}
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      <Accordion allowToggle defaultIndex={[0]} mb={4}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading size="sm">{t('authorizedPersons')}</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text mb={4} fontSize="sm">
              {t('authorizedPersonsHelper')}
            </Text>
            
            {formData.authorizedPersons.map((person, index) => (
              <Box 
                key={index} 
                mb={4} 
                p={4} 
                borderWidth="1px" 
                borderRadius="md"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Flex justify="space-between" mb={3}>
                  <Heading size="xs">{t('authorizedPerson')} #{index + 1}</Heading>
                  {formData.authorizedPersons.length > 1 && (
                    <Button 
                      size="xs" 
                      colorScheme="red" 
                      variant="ghost"
                      onClick={() => removeAuthorizedPerson(index)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                </Flex>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>{t('name')}</FormLabel>
                    <Input
                      value={person.name}
                      onChange={(e) => handleAuthorizedPersonChange(index, 'name', e.target.value)}
                      placeholder={t('enterName')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('position')}</FormLabel>
                    <Input
                      value={person.position}
                      onChange={(e) => handleAuthorizedPersonChange(index, 'position', e.target.value)}
                      placeholder={t('enterPosition')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('email')}</FormLabel>
                    <Input
                      type="email"
                      value={person.email}
                      onChange={(e) => handleAuthorizedPersonChange(index, 'email', e.target.value)}
                      placeholder={t('enterEmail')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('phone')}</FormLabel>
                    <Input
                      value={person.phone}
                      onChange={(e) => handleAuthorizedPersonChange(index, 'phone', e.target.value)}
                      placeholder={t('enterPhone')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            ))}
            
            <Button 
              leftIcon={<Icon as={FaUsers} />} 
              onClick={addAuthorizedPerson}
              size="sm"
              colorScheme="blue"
              variant="outline"
            >
              {t('addAuthorizedPerson')}
            </Button>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading size="sm">{t('addressInformation')}</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box mb={4}>
              <Heading size="xs" mb={3}>{t('billingAddress')}</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('street')}</FormLabel>
                  <Input
                    value={formData.billingAddress.street}
                    onChange={(e) => handleNestedInputChange('billingAddress', 'street', e.target.value)}
                    placeholder={t('enterStreet')}
                    size="md"
                    {...inputStyles}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('city')}</FormLabel>
                  <Input
                    value={formData.billingAddress.city}
                    onChange={(e) => handleNestedInputChange('billingAddress', 'city', e.target.value)}
                    placeholder={t('enterCity')}
                    size="md"
                    {...inputStyles}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('state')}</FormLabel>
                  <Input
                    value={formData.billingAddress.state}
                    onChange={(e) => handleNestedInputChange('billingAddress', 'state', e.target.value)}
                    placeholder={t('enterState')}
                    size="md"
                    {...inputStyles}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('postalCode')}</FormLabel>
                  <Input
                    value={formData.billingAddress.postalCode}
                    onChange={(e) => handleNestedInputChange('billingAddress', 'postalCode', e.target.value)}
                    placeholder={t('enterPostalCode')}
                    size="md"
                    {...inputStyles}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('country')}</FormLabel>
                  <Input
                    value={formData.billingAddress.country}
                    onChange={(e) => handleNestedInputChange('billingAddress', 'country', e.target.value)}
                    placeholder={t('enterCountry')}
                    size="md"
                    {...inputStyles}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
            
            <Checkbox
              name="sameAddress"
              isChecked={formData.sameAddress}
              onChange={handleCheckboxChange}
              colorScheme="blue"
              mb={4}
            >
              {t('sameOperationalAddress')}
            </Checkbox>
            
            {!formData.sameAddress && (
              <Box>
                <Heading size="xs" mb={3}>{t('operationalAddress')}</Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('street')}</FormLabel>
                    <Input
                      value={formData.operationalAddress.street}
                      onChange={(e) => handleNestedInputChange('operationalAddress', 'street', e.target.value)}
                      placeholder={t('enterStreet')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('city')}</FormLabel>
                    <Input
                      value={formData.operationalAddress.city}
                      onChange={(e) => handleNestedInputChange('operationalAddress', 'city', e.target.value)}
                      placeholder={t('enterCity')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('state')}</FormLabel>
                    <Input
                      value={formData.operationalAddress.state}
                      onChange={(e) => handleNestedInputChange('operationalAddress', 'state', e.target.value)}
                      placeholder={t('enterState')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('postalCode')}</FormLabel>
                    <Input
                      value={formData.operationalAddress.postalCode}
                      onChange={(e) => handleNestedInputChange('operationalAddress', 'postalCode', e.target.value)}
                      placeholder={t('enterPostalCode')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('country')}</FormLabel>
                    <Input
                      value={formData.operationalAddress.country}
                      onChange={(e) => handleNestedInputChange('operationalAddress', 'country', e.target.value)}
                      placeholder={t('enterCountry')}
                      size="md"
                      {...inputStyles}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <HStack justify="space-between" pt={4}>
        <Button
          variant="outline"
          onClick={prevTab}
        >
          {t('back')}
        </Button>
        <Button
          colorScheme="blue"
          onClick={nextTab}
        >
          {t('next')}
        </Button>
      </HStack>
    </VStack>
  );

  // Tab content - Services & Requirements
  const renderServicesTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaFileContract} mr={2} color={accentColor} />
          {t('servicesAndRequirements')}
        </Flex>
      </Heading>

      <FormControl isRequired>
        <FormLabel>{t('supportLevel')}</FormLabel>
        <RadioGroup 
          value={formData.supportLevel}
          onChange={(value) => setFormData(prev => ({ ...prev, supportLevel: value }))}
        >
          <Stack direction="column" spacing={3}>
            {SUPPORT_LEVELS.map(level => (
              <Radio key={level.value} value={level.value} colorScheme="blue">
                {level.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
        <FormHelperText>
          {t('supportLevelHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <Checkbox
          name="apiAccess"
          isChecked={formData.apiAccess}
          onChange={handleCheckboxChange}
          colorScheme="blue"
        >
          {t('requireApiAccess')}
        </Checkbox>
        <FormHelperText pl={6}>
          {t('apiAccessHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('withdrawalInstructions')}</FormLabel>
        <Textarea
          name="withdrawalInstructions"
          value={formData.withdrawalInstructions}
          onChange={handleInputChange}
          placeholder={t('enterWithdrawalInstructions')}
          size="lg"
          height="120px"
          {...inputStyles}
        />
        <FormHelperText>
          {t('withdrawalInstructionsHelper')}
        </FormHelperText>
      </FormControl>

      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">{t('kycRequirements')}</Text>
          <Text fontSize="sm">{t('kycRequirementsInfo')}</Text>
        </Box>
      </Alert>

      <FormControl isRequired>
        <Checkbox
          name="agreedToTerms"
          isChecked={formData.agreedToTerms}
          onChange={handleCheckboxChange}
          colorScheme="blue"
          size="lg"
        >
          <Text fontSize="sm">
            {t('institutionalTermsAgreement', 'I agree to the')} {' '}
            <ChakraLink color="blue.400" href="/policies/institutional-agreement" target="_blank">
              {t('institutionalAgreementTerms')}
            </ChakraLink>
            {' '} {t('andThe')} {' '}
            <ChakraLink color="blue.400" href="/policies/privacy" target="_blank">
              {t('privacyPolicy')}
            </ChakraLink>
          </Text>
        </Checkbox>
      </FormControl>

      <FormControl isRequired>
        <HStack spacing={2} align="center">
            <Checkbox
              isChecked={agreedToRiskDisclosure}
              onChange={(e) => setAgreedToRiskDisclosure(e.target.checked)}
              colorScheme="blue"
              >
                <Text fontSize="sm">
                  {t('agreeToRiskDisclosure', 'I have read and agree to the Risk Disclosure Statement')}
                </Text>
            </Checkbox>

            <RiskDisclosure 
            platform="BitStock" 
            accountType="institutional" 
            onAccept={handleRiskAcceptance}
            />
        </HStack>
      </FormControl>

      <Divider my={2} />

      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">{t('applicationReviewNotice')}</Text>
          <Text fontSize="sm">{t('institutionalReviewInfo')}</Text>
        </Box>
      </Alert>

      <HStack justify="space-between" pt={4}>
        <Button
          variant="outline"
          onClick={prevTab}
        >
          {t('back')}
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          isLoading={loading}
          loadingText={t('submittingApplication')}
          onClick={handleSubmit}
        >
          {t('submitApplication')}
        </Button>
      </HStack>
    </VStack>
  );

  // Main component return
  const accentColor = useColorModeValue('brand.stocks.500', 'brand.stocks.400');
  
  return (
    <Layout>
      <Head>
        <title>{t('institutionalSignup')} | BitStock</title>
      </Head>
      <Box {...formStyles}>
        <VStack spacing={8}>
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? 'white' : 'gray.800'}
            textAlign="center"
            bgGradient="linear(to-r, brand.stocks.400, brand.stocks.600)"
            bgClip="text"
          >
            {t('institutionalAccount')}
          </Heading>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              {t('institutionalMinDeposit', 'Institutional accounts require a minimum initial deposit of $100,000.')}
            </Text>
          </Alert>

          <Tabs 
            index={currentTab} 
            onChange={setCurrentTab}
            variant="enclosed"
            colorScheme="blue"
            width="100%"
            isFitted
          >
            <TabList mb="1em">
              <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
                <Flex align="center" direction="column" py={1}>
                  <Icon as={FaIdCard} mb={1} />
                  <Text fontSize="sm">{t('account')}</Text>
                </Flex>
              </Tab>
              <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
                <Flex align="center" direction="column" py={1}>
                  <Icon as={FaBuilding} mb={1} />
                  <Text fontSize="sm">{t('company')}</Text>
                </Flex>
              </Tab>
              <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
                <Flex align="center" direction="column" py={1}>
                  <Icon as={FaUsers} mb={1} />
                  <Text fontSize="sm">{t('contacts')}</Text>
                </Flex>
              </Tab>
              <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
                <Flex align="center" direction="column" py={1}>
                  <Icon as={FaFileContract} mb={1} />
                  <Text fontSize="sm">{t('services')}</Text>
                </Flex>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>{renderAccountTab()}</TabPanel>
              <TabPanel p={0}>{renderCompanyTab()}</TabPanel>
              <TabPanel p={0}>{renderContactTab()}</TabPanel>
              <TabPanel p={0}>{renderServicesTab()}</TabPanel>
            </TabPanels>
          </Tabs>

          {/* Login Link at the bottom of the form */}
          <Text textAlign="center" mt={6}>
            {t('haveAccount')}{' '}
            <Link href="/login" passHref>
              <ChakraLink color="blue.400">
                {t('login')}
              </ChakraLink>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}