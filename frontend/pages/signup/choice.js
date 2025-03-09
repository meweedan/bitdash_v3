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
  CASH: {
    subdomain: 'cash',
    name: 'Cash by BitDash',
    nameKey: 'cash.name',
    themeKey: 'bitcash',
    title: 'Digital Payment Solutions',
    titleKey: 'bitcash.title',
    description: 'Streamlined payment processing and financial services for businesses and individuals.',
    descriptionKey: 'bitcash.description',
    icon: FaMoneyBillWave,
    options: [
      {
        type: 'merchant',
        title: 'Business Account',
        titleKey: 'bitcash.merchant.title',
        description: 'Accept payments, manage transactions, and access financial tools for your business.',
        descriptionKey: 'bitcash.merchant.description',
        icon: FaStore,
        signupPath: '/signup/merchant',
      },
      {
        type: 'agent',
        title: 'Payment Agent',
        titleKey: 'bitcash.agent.title',
        description: 'Facilitate payments and earn commission on processed transactions.',
        descriptionKey: 'bitcash.agent.description',
        icon: FaHandshake,
        signupPath: '/signup/agent',
      },
      {
        type: 'customer',
        title: 'Customer Account',
        titleKey: 'bitcash.customer.title',
        description: 'Send and receive money instantly with low fees and global coverage.',
        descriptionKey: 'bitcash.customer.description',
        icon: FaUserTie,
        signupPath: '/signup/customer'
      }
    ]
  },
  CRYPTO: {
    subdomain: 'crypto',
    name: 'Crypto by BitDash',
    nameKey: 'crypto.name',
    themeKey: 'bitfund',
    title: 'Crypto exchange and marketplace',
    titleKey: 'bitfund.title',
    description: 'Performance-based funding for skilled traders with comprehensive evaluation.',
    descriptionKey: 'bitfund.description',
    icon: FaChartLine,
    options: [
      {
        type: 'trader',
        title: 'Challenge Account',
        titleKey: 'bitfund.trader.title',
        description: 'Prove your trading skill and get funded up to $200,000 with our evaluation process.',
        descriptionKey: 'bitfund.trader.description',
        icon: FaChartBar,
        signupPath: '/signup/challenger',
      }
    ]
  },
  STOCK: {
    subdomain: 'stock',
    name: 'Stock by BitDash',
    nameKey: 'bitstock.name',
    themeKey: 'bitstock',
    title: 'Global Investment Platform',
    titleKey: 'bitstock.title',
    description: 'Access US and EU markets, private assets, commodities, and more from MENA and GCC regions.',
    descriptionKey: 'bitstock.description',
    icon: FaUniversity,
    options: [
      {
        type: 'individual',
        title: 'Individual Investor',
        titleKey: 'bitstock.individual.title',
        description: 'Invest in global markets with access to stocks, ETFs, and alternative assets.',
        descriptionKey: 'bitstock.individual.description',
        icon: FaUserTie,
        signupPath: '/signup/individual',
      },
      {
        type: 'institutional',
        title: 'Institutional Account',
        titleKey: 'bitstock.institutional.title',
        description: 'Customized investment solutions for funds, family offices, and corporations.',
        descriptionKey: 'bitstock.institutional.description',
        icon: FaBuilding,
        signupPath: '/signup/institutional',
      }
    ]
  },
  LDN: {
    subdomain: 'ldn',
    name: 'LDN Prime Marketsh',
    nameKey: 'forex.name',
    themeKey: 'ldn',
    title: 'Regulated Forex Broker',
    titleKey: 'bittrade.title',
    description: 'Professional trading platform for forex, cryptocurrencies and commodities with institutional liquidity.',
    descriptionKey: 'bittrade.description',
    icon: FaExchangeAlt,
    options: [
      {
        type: 'retail',
        title: 'Retail Trader',
        titleKey: 'bittrade.retail.title',
        description: 'Trade forex, crypto, indices and commodity CFDs with competitive spreads and high leverage.',
        descriptionKey: 'bittrade.retail.description',
        icon: FaUserTie,
        signupPath: '/signup/trader',
      },
      {
        type: 'introducing-broker',
        title: 'Introducing Broker',
        titleKey: 'bittrade.ib.title',
        description: 'Refer clients and earn ongoing commissions on their trading activity.',
        descriptionKey: 'bittrade.ib.description',
        icon: FaHandshake,
        signupPath: '/signup/ib',
      },
      {
        type: 'institutional',
        title: 'Institutional Trading',
        titleKey: 'bittrade.institutional.title',
        description: 'Access deep liquidity pools, prime brokerage services, and custom API solutions.',
        descriptionKey: 'bittrade.institutional.description',
        icon: FaBuilding,
        signupPath: '/signup/institute',
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
        <Container maxW={currentPlatform ? "5xl" : "2xl"} centerContent>
          <VStack spacing={12} w="full">
            {/* Header */}
            <VStack spacing={6}>
              {currentPlatform ? (
                <>
                  <Circle
                    size={circleSizeLarge}
                    bg={isDark ? `brand.${currentPlatform.themeKey}.900` : `brand.${currentPlatform.themeKey}.100`}
                    color={`brand.${currentPlatform.themeKey}.500`}
                  >
                    <Icon as={currentPlatform.icon} boxSize={iconSizeLarge} />
                  </Circle>
                  
                  <Heading
                    textAlign="center"
                    size={headingSize}
                    bgGradient={`linear(to-r, brand.${currentPlatform.themeKey}.400, brand.${currentPlatform.themeKey}.600)`}
                    bgClip="text"
                  >
                    {t('joinPlatform', { name: t(currentPlatform.nameKey, currentPlatform.name) })}
                  </Heading>
                  
                  <Text 
                    textAlign="center" 
                    color={isDark ? 'gray.300' : 'gray.600'}
                    maxW="2xl"
                    fontSize={textSize}
                  >
                    {t(currentPlatform.descriptionKey, currentPlatform.description)}
                  </Text>
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
                  columns={currentPlatform.subdomain === 'crypto' ? 1 : { base: 1, lg: currentPlatform.options.length > 2 ? 3 : 2 }}
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
