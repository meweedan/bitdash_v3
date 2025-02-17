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
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Store, Car, Utensils, Package, User, DollarSign, UserPlus, Wallet, CarFront, User2Icon, CarTaxiFront } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Reuse existing animations
const colorChange = keyframes`
  0% { color: #245b84; }
  14% { color: #36739f; }
  28% { color: #52a4e1; }
  42% { color: #67bdfd; }
  56% { color: #70b4e6; }
  70% { color: #65a6fa; }
  85% { color: #6a9ce8; }
  100% { color: #245b84; }
`;

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

// Modify this to use Chakra UI theme variants
const PlatformBox = styled(Box)`
  padding: 2rem;
  width: 100%;
  border-width: 5px;
  border-radius: var(--chakra-radii-xl);
  box-shadow: var(--chakra-shadows-xl);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--chakra-shadows-dark-lg);
  }
  animation: ${backgroundColorChange} 10s infinite;
`;

const PLATFORMS = {
  FOOD: {
    subdomain: 'food',
    name: 'BitFood',
    themeKey: 'bitfood',
    title: 'restaurantOwner',
    description: 'restaurantDescription',
    icon: Store,
    signupPath: '/signup/operator?platform=food'
  },
  RIDE: {
    subdomain: 'ride',
    name: 'BitRide',
    themeKey: 'bitride',
    icon: CarFront,
    options: [
      {
        type: 'captain',
        title: 'captainSignup',
        icon: CarTaxiFront,
        signupPath: '/signup/captain'
      },
      {
        type: 'rider',
        title: 'rider',
        icon: User,
        signupPath: '/signup/customer',
      }
    ]
  },
  SHOP: {
    subdomain: 'shop',
    name: 'BitShop',
    themeKey: 'bitshop',
    icon: Store,
    options: [
      {
        type: 'shop',
        title: 'shopSignup',
        icon: Store,
        signupPath: '/signup/owner'
      },
      {
        type: 'customer',
        title: 'customer',
        icon: User,
        signupPath: '/signup/customer'
      }
    ]
  },
  CASH: {
    subdomain: 'cash',
    name: 'BitCash',
    themeKey: 'bitcash',
    icon: DollarSign,
    options: [
      {
        type: 'agent',
        title: 'agentSignup',
        icon: UserPlus,
        signupPath: '/signup/agent',
        commission: '1%'
      },
      {
        type: 'merchant',
        title: 'merchant',
        icon: Store,
        signupPath: '/signup/merchant',
        commission: '1.5%'
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
  const [platform, setPlatform] = useState('bitdash');
  const accentColor = `brand.${platform}.500`;
  const [currentPlatform, setCurrentPlatform] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = getPlatformFromHostname(window.location.hostname);
      setCurrentPlatform(platform);
    }
  }, []);

  const renderOperatorCard = (platform) => (
    <PlatformBox 
      borderColor={`brand.${platform.themeKey}.500`}
      _hover={{ 
        borderColor: `brand.${platform.themeKey}.600` 
      }}
    >
      <VStack spacing={4}>
        <Icon as={platform.icon} boxSize={10} color={`brand.${platform.themeKey}.500`} />
        <Heading 
          size="md" 
          color={`brand.${platform.themeKey}.500`}
        >
          {t(platform.title)}
        </Heading>
        <Text 
          textAlign="center" 
          color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
          fontSize="sm"
        >
          {t(platform.description)}
        </Text>
        <Button
          size="lg"
          width="100%"
          variant={`${platform.themeKey}-solid`}
          onClick={() => router.push(platform.signupPath)}
        >
          {t('businessSignup')}
        </Button>
      </VStack>
    </PlatformBox>
  );

  const renderPlatformOptions = (platform) => {
    if (platform.options) {
      return (
        <VStack spacing={6} width="full">
          <Heading 
            size="lg" 
            textAlign="center" 
            color={`brand.${platform.themeKey}.500`}
          >
            {t('chooseAccountType')}
          </Heading>
          
          {platform.options.map((option) => (
            <PlatformBox 
              key={option.type}
              borderColor={`brand.${platform.themeKey}.500`}
              _hover={{ 
                borderColor: `brand.${platform.themeKey}.600` 
              }}
              onClick={() => router.push(option.signupPath)}
            >
              <HStack spacing={4} align="center">
                <Icon 
                  as={option.icon} 
                  boxSize={10} 
                  color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                />
                <VStack spacing={2} flex={1}>
                  <Heading 
                    size="md" 
                    color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                  >
                    {t(option.title)}
                  </Heading>
                  {option.commission && (
                    <Badge colorScheme={platform.themeKey}>
                      {option.commission} {t('commission')}
                    </Badge>
                  )}
                </VStack>
                <Button
                  variant={`${platform.themeKey}-solid`}
                  size="lg"
                >
                  {t('getStarted')}
                </Button>
              </HStack>
            </PlatformBox>
          ))}
        </VStack>
      );
    }
    return renderOperatorCard(platform);
  };

  return (
    <Layout>
      <Flex
        minH="85vh"
        align="center"
        justify="center"
      >
        <Container maxW="xl" centerContent>
          <VStack spacing={12} w="full">
            <Heading
              textAlign="center"
              size="xl"
              color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
            >
              {currentPlatform 
                ? t('joinPlatform', { name: currentPlatform.name })
                : t('choosePlatform')}
            </Heading>

            {/* Platform Options Section */}
            {currentPlatform && (
              <Box w="full">
                {renderPlatformOptions(currentPlatform)}
              </Box>
            )}

            <Divider borderColor={isDark ? 'whiteAlpha.300' : 'gray.200'} />

            {/* Customer Section */}
            <PlatformBox
              borderColor="gray.500"
              _hover={{ 
                borderColor: 'gray.600' 
              }}
              onClick={() => router.push('/signup/customer')}
            >
              <VStack spacing={4}>
                <Icon 
                  as={User} 
                  boxSize={10}
                  color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                />
                <Heading 
                  size="md" 
                  color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                >
                  {t('customerSignup')}
                </Heading>
                <Text 
                  textAlign="center" 
                  color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                  fontSize="sm"
                >
                  {t('customerDescription')}
                </Text>
                <Button
                  size="lg"
                  width="100%"
                  variant="outline"
                  borderWidth="1px"
                  _hover={{
                    transform: 'translateY(-2px)',
                    bg: isDark ? 'whiteAlpha.100' : 'gray.50'
                  }}
                >
                  {t('createCustomerAccount')}
                </Button>
              </VStack>
            </PlatformBox>

            <Text 
              fontSize="sm" 
              color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
            >
              {t('haveAccount')}{' '}
              <Button
                variant="link"
                color={currentPlatform ? `brand.${currentPlatform.themeKey}.500` : 'gray.500'}
                onClick={() => router.push('/login')}
              >
                {t('login')}
              </Button>
            </Text>
          </VStack>
        </Container>
      </Flex>
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