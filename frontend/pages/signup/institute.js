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
  Select,
  Textarea,
  Alert,
  AlertIcon,
  Divider,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  RadioGroup,
  Radio,
  Flex,
  Tag
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { 
  FaBuilding, 
  FaChartLine, 
  FaExchangeAlt, 
  FaUsers, 
  FaGlobeAmericas, 
  FaLock, 
  FaCogs, 
  FaMoneyBillWave, 
  FaIdCard 
} from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';

const ROLES = {
  INSTITUTIONAL_CLIENT: 10, // Adjust this to match your actual institutional client role ID
};

const ENTITY_TYPES = [
  { value: 'broker', label: 'Broker/Dealer' },
  { value: 'hedge_fund', label: 'Hedge Fund' },
  { value: 'prop_firm', label: 'Proprietary Trading Firm' },
  { value: 'bank', label: 'Bank/Financial Institution' },
  { value: 'asset_manager', label: 'Asset Manager' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'other', label: 'Other' }
];

const TRADING_PLATFORMS = [
  { value: 'mt5', label: 'MetaTrader 5' },
  { value: 'fix_api', label: 'FIX API' },
  { value: 'rest_api', label: 'REST API' },
  { value: 'web_trading', label: 'Web Trading Platform' },
  { value: 'custom', label: 'Custom Integration' }
];

const TRADING_VOLUME_OPTIONS = [
  { value: 'under_10m', label: 'Under $10M per month' },
  { value: '10m_50m', label: '$10M - $50M per month' },
  { value: '50m_100m', label: '$50M - $100M per month' },
  { value: '100m_500m', label: '$100M - $500M per month' },
  { value: 'over_500m', label: 'Over $500M per month' }
];

