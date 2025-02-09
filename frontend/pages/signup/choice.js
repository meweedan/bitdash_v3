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
import { Store, Car, Utensils, Package, User,  DollarSign, UserPlus, Wallet } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const colorChange = keyframes`
  0% { color: #245b84; }    /* Dark Blue-Green */
  14% { color: #36739f; }   /* Medium Blue */
  28% { color: #52a4e1; }   /* Bright Blue */
  42% { color: #67bdfd; }   /* Light Blue */
  56% { color: #70b4e6; }   /* Sky Blue */
  70% { color: #65a6fa; }   /* Electric Blue */
  85% { color: #6a9ce8; }   /* Steel Blue */
  100% { color: #245b84; }  /* Back to Dark Blue-Green */
`;

const borderColorChange = keyframes`
  0% { border-color: rgba(36, 91, 132, 0.3); }
  14% { border-color: rgba(54, 115, 159, 0.3); }
  28% { border-color: rgba(82, 164, 225, 0.3); }
  42% { border-color: rgba(103, 189, 253, 0.3); }
  56% { border-color: rgba(112, 180, 230, 0.3); }
  70% { border-color: rgba(101, 166, 250, 0.3); }
  85% { border-color: rgba(106, 156, 232, 0.3); }
  100% { border-color: rgba(36, 91, 132, 0.3); }
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

const preciousMetalPulse = keyframes`
  0% { 
    background-color: rgba(192, 192, 192, 0.05);
    border-color: rgba(192, 192, 192, 0.2);
  }
  50% { 
    background-color: rgba(212, 175, 55, 0.05);
    border-color: rgba(212, 175, 55, 0.2);
  }
  100% { 
    background-color: rgba(192, 192, 192, 0.05);
    border-color: rgba(192, 192, 192, 0.2);
  }
`;

const AnimatedIcon = styled(Icon)`
  animation: ${colorChange} 10s infinite;
`;

const AnimatedHeading = styled(Heading)`
  animation: ${colorChange} 10s infinite;
`;

const AnimatedButton = styled(Button)`
  background: #245b84;
  color: white;
  animation: ${backgroundColorChange} 10s infinite;
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.2);
  }
`;

const AnimatedBox = styled(Box)`
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
  animation: ${backgroundColorChange} 10s infinite, ${borderColorChange} 10s infinite;
`;

const CustomerBox = styled(Box)`
  padding: 2rem;
  width: 100%;
  border-width: 2px;
  border-radius: var(--chakra-radii-xl);
  box-shadow: var(--chakra-shadows-xl);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--chakra-shadows-dark-lg);
  }
  animation: ${preciousMetalPulse} 8s infinite ease-in-out;
`;

// Update the PLATFORMS configuration
const PLATFORMS = {
  FOOD: {
    subdomain: 'food',
    name: 'BitFood',
    title: 'restaurantOwner',
    description: 'restaurantDescription',
    icon: Store,
    signupPath: '/signup/operator?platform=food'
  },
  AUTO: {
    subdomain: 'auto',
    name: 'BitAuto',
    title: 'autoDealer',
    description: 'autoDealerDescription',
    icon: Car,
    signupPath: '/signup/operator?platform=auto'
  },
  STOCK: {
    subdomain: 'stock',
    name: 'BitStock',
    title: 'inventoryManager',
    description: 'inventoryDescription',
    icon: Package,
    signupPath: '/signup/operator?platform=stock'
  },
  CASH: {
    subdomain: 'cash',
    name: 'BitCash',
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
  const [currentPlatform, setCurrentPlatform] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = getPlatformFromHostname(window.location.hostname);
      setCurrentPlatform(platform);
    }
  }, []);

  const renderOperatorCard = (platform) => (
  <AnimatedBox>
    <VStack spacing={4}>
      <AnimatedIcon as={platform.icon} boxSize={10} />
      <AnimatedHeading size="md">
        {t(platform.title)}
      </AnimatedHeading>
      <Text 
        textAlign="center" 
        color={isDark ? 'whiteAlpha.700' : 'gray.600'}
        fontSize="sm"
      >
        {t(platform.description)}
      </Text>
      <AnimatedButton
        size="lg"
        width="100%"
        onClick={() => router.push(platform.signupPath)}
      >
        {t('businessSignup')}
      </AnimatedButton>
    </VStack>
  </AnimatedBox>
);

const renderPlatformOptions = (platform) => {
  if (platform.options) {
    // Render BitCash specific options
    return (
      <VStack spacing={6} width="full">
        <AnimatedHeading size="lg" textAlign="center">
          {t('chooseAccountType')}
        </AnimatedHeading>
        
        {platform.options.map((option) => (
          <AnimatedBox 
            key={option.type}
            onClick={() => router.push(option.signupPath)}
          >
            <HStack spacing={4}>
              <AnimatedIcon as={option.icon} boxSize={10} />
              <VStack spacing={2}>
                <AnimatedHeading size="md">
                  {t(option.title)}
                </AnimatedHeading>
                <Badge colorScheme="blue">
                  {option.commission} {t('commission')}
                </Badge>
              </VStack>
              <Text 
                textAlign="center" 
                color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                fontSize="sm"
              >
                {t(option.description)}
              </Text>
              <AnimatedButton
                size="lg"
                width="100%"
              >
                {t('getStarted')}
              </AnimatedButton>
            </HStack>
          </AnimatedBox>
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
            <AnimatedHeading
              textAlign="center"
              size="xl"
            >
              {currentPlatform 
                ? t('joinPlatform', { name: currentPlatform.name })
                : t('choosePlatform')}
            </AnimatedHeading>

            {/* Platform Options Section */}
            {currentPlatform && (
              <Box w="full">
                {renderPlatformOptions(currentPlatform)}
              </Box>
            )}

            <Divider borderColor={isDark ? 'whiteAlpha.300' : 'gray.200'} />

            {/* Customer Section */}
            <CustomerBox
              onClick={() => router.push('/signup/customer')}
            >
              <VStack spacing={4}>
                <Icon 
                  as={User} 
                  boxSize={10}
                  color={isDark ? 'whiteAlpha.900' : 'gray.700'}
                />
                <Heading size="md" color={isDark ? 'white' : 'gray.800'}>
                  {t('customerSignup')}
                </Heading>
                <Text 
                  textAlign="center" 
                  color={isDark ? 'whiteAlpha.700' : 'gray.600'}
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
            </CustomerBox>

            <Text fontSize="sm" color={isDark ? 'whiteAlpha.700' : 'gray.500'}>
              {t('haveAccount')}{' '}
              <Button
                variant="link"
                color="blue.400"
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
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}