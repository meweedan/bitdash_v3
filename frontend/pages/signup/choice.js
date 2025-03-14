import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useColorMode,
  Container,
  Flex,
  Icon,
  Badge,
  Divider,
  Circle,
  SimpleGrid,
  Center,
  useBreakpointValue
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { 
  DollarSign, 
  Users,
  User, 
  Building, 
  Briefcase, 
  LineChart, 
  BarChart2, 
  TrendingUp,
  Globe,
  UserPlus,
  Store,
  ShieldCheck,
  CreditCard,
  Wallet,
  HandCoins,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaUniversity, 
  FaExchangeAlt, 
  FaUserTie, 
  FaUserPlus, 
  FaBuilding,
  FaHandshake,
  FaStore,
  FaCreditCard,
  FaChartBar,
  FaGlobeAmericas,
  FaBriefcase
} from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Animation keyframes
const backgroundColorChange = keyframes`
  0% { background-color: rgba(36, 91, 132, 0.05); }
  14% { background-color: rgba(54, 115, 159, 0.05); }
  28% { background-color: rgba(82, 164, 225, 0.05); }
  42% { background-color: rgba(103, 189, 253, 0.05); }
  56% { background-color: rgba(112, 180, 230, 0.05); }
  70% { background-color: rgba(101, 166, 250, 0.05); }
  85% { background-color: rgba(106, 156, 232, 0.05); }
  100% { background-color: rgba(36, 91, 132, 0.05); }
`;

// Styled components - increased size
const PlatformBox = styled(Box)`
  padding: 2.5rem;
  width: 100%;
  border-width: 2px;
  border-radius: var(--chakra-radii-xl);
  box-shadow: var(--chakra-shadows-lg);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--chakra-shadows-xl);
  }
`;

// Updated platforms with fintech focus - using i18n keys
const PLATFORMS = {
  ADFAALY: {
    subdomain: 'adfaaly',
    name: 'Adfaaly',
    nameKey: 'adfaaly.name',
    themeKey: 'adfaaly',
    title: 'Digital Payment Solutions',
    titleKey: 'adfaaly.title',
    description: 'Streamlined payment processing and financial services for businesses and individuals.',
    descriptionKey: 'adfaaly.description',
    icon: FaMoneyBillWave,
    options: [
      {
        type: 'merchant',
        title: 'Business Account',
        titleKey: 'adfaaly.merchant.title',
        description: 'Accept payments, manage transactions, and access financial tools for your business.',
        descriptionKey: 'adfaaly.merchant.description',
        icon: FaStore,
        signupPath: '/signup/merchant',
      },
      {
        type: 'agent',
        title: 'Payment Agent',
        titleKey: 'adfaaly.agent.title',
        description: 'Facilitate payments and earn commission on processed transactions.',
        descriptionKey: 'adfaaly.agent.description',
        icon: FaHandshake,
        signupPath: '/signup/agent',
      },
      {
        type: 'customer',
        title: 'Customer Account',
        titleKey: 'adfaaly.customer.title',
        description: 'Send and receive money instantly with low fees and global coverage.',
        descriptionKey: 'adfaaly.customer.description',
        icon: FaUserTie,
        signupPath: '/signup/customer'
      }
    ]
  },
  BSORAA: {
    subdomain: 'bsoraa',
    name: 'Bsoraa',
    nameKey: 'bsoraa.name',
    themeKey: 'bsoraa',
    title: 'Your cravings courier',
    titleKey: 'bsoraa.title',
    description: 'Gain access to a whole new world of food ordering, whether its in person or at the comfort of your home.',
    descriptionKey: 'bsoraa.description',
    icon: FaExchangeAlt,
    options: [
      {
        type: 'captain',
        title: 'Captain',
        titleKey: 'bsoraa.captain.title',
        description: 'Help us deliver to our customer and gain competitive rates and amazing perks.',
        descriptionKey: 'bsoraa.captain.description',
        icon: FaUserTie,
        signupPath: '/signup/captain',
      },
      {
        type: 'customer',
        title: 'Customer',
        titleKey: 'bsoraa.customer.title',
        description: 'Order all of your favs, discover new cravings and get those groceries you need instantly!',
        descriptionKey: 'bsoraa.customer.description',
        icon: FaUserTie,
        signupPath: '/signup/customer',
      },
      {
        type: 'operator',
        title: 'Operator',
        titleKey: 'bsoraa.operator.title',
        description: 'List your business on Bsoraa and gain more customers and give your old ones access to their fav cravings!',
        descriptionKey: 'bsoraa.operator.description',
        icon: FaHandshake,
        signupPath: '/signup/operator',
      }
    ]
  }
};

const getPlatformFromHostname = (hostname) => {
  if (!hostname) return null;
  const subdomain = hostname.split('.')[0];
  return Object.values(PLATFORMS).find(p => p.subdomain === subdomain) || null;
};

export default function SignupChoice() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const isRTL = router.locale === 'ar';
  
  // Adjust sizes for different screen sizes
  const boxPadding = useBreakpointValue({ base: 5, md: 8 });
  const circleSizeLarge = useBreakpointValue({ base: "70px", md: "90px" });
  const circleSizeMedium = useBreakpointValue({ base: "50px", md: "65px" });
  const iconSizeLarge = useBreakpointValue({ base: 6, md: 8 });
  const iconSizeMedium = useBreakpointValue({ base: 5, md: 6 });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const subheadingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = getPlatformFromHostname(window.location.hostname);
      setCurrentPlatform(platform);
      
      // If platform specified in query, use that
      if (router.query.platform) {
        const platformFromQuery = Object.values(PLATFORMS).find(
          p => p.subdomain.toLowerCase() === router.query.platform.toLowerCase()
        );
        if (platformFromQuery) {
          setCurrentPlatform(platformFromQuery);
        }
      }
    }
  }, [router.query]);

  const AccountTypeCard = ({ option, platform }) => (
    <PlatformBox 
      borderColor={`brand.${platform.themeKey}.400`}
      p={boxPadding}
      _hover={{ 
        borderColor: `brand.${platform.themeKey}.500`,
        bg: isDark ? 'whiteAlpha.200' : `brand.${platform.themeKey}.50`
      }}
      onClick={() => router.push(option.signupPath)}
      textAlign={isRTL ? 'right' : 'left'}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <VStack spacing={6} align={isRTL ? 'flex-end' : 'flex-start'}>
        <HStack spacing={4} width="full">
          <Circle 
            size={circleSizeMedium}
            bg={`brand.${platform.themeKey}.100`}
            color={`brand.${platform.themeKey}.500`}
            order={isRTL ? 2 : 1}
          >
            <Icon as={option.icon} boxSize={iconSizeMedium} />
          </Circle>
          
          <VStack 
            align={isRTL ? 'flex-end' : 'flex-start'} 
            spacing={1}
            flex="1"
            order={isRTL ? 1 : 2}
          >
            <Heading 
              size={subheadingSize}
              color={isDark ? 'white' : 'gray.800'}
            >
              {t(option.titleKey, option.title)}
            </Heading>
            
            <HStack spacing={2} flexWrap="wrap" justify={isRTL ? 'flex-end' : 'flex-start'}>
              {option.commission && (
                <Badge colorScheme={platform.themeKey} mt={1} px={2} py={1} fontSize={textSize}>
                  {t('commission', 'Commission')}: {option.commission}
                </Badge>
              )}
              
              {option.minDeposit && (
                <Badge colorScheme={platform.themeKey} mt={1} px={2} py={1} fontSize={textSize}>
                  {t('minDeposit', 'Min Deposit')}: {option.minDeposit}
                </Badge>
              )}
              
              {option.accounts && (
                <Badge colorScheme={platform.themeKey} mt={1} px={2} py={1} fontSize={textSize}>
                  {option.accounts}
                </Badge>
              )}
              
              {option.accountTypes && (
                <Badge colorScheme={platform.themeKey} mt={1} px={2} py={1} fontSize={textSize}>
                  {option.accountTypes}
                </Badge>
              )}
              
              {option.minInvestment && (
                <Badge colorScheme={platform.themeKey} mt={1} px={2} py={1} fontSize={textSize}>
                  {t('minInvestment', 'Min Investment')}: {option.minInvestment}
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
        
        <Text fontSize={textSize} color={isDark ? 'gray.300' : 'gray.600'}>
          {t(option.descriptionKey, option.description)}
        </Text>
        
        <Button
          variant={`${platform.themeKey}-solid`}
          alignSelf={isRTL ? 'flex-start' : 'flex-end'}
          rightIcon={<Icon as={isRTL ? ArrowLeft : ArrowRight} />}
          size="lg"
          px={6}
          py={6}
        >
          {t('getStarted', 'Get Started')}
        </Button>
      </VStack>
    </PlatformBox>
  );

  const PlatformSelection = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
      {Object.values(PLATFORMS).map((platform) => (
        <PlatformBox 
          key={platform.subdomain}
          borderColor={`brand.${platform.themeKey}.400`}
          bg={isDark ? 'whiteAlpha.100' : 'white'}
          p={boxPadding}
          _hover={{ 
            borderColor: `brand.${platform.themeKey}.500`,
            bg: isDark ? 'whiteAlpha.200' : `brand.${platform.themeKey}.50`
          }}
          onClick={() => window.location.href = `https://${platform.subdomain}.bitdash.app/signup/choice`}
          textAlign={isRTL ? 'right' : 'left'}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <HStack spacing={6} align="center">
            <Circle
              size={circleSizeMedium}
              bg={`brand.${platform.themeKey}.100`}
              color={`brand.${platform.themeKey}.500`}
              order={isRTL ? 2 : 1}
            >
              <Icon as={platform.icon} boxSize={iconSizeMedium} />
            </Circle>
            
            <VStack 
              align={isRTL ? 'flex-end' : 'flex-start'} 
              spacing={2}
              flex="1"
              order={isRTL ? 1 : 2}
            >
              <Heading size={subheadingSize} color={isDark ? 'white' : 'gray.800'}>
                {t(platform.nameKey, platform.name)}
              </Heading>
              <Text fontSize={textSize} color={isDark ? 'gray.300' : 'gray.600'}>
                {t(platform.titleKey, platform.title)}
              </Text>
            </VStack>
          </HStack>
        </PlatformBox>
      ))}
    </SimpleGrid>
  );

  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container maxW={currentPlatform ? "2xl" : "2xl"} centerContent>
          <VStack spacing={4} w="full">
            {/* Header */}
            <VStack spacing={6}>
              {currentPlatform ? (
                <>
                </>
              ) : (
                <>
                  <Heading
                    textAlign="center"
                    size={headingSize}
                    p={8}
                    color={currentPlatform ? 'brand.bitdash.400' : 'brand.bitdash.700'}
                  >
                    {t('choosePlatform', 'Choose Your Financial Platform')}
                  </Heading>
                </>
              )}
            </VStack>

            {/* Platform Selection */}
            {!currentPlatform && <PlatformSelection />}

            {/* Account Type Selection */}
            {currentPlatform && (
              <VStack spacing={8} w="full">
                <Heading
                  size="md"
                  color={isDark ? 'gray.300' : 'gray.600'}
                  textAlign="center"
                >
                  {t('chooseAccountType', 'Select Your Account Type')}
                </Heading>
                
                <SimpleGrid 
                  columns={currentPlatform.subdomain === 'bsoraa' ? 1 : { base: 1, lg: currentPlatform.options.length > 2 ? 3 : 2 }}
                  spacing={8} 
                  w="full"
                  justifyItems="center"
                >
                  {currentPlatform.options.map((option) => (
                    <AccountTypeCard 
                      key={option.type} 
                      option={option} 
                      platform={currentPlatform} 
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* Login Link */}
            <HStack spacing={2} mb={8}>
              <Text 
                fontSize={textSize} 
                color={isDark ? 'gray.400' : 'gray.600'}
              >
                {t('haveAccount', 'Already have an account?')}
              </Text>
              <Button
                variant="link"
                color={currentPlatform ? 'brand.bitdash.400' : 'brand.bitdash.700'}
                onClick={() => router.push('/login')}
                fontSize={textSize}
              >
                {t('login', 'Log In')}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ locale, query }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