const INSTRUMENT_TYPES = [
  { value: 'forex', label: 'Forex' },
  { value: 'metals', label: 'Precious Metals' },
  { value: 'indices', label: 'Indices' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'crypto', label: 'Cryptocurrencies' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'equities', label: 'Equities' }
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

export default function InstituteSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  
  const [formData, setFormData] = useState({
    // Account credentials
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Company information
    companyName: '',
    legalEntityType: 'broker',
    businessRegistrationNumber: '',
    countryOfIncorporation: '',
    taxIdentificationNumber: '',
    totalAUM: '',
    yearsInOperation: '',
    regulatoryLicenses: '',
    
    // Trading requirements
    tradingPlatforms: ['mt5'],
    tradingVolume: 'under_10m',
    instrumentsTraded: ['forex', 'metals'],
    leverageRequirements: '100',
    customLiquidity: false,
    dmaAccess: false,
    collocationNeeded: false,
    
    // Contact information
    primaryContactPerson: {
      name: '',
      position: '',
      email: '',
      phone: ''
    },
    tradingDesk: {
      email: '',
      phone: ''
    },
    technicalContact: {
      name: '',
      email: '',
      phone: ''
    },
    
    // Address information
    businessAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    
    // Compliance
    regulatoryStatus: '',
    amlPolicy: false,
    kycProcedures: false,
    
    // Additional services
    needPrimeBrokerage: false,
    needRiskManagement: false,
    needMarketData: false,
    needReporting: false,
    
    // Terms and agreement
    agreedToTerms: false,
    agreedToDataPolicy: false,
    
    // Company logo
    logo: null
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    if (name === 'instrumentsTraded') {
      const newSelection = [...selectedInstruments];
      if (newSelection.includes(value)) {
        // Remove from selection
        const index = newSelection.indexOf(value);
        newSelection.splice(index, 1);
      } else {
        // Add to selection
        newSelection.push(value);
      }
      setSelectedInstruments(newSelection);
      setFormData(prev => ({
        ...prev,
        [name]: newSelection
      }));
    } else if (name === 'tradingPlatforms') {
      const newSelection = [...selectedPlatforms];
      if (newSelection.includes(value)) {
        // Remove from selection
        const index = newSelection.indexOf(value);
        newSelection.splice(index, 1);
      } else {
        // Add to selection
        newSelection.push(value);
      }
      setSelectedPlatforms(newSelection);
      setFormData(prev => ({
        ...prev,
        [name]: newSelection
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
    
    // Validate trading tab
    else if (currentTab === 2) {
      if (formData.tradingPlatforms.length === 0) {
        toast({
          title: t('error'),
          description: t('tradingPlatformRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (formData.instrumentsTraded.length === 0) {
        toast({
          title: t('error'),
          description: t('instrumentsRequired'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate contact tab
    else if (currentTab === 3) {
      if (!formData.primaryContactPerson.name || !formData.primaryContactPerson.email) {
        toast({
          title: t('error'),
          description: t('primaryContactRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.businessAddress.street || !formData.businessAddress.city || !formData.businessAddress.country) {
        toast({
          title: t('error'),
          description: t('businessAddressRequired'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate terms tab (final tab)
    else if (currentTab === 4) {
      if (!formData.agreedToTerms || !formData.agreedToDataPolicy) {
        toast({
          title: t('error'),
          description: t('mustAgreeToAllTerms'),
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
          platformType: 'bittrade', // Set to BitTrade for institutional trading
          primaryContactPerson: JSON.stringify(formData.primaryContactPerson),
          billingAddress: JSON.stringify(formData.businessAddress),
          operationalAddress: JSON.stringify(formData.businessAddress),
          kycVerified: false,
          amlChecked: false,
          serviceAgreementSigned: false,
          apiAccess: formData.tradingPlatforms.includes('fix_api') || formData.tradingPlatforms.includes('rest_api'),
          supportLevel: formData.tradingVolume === 'over_500m' ? 'enterprise' : 'premium',
          tradingVolume: 0, // Initial value
          customFeePlan: JSON.stringify({
            enabled: true,
            tradingPlatforms: formData.tradingPlatforms,
            instrumentsTraded: formData.instrumentsTraded,
            leverageRequirements: formData.leverageRequirements,
            customLiquidity: formData.customLiquidity,
            dmaAccess: formData.dmaAccess,
            collocationNeeded: formData.collocationNeeded
          }),
          legalDocuments: JSON.stringify({
            regulatoryStatus: formData.regulatoryStatus,
            amlPolicy: formData.amlPolicy,
            kycProcedures: formData.kycProcedures
          }),
          riskProfile: JSON.stringify({
            tradingDesk: formData.tradingDesk,
            technicalContact: formData.technicalContact,
            needPrimeBrokerage: formData.needPrimeBrokerage,
            needRiskManagement: formData.needRiskManagement,
            needMarketData: formData.needMarketData,
            needReporting: formData.needReporting
          }),
          establishedDate: null,
          totalAssets: parseFloat(formData.totalAUM) || 0,
          annualRevenue: 0,
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
        description: t('institutionalTradingRegistrationSubmitted'),
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
      
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">
          {t('institutionalTradingInfo', 'BitTrade offers institutional-grade trading infrastructure with deep liquidity pools and premium support.')}
        </Text>
      </Alert>
      
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
          <FormHelperText>
            {t('passwordRequirements')}
          </FormHelperText>
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
          <FormLabel>{t('entityType')}</FormLabel>
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
          <FormLabel>{t('yearsInOperation')}</FormLabel>
          <Input
            name="yearsInOperation"
            type="number"
            value={formData.yearsInOperation}
            onChange={handleInputChange}
            placeholder={t('enterYears')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('totalAUM')}</FormLabel>
          <InputGroup size="lg">
            <InputLeftAddon>$</InputLeftAddon>
            <Input
              name="totalAUM"
              type="number"
              value={formData.totalAUM}
              onChange={handleInputChange}
              placeholder={t('enterAmount')}
              {...inputStyles}
            />
            <InputRightAddon>USD</InputRightAddon>
          </InputGroup>
          <FormHelperText>
            {t('totalAUMHelper')}
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>{t('regulatoryLicenses')}</FormLabel>
          <Input
            name="regulatoryLicenses"
            value={formData.regulatoryLicenses}
            onChange={handleInputChange}
            placeholder={t('enterLicenses')}
            size="lg"
            {...inputStyles}
          />
          <FormHelperText>
            {t('licensesHelper')}
          </FormHelperText>
        </FormControl>
      </SimpleGrid>

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

  // Tab content - Trading Requirements
  const renderTradingTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaExchangeAlt} mr={2} color={accentColor} />
          {t('tradingRequirements')}
        </Flex>
      </Heading>
      
      <FormControl isRequired>
        <FormLabel>{t('tradingPlatforms')}</FormLabel>
        <Text fontSize="sm" mb={2}>{t('selectAllThatApply')}</Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
          {TRADING_PLATFORMS.map(platform => (
            <Checkbox
              key={platform.value}
              isChecked={selectedPlatforms.includes(platform.value)}
              onChange={() => handleMultiSelectChange('tradingPlatforms', platform.value)}
              colorScheme="blue"
            >
              {platform.label}
            </Checkbox>
          ))}
        </SimpleGrid>
        <FormHelperText>
          {t('tradingPlatformsHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>{t('estimatedMonthlyVolume')}</FormLabel>
        <RadioGroup 
          name="tradingVolume" 
          value={formData.tradingVolume}
          onChange={(value) => setFormData(prev => ({ ...prev, tradingVolume: value }))}
        >
          <Stack direction="column" spacing={3}>
            {TRADING_VOLUME_OPTIONS.map(option => (
              <Radio key={option.value} value={option.value} colorScheme="blue">
                {option.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>{t('instrumentsTraded')}</FormLabel>
        <Text fontSize="sm" mb={2}>{t('selectAllThatApply')}</Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
          {INSTRUMENT_TYPES.map(instrument => (
            <Checkbox
              key={instrument.value}
              isChecked={selectedInstruments.includes(instrument.value)}
              onChange={() => handleMultiSelectChange('instrumentsTraded', instrument.value)}
              colorScheme="blue"
            >
              {instrument.label}
            </Checkbox>
          ))}
        </SimpleGrid>
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('leverageRequirements')}</FormLabel>
          <InputGroup size="lg">
            <Input
              name="leverageRequirements"
              value={formData.leverageRequirements}
              onChange={handleInputChange}
              placeholder="100"
              {...inputStyles}
            />
            <InputRightAddon>:1</InputRightAddon>
          </InputGroup>
          <FormHelperText>
            {t('leverageRequirementsHelper')}
          </FormHelperText>
        </FormControl>
      </SimpleGrid>

      <Divider my={2} />

      <Text fontWeight="medium" mb={2}>{t('additionalRequirements')}</Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}></SimpleGrid>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
        <Checkbox
          name="needPrimeBrokerage"
          isChecked={formData.needPrimeBrokerage}
          onChange={handleCheckboxChange}
          colorScheme="blue"
        >
          {t('needPrimeBrokerage')}
        </Checkbox>
        <Checkbox
          name="needRiskManagement"
          isChecked={formData.needRiskManagement}
          onChange={handleCheckboxChange}
          colorScheme="blue"
        >
          {t('needRiskManagement')}
        </Checkbox>
        <Checkbox
          name="needMarketData"
          isChecked={formData.needMarketData}
          onChange={handleCheckboxChange}
          colorScheme="blue"
        >
          {t('needMarketData')}
        </Checkbox>
        <Checkbox
          name="needReporting"
          isChecked={formData.needReporting}
          onChange={handleCheckboxChange}
          colorScheme="blue"
        >
          {t('needReporting')}
        </Checkbox>
      </SimpleGrid>

      <HStack justify="space-between" pt={4}>
        <Button variant="outline" onClick={prevTab}>
          {t('back')}
        </Button>
        <Button colorScheme="blue" onClick={nextTab}>
          {t('next')}
        </Button>
      </HStack>
    </VStack>
  );

  // Contact Information Tab
  const renderContactTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaUsers} mr={2} color={accentColor} />
          {t('contactInformation')}
        </Flex>
      </Heading>

      <FormControl isRequired>
        <FormLabel>{t('primaryContactName')}</FormLabel>
        <Input
          name="primaryContactPerson.name"
          value={formData.primaryContactPerson.name}
          onChange={(e) =>
            handleNestedInputChange('primaryContactPerson', 'name', e.target.value)
          }
          placeholder={t('enterName')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('primaryContactEmail')}</FormLabel>
          <Input
            name="primaryContactPerson.email"
            type="email"
            value={formData.primaryContactPerson.email}
            onChange={(e) =>
              handleNestedInputChange('primaryContactPerson', 'email', e.target.value)
            }
            placeholder={t('enterEmail')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('primaryContactPhone')}</FormLabel>
          <Input
            name="primaryContactPerson.phone"
            value={formData.primaryContactPerson.phone}
            onChange={(e) =>
              handleNestedInputChange('primaryContactPerson', 'phone', e.target.value)
            }
            placeholder={t('enterPhone')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <FormControl>
        <FormLabel>{t('contactPosition')}</FormLabel>
        <Input
          name="primaryContactPerson.position"
          value={formData.primaryContactPerson.position}
          onChange={(e) =>
            handleNestedInputChange('primaryContactPerson', 'position', e.target.value)
          }
          placeholder={t('enterPosition')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <Heading size="sm" mt={4}>
        {t('businessAddress')}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('street')}</FormLabel>
          <Input
            name="businessAddress.street"
            value={formData.businessAddress.street}
            onChange={(e) =>
              handleNestedInputChange('businessAddress', 'street', e.target.value)
            }
            placeholder={t('enterStreet')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t('city')}</FormLabel>
          <Input
            name="businessAddress.city"
            value={formData.businessAddress.city}
            onChange={(e) =>
              handleNestedInputChange('businessAddress', 'city', e.target.value)
            }
            placeholder={t('enterCity')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('state')}</FormLabel>
          <Input
            name="businessAddress.state"
            value={formData.businessAddress.state}
            onChange={(e) =>
              handleNestedInputChange('businessAddress', 'state', e.target.value)
            }
            placeholder={t('enterState')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t('postalCode')}</FormLabel>
          <Input
            name="businessAddress.postalCode"
            value={formData.businessAddress.postalCode}
            onChange={(e) =>
              handleNestedInputChange('businessAddress', 'postalCode', e.target.value)
            }
            placeholder={t('enterPostalCode')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>
      <FormControl isRequired>
        <FormLabel>{t('country')}</FormLabel>
        <Input
          name="businessAddress.country"
          value={formData.businessAddress.country}
          onChange={(e) =>
            handleNestedInputChange('businessAddress', 'country', e.target.value)
          }
          placeholder={t('enterCountry')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <HStack justify="space-between" pt={4}>
        <Button variant="outline" onClick={prevTab}>
          {t('back')}
        </Button>
        <Button colorScheme="blue" onClick={nextTab}>
          {t('next')}
        </Button>
      </HStack>
    </VStack>
  );

  // Terms and Agreement Tab
  const renderTermsTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaLock} mr={2} color={accentColor} />
          {t('termsAndAgreement')}
        </Flex>
      </Heading>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {t('termsOfService')}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm">{t('termsContent')}</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {t('dataPolicy')}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm">{t('dataPolicyContent')}</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Checkbox
        name="agreedToTerms"
        isChecked={formData.agreedToTerms}
        onChange={handleCheckboxChange}
        colorScheme="blue"
      >
        {t('agreeToTerms')}
      </Checkbox>
      <Checkbox
        name="agreedToDataPolicy"
        isChecked={formData.agreedToDataPolicy}
        onChange={handleCheckboxChange}
        colorScheme="blue"
      >
        {t('agreeToDataPolicy')}
      </Checkbox>

      <HStack justify="space-between" pt={4}>
        <Button variant="outline" onClick={prevTab}>
          {t('back')}
        </Button>
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          {t('submit')}
        </Button>
      </HStack>
    </VStack>
  );

  // Define an accent color based on the current color mode
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Layout>
      <Head>
        <title>{t('instituteSignup')}</title>
      </Head>
      <Box sx={formStyles}>
        <form onSubmit={handleSubmit}>
          {currentTab === 0 && renderAccountTab()}
          {currentTab === 1 && renderCompanyTab()}
          {currentTab === 2 && renderTradingTab()}
          {currentTab === 3 && renderContactTab()}
          {currentTab === 4 && renderTermsTab()}
        </form>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
