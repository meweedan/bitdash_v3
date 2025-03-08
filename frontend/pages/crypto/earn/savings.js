import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Progress,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Switch,
  Skeleton,
  Image,
  Link
} from '@chakra-ui/react';
import { InfoIcon, CheckIcon, ChevronRightIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaBitcoin, FaEthereum, FaPercentage, FaLock, FaUnlock, FaHistory, FaPiggyBank, FaSeedling, FaLayerGroup } from 'react-icons/fa';
import Head from 'next/head';
import NextLink from 'next/link';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'crypto'])),
    },
  };
}

export default function CryptoEarn() {
  const { t, i18n } = useTranslation(['common', 'crypto']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  const MotionBox = motion(Box);
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const cardColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  
  // State for API data, loading, and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stakingOptions, setStakingOptions] = useState([]);
  const [yieldFarmingOptions, setYieldFarmingOptions] = useState([]);
  const [savingsOptions, setSavingsOptions] = useState([]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Modals state
  const { isOpen: isStakeModalOpen, onOpen: onStakeModalOpen, onClose: onStakeModalClose } = useDisclosure();
  const { isOpen: isYieldModalOpen, onOpen: onYieldModalOpen, onClose: onYieldModalClose } = useDisclosure();
  const { isOpen: isSavingsModalOpen, onOpen: onSavingsModalOpen, onClose: onSavingsModalClose } = useDisclosure();
  
  // Selected asset state
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Form state for modal inputs
  const [stakeAmount, setStakeAmount] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [autoCompound, setAutoCompound] = useState(true);

  // Parallax component
  const ParallaxBox = ({ children, offset = 100, ...rest }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    
    return (
      <MotionBox
        ref={ref}
        style={{ y }}
        {...rest}
      >
        {children}
      </MotionBox>
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch data from your API
        // For example: const response = await fetch('/api/crypto/earn-options');
        
        // Simulated data
        const stakingData = [
          {
            id: 'btc-staking',
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: '/crypto/icons/btc.png',
            apy: 4.5,
            lockPeriod: 30, // days
            minAmount: 0.01,
            totalStaked: 1250,
            stakedValue: '$38,750,000',
            userStaked: 0.05,
            userStakedValue: '$1,550',
            rewards: 0.00056,
            rewardsValue: '$17.36'
          },
          {
            id: 'eth-staking',
            name: 'Ethereum',
            symbol: 'ETH',
            icon: '/crypto/icons/eth.png',
            apy: 5.8,
            lockPeriod: 90, // days
            minAmount: 0.1,
            totalStaked: 12500,
            stakedValue: '$23,125,000',
            userStaked: 0.75,
            userStakedValue: '$1,387.50',
            rewards: 0.00923,
            rewardsValue: '$17.07'
          },
          {
            id: 'sol-staking',
            name: 'Solana',
            symbol: 'SOL',
            icon: '/crypto/icons/sol.png',
            apy: 7.2,
            lockPeriod: 60, // days
            minAmount: 1,
            totalStaked: 25000,
            stakedValue: '$1,475,000',
            userStaked: 0,
            userStakedValue: '$0',
            rewards: 0,
            rewardsValue: '$0'
          },
          {
            id: 'dot-staking',
            name: 'Polkadot',
            symbol: 'DOT',
            icon: '/crypto/icons/dot.png',
            apy: 12.0,
            lockPeriod: 120, // days
            minAmount: 5,
            totalStaked: 180000,
            stakedValue: '$1,260,000',
            userStaked: 0,
            userStakedValue: '$0',
            rewards: 0,
            rewardsValue: '$0'
          },
          {
            id: 'ada-staking',
            name: 'Cardano',
            symbol: 'ADA',
            icon: '/crypto/icons/ada.png',
            apy: 5.2,
            lockPeriod: 0, // no lock period
            minAmount: 100,
            totalStaked: 15000000,
            stakedValue: '$6,300,000',
            userStaked: 250,
            userStakedValue: '$105',
            rewards: 2.71,
            rewardsValue: '$1.14'
          }
        ];
        
        const yieldFarmingData = [
          {
            id: 'btc-eth-lp',
            name: 'BTC-ETH LP',
            symbols: ['BTC', 'ETH'],
            icons: ['/crypto/icons/btc.png', '/crypto/icons/eth.png'],
            apy: 18.5,
            lockPeriod: 0, // no lock
            platform: 'UniSwap',
            risk: 'Medium',
            tvl: '$12,450,000',
            userProvided: '$0',
            rewards: {
              token: 'UNI',
              earned: 0,
              value: '$0'
            }
          },
          {
            id: 'eth-usdt-lp',
            name: 'ETH-USDT LP',
            symbols: ['ETH', 'USDT'],
            icons: ['/crypto/icons/eth.png', '/crypto/icons/usdt.png'],
            apy: 24.3,
            lockPeriod: 0, // no lock
            platform: 'SushiSwap',
            risk: 'Medium-High',
            tvl: '$8,320,000',
            userProvided: '$100',
            rewards: {
              token: 'SUSHI',
              earned: 3.2,
              value: '$7.42'
            }
          },
          {
            id: 'bnb-busd-lp',
            name: 'BNB-BUSD LP',
            symbols: ['BNB', 'BUSD'],
            icons: ['/crypto/icons/bnb.png', '/crypto/icons/busd.png'],
            apy: 15.7,
            lockPeriod: 0, // no lock
            platform: 'PancakeSwap',
            risk: 'Low',
            tvl: '$23,750,000',
            userProvided: '$0',
            rewards: {
              token: 'CAKE',
              earned: 0,
              value: '$0'
            }
          }
        ];
        
        const savingsData = [
          {
            id: 'btc-savings',
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: '/crypto/icons/btc.png',
            apy: 2.8,
            flexible: true,
            minAmount: 0.001,
            totalDeposited: '$42,350,000',
            userDeposited: 0.02,
            userDepositedValue: '$620',
            interest: 0.00011,
            interestValue: '$3.41'
          },
          {
            id: 'usdt-savings',
            name: 'Tether',
            symbol: 'USDT',
            icon: '/crypto/icons/usdt.png',
            apy: 8.5,
            flexible: false,
            lockPeriod: 90, // days
            minAmount: 100,
            totalDeposited: '$56,780,000',
            userDeposited: 500,
            userDepositedValue: '$500',
            interest: 9.32,
            interestValue: '$9.32'
          },
          {
            id: 'usdc-savings',
            name: 'USD Coin',
            symbol: 'USDC',
            icon: '/crypto/icons/usdc.png',
            apy: 8.2,
            flexible: false,
            lockPeriod: 60, // days
            minAmount: 100,
            totalDeposited: '$48,120,000',
            userDeposited: 0,
            userDepositedValue: '$0',
            interest: 0,
            interestValue: '$0'
          },
          {
            id: 'eth-savings',
            name: 'Ethereum',
            symbol: 'ETH',
            icon: '/crypto/icons/eth.png',
            apy: 2.5,
            flexible: true,
            minAmount: 0.01,
            totalDeposited: '$29,450,000',
            userDeposited: 0,
            userDepositedValue: '$0',
            interest: 0,
            interestValue: '$0'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setStakingOptions(stakingData);
          setYieldFarmingOptions(yieldFarmingData);
          setSavingsOptions(savingsData);
          setLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error('Error fetching earn options:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle opening stake modal
  const handleOpenStakeModal = (asset) => {
    setSelectedAsset(asset);
    onStakeModalOpen();
  };
  
  // Handle opening yield farming modal
  const handleOpenYieldModal = (asset) => {
    setSelectedAsset(asset);
    onYieldModalOpen();
  };
  
  // Handle opening savings modal
  const handleOpenSavingsModal = (asset) => {
    setSelectedAsset(asset);
    onSavingsModalOpen();
  };
  
  // Submit staking
  const handleStakeSubmit = () => {
    // In a real implementation, you would submit to your API
    // For example: await fetch('/api/crypto/stake', { method: 'POST', body: JSON.stringify({ ... }) });
    
    // Close modal after submission
    onStakeModalClose();
    setStakeAmount('');
  };
  
  // Submit LP provision
  const handleYieldSubmit = () => {
    // In a real implementation, you would submit to your API
    onYieldModalClose();
    setLpAmount('');
  };
  
  // Submit savings deposit
  const handleSavingsSubmit = () => {
    // In a real implementation, you would submit to your API
    onSavingsModalClose();
    setSavingsAmount('');
  };
  
  return (
    <>
      <Head>
        <title>{t('crypto:earnPageTitle', 'Earn Crypto | Staking, Yield Farming & Savings | BitDash')}</title>
        <meta 
          name="description" 
          content={t('crypto:earnMetaDescription', 'Earn passive income on your cryptocurrency holdings with BitDash\'s staking, yield farming, and savings products. Get competitive APYs on Bitcoin, Ethereum, and more.')}
        />
      </Head>
      <Layout>
      <Box w="full" minH="100vh">
        {/* Hero Section */}
        <Box 
          py={12}
          position="relative"
          overflow="hidden"
        > 
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack spacing={8} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                <Heading 
                  as="h1" 
                  size={headingSize} 
                  fontWeight="bold"
                  bgGradient={isDark ? 
                    "linear(to-r, brand.crypto.400, brand.crypto.700)" : 
                    "linear(to-r, brand.crypto.600, brand.crypto.400)"
                  }
                  bgClip="text"
                >
                  {t('crypto:earnTitle', 'Grow Your Crypto Assets')}
                </Heading>
                
              </VStack>
              
              <Text 
                fontSize={textSize} 
                maxW="2xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('crypto:earnIntroduction', 'Put your cryptocurrency to work and earn passive income through our range of investment products. Choose from staking, yield farming, and savings options with competitive APYs.')}
              </Text>
              
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href="#staking"
                  bg={isDark ? "brand.crypto.600" : "brand.crypto.500"}
                  color="white"
                  _hover={{
                    bg: isDark ? "brand.crypto.500" : "brand.crypto.600",
                  }}
                  leftIcon={<FaLock />}
                  size="md"
                  borderRadius="full"
                >
                  {t('crypto:exploreStaking', 'Explore Staking')}
                </Button>
                
                <Button
                  as="a"
                  href="#yield-farming"
                  variant="outline"
                  borderColor={isDark ? "brand.crypto.400" : "brand.crypto.500"}
                  color={isDark ? "brand.crypto.400" : "brand.crypto.500"}
                  _hover={{
                    bg: isDark ? "whiteAlpha.100" : "brand.crypto.50",
                  }}
                  leftIcon={<FaSeedling />}
                  size="md"
                  borderRadius="full"
                >
                  {t('crypto:exploreYieldFarming', 'Explore Yield Farming')}
                </Button>
              </HStack>
            </Stack>
             <GridItem order={{ base: 1, lg: 2 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack align={{ base: "center", lg: "end" }} textAlign={{ base: "center", lg: "left" }}>
                  <Image 
                    src="/images/crypto-coins.webp" 
                    alt={t('features.image.alt', 'Trading Features')}
                    width={{ base: "300px", md: "500px" }}
                    as={motion.img}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />        
                </VStack>
              </MotionBox>
            </GridItem>
          </Container>
        </Box>
        
        {/* Overview Stats */}
        <Box py={8}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card
                bg={isDark ? 'gray.800' : 'white'}
                boxShadow="sm"
                borderRadius="lg"
                p={6}
                align="center"
              >
                <VStack>
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                    mb={3}
                  >
                    <Icon as={FaLock} boxSize={8} />
                  </Box>
                  <Heading size="md">{t('crypto:totalStaked', 'Total Staked')}</Heading>
                  <Heading size="lg" color={isDark ? 'brand.crypto.300' : 'brand.crypto.600'}>
                    $71,352,000
                  </Heading>
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:acrossTokens', 'Across all tokens')}
                  </Text>
                </VStack>
              </Card>
              
              <Card
                bg={isDark ? 'gray.800' : 'white'}
                boxShadow="sm"
                borderRadius="lg"
                p={6}
                align="center"
              >
                <VStack>
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                    mb={3}
                  >
                    <Icon as={FaSeedling} boxSize={8} />
                  </Box>
                  <Heading size="md">{t('crypto:totalTVL', 'Total TVL')}</Heading>
                  <Heading size="lg" color={isDark ? 'brand.crypto.300' : 'brand.crypto.600'}>
                    $44,520,000
                  </Heading>
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:acrossAllPools', 'Across all liquidity pools')}
                  </Text>
                </VStack>
              </Card>
              
              <Card
                bg={isDark ? 'gray.800' : 'white'}
                boxShadow="sm"
                borderRadius="lg"
                p={6}
                align="center"
              >
                <VStack>
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                    mb={3}
                  >
                    <Icon as={FaPiggyBank} boxSize={8} />
                  </Box>
                  <Heading size="md">{t('crypto:savingsDeposits', 'Savings Deposits')}</Heading>
                  <Heading size="lg" color={isDark ? 'brand.crypto.300' : 'brand.crypto.600'}>
                    $176,700,000
                  </Heading>
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:acrossAllAssets', 'Across all supported assets')}
                  </Text>
                </VStack>
              </Card>
            </SimpleGrid>
          </Container>
        </Box>
        
        {/* User Dashboard Summary (if logged in) */}
        <Box py={8} bg={isDark ? 'gray.800' : 'white'} display="none">
          <Container maxW="container.xl">
            <VStack spacing={6} align="stretch">
              <Heading as="h2" size="lg">{t('crypto:yourEarnings', 'Your Earnings')}</Heading>
              
              {/* This section would be shown only to logged-in users */}
            </VStack>
          </Container>
        </Box>
        
        {/* Staking Section */}
        <Box py={12} id="staking">
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <HStack justify="space-between" wrap="wrap">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaLock} color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'} />
                    <Heading as="h2" size="lg">{t('crypto:staking', 'Staking')}</Heading>
                  </HStack>
                  <Text color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:stakingDescription', 'Lock your assets to earn passive income and support blockchain networks')}
                  </Text>
                </VStack>
                
                <Button
                  as={NextLink}
                  href="/crypto/earn/staking"
                  variant="crypto-solid"
                  colorScheme="brand.crypto"
                  rightIcon={<ChevronRightIcon />}
                  size="sm"
                >
                  {t('crypto:viewAll', 'View All')}
                </Button>
              </HStack>
              
              {loading ? (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="300px" borderRadius="lg" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {stakingOptions.slice(0, 3).map((option) => (
                    <Card
                      key={option.id}
                      bg={isDark ? 'gray.800' : 'white'}
                      boxShadow="sm"
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <CardHeader bg={isDark ? 'whiteAlpha.100' : 'gray.50'} p={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <Box boxSize={10} position="relative">
                              <Image
                                src={option.icon}
                                alt={option.name}
                                width={40}
                                height={40}
                              />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Heading size="md">{option.name}</Heading>
                              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                {option.symbol}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <Badge 
                            colorScheme="brand.crypto" 
                            fontSize="xl" 
                            py={1} 
                            px={2} 
                            borderRadius="md"
                          >
                            {option.apy}%
                          </Badge>
                        </HStack>
                      </CardHeader>
                      
                      <CardBody p={4}>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:lockPeriod', 'Lock Period')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.lockPeriod === 0 
                                ? t('crypto:flexible', 'Flexible') 
                                : `${option.lockPeriod} ${t('crypto:days', 'days')}`
                              }
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:minimumStake', 'Minimum Stake')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.minAmount} {option.symbol}
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:totalStaked', 'Total Staked')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.stakedValue}
                            </Text>
                          </HStack>
                          
                          <Divider />
                          
                          {option.userStaked > 0 ? (
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:yourStake', 'Your Stake')}:
                                </Text>
                                <Text fontWeight="medium">
                                  {option.userStaked} {option.symbol} (${option.userStakedValue})
                                </Text>
                              </HStack>
                              
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:pendingRewards', 'Pending Rewards')}:
                                </Text>
                                <Text fontWeight="medium" color={isDark ? 'green.400' : 'green.600'}>
                                  {option.rewards} {option.symbol} (${option.rewardsValue})
                                </Text>
                              </HStack>
                            </VStack>
                          ) : null}
                        </VStack>
                      </CardBody>
                      
                      <CardFooter p={4} bg={isDark ? 'whiteAlpha.50' : 'gray.50'}>
                        <Button 
                          variant="crypto-solid"
                          width="100%"
                          onClick={() => handleOpenStakeModal(option)}
                        >
                          {option.userStaked > 0 
                            ? t('crypto:manageStake', 'Manage Stake') 
                            : t('crypto:stakeNow', 'Stake Now')
                          }
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </Container>
        </Box>
        
        {/* Yield Farming Section */}
        <Box py={12} bg={isDark ? 'gray.800' : 'white'} id="yield-farming">
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <HStack justify="space-between" wrap="wrap">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaSeedling} color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'} />
                    <Heading as="h2" size="lg">{t('crypto:yieldFarming', 'Yield Farming')}</Heading>
                  </HStack>
                  <Text color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:yieldFarmingDescription', 'Provide liquidity to earn high APYs and token rewards')}
                  </Text>
                </VStack>
                
                <Button
                  as={NextLink}
                  href="/crypto/earn/yield-farming"
                  variant="crypto-solid"
                  rightIcon={<ChevronRightIcon />}
                  size="sm"
                >
                  {t('crypto:viewAll', 'View All')}
                </Button>
              </HStack>
              
              {loading ? (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="300px" borderRadius="lg" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {yieldFarmingOptions.map((option) => (
                    <Card
                      key={option.id}
                      bg={isDark ? 'gray.700' : 'white'}
                      boxShadow="sm"
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <CardHeader bg={isDark ? 'whiteAlpha.100' : 'gray.50'} p={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <HStack spacing={-2}>
                              {option.icons.map((icon, idx) => (
                                <Box
                                  key={idx}
                                  boxSize={10}
                                  position="relative"
                                  borderRadius="full"
                                  overflow="hidden"
                                  borderWidth={2}
                                  borderColor={isDark ? 'gray.700' : 'white'}
                                  zIndex={option.icons.length - idx}
                                  bg={isDark ? 'gray.700' : 'white'}
                                >
                                  <Image
                                    src={icon}
                                    alt={option.symbols[idx]}
                                    width={40}
                                    height={40}
                                  />
                                </Box>
                              ))}
                            </HStack>
                            <VStack align="start" spacing={0}>
                              <Heading size="md">{option.name}</Heading>
                              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                {option.platform}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <Badge 
                            colorScheme="green" 
                            fontSize="xl" 
                            py={1} 
                            px={2} 
                            borderRadius="md"
                          >
                            {option.apy}%
                          </Badge>
                        </HStack>
                      </CardHeader>
                      
                      <CardBody p={4}>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:riskLevel', 'Risk Level')}:
                            </Text>
                            <Badge 
                              colorScheme={
                                option.risk === 'Low' ? 'green' :
                                option.risk === 'Medium' ? 'yellow' :
                                option.risk === 'Medium-High' ? 'orange' : 'red'
                              }
                            >
                              {option.risk}
                            </Badge>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:lockPeriod', 'Lock Period')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.lockPeriod === 0 
                                ? t('crypto:flexible', 'Flexible') 
                                : `${option.lockPeriod} ${t('crypto:days', 'days')}`
                              }
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:totalValueLocked', 'TVL')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.tvl}
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:rewardToken', 'Reward Token')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.rewards.token}
                            </Text>
                          </HStack>
                          
                          <Divider />
                          
                          {parseFloat(option.userProvided) > 0 ? (
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:yourLiquidity', 'Your Liquidity')}:
                                </Text>
                                <Text fontWeight="medium">
                                  {option.userProvided}
                                </Text>
                              </HStack>
                              
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:pendingRewards', 'Pending Rewards')}:
                                </Text>
                                <Text fontWeight="medium" color={isDark ? 'green.400' : 'green.600'}>
                                  {option.rewards.earned} {option.rewards.token} (${option.rewards.value})
                                </Text>
                              </HStack>
                            </VStack>
                          ) : null}
                        </VStack>
                      </CardBody>
                      
                      <CardFooter p={4} bg={isDark ? 'whiteAlpha.50' : 'gray.50'}>
                        <Button 
                          variant="crypto-solid"
                          width="100%"
                          onClick={() => handleOpenYieldModal(option)}
                        >
                          {parseFloat(option.userProvided) > 0 
                            ? t('crypto:manageLiquidity', 'Manage Liquidity') 
                            : t('crypto:provideLiquidity', 'Provide Liquidity')
                          }
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
              
              <Box 
                bg={isDark ? "gray.700" : "gray.100"} 
                p={4} 
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="yellow.500"
              >
                <HStack spacing={4} align="center">
                  <Icon as={InfoIcon} boxSize={6} color="yellow.500" />
                  <Box>
                    <Text fontWeight="medium">{t('crypto:yieldFarmingRiskNote', 'Note on Risk')}</Text>
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:yieldFarmingRiskDescription', 'Yield farming involves providing liquidity to decentralized exchanges, which carries risks including impermanent loss, smart contract vulnerabilities, and market volatility. Always research thoroughly before committing your assets.')}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Container>
        </Box>
        
        {/* Savings Section */}
        <Box py={12} id="savings">
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <HStack justify="space-between" wrap="wrap">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FaPiggyBank} color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'} />
                    <Heading as="h2" size="lg">{t('crypto:savings', 'Savings')}</Heading>
                  </HStack>
                  <Text color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:savingsDescription', 'Deposit your crypto assets to earn interest with lower risk')}
                  </Text>
                </VStack>
                
                <Button
                  as={NextLink}
                  href="/crypto/earn/savings"
                  variant="crypto-solid"
                  rightIcon={<ChevronRightIcon />}
                  size="sm"
                >
                  {t('crypto:viewAll', 'View All')}
                </Button>
              </HStack>
              
              {loading ? (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="300px" borderRadius="lg" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={cardColumns} spacing={6}>
                  {savingsOptions.slice(0, 3).map((option) => (
                    <Card
                      key={option.id}
                      bg={isDark ? 'gray.800' : 'white'}
                      boxShadow="sm"
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <CardHeader bg={isDark ? 'whiteAlpha.100' : 'gray.50'} p={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <Box boxSize={10} position="relative">
                              <Image
                                src={option.icon}
                                alt={option.name}
                                width={40}
                                height={40}
                              />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Heading size="md">{option.name}</Heading>
                              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                {option.symbol}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <Badge 
                            colorScheme="blue" 
                            fontSize="xl" 
                            py={1} 
                            px={2} 
                            borderRadius="md"
                          >
                            {option.apy}%
                          </Badge>
                        </HStack>
                      </CardHeader>
                      
                      <CardBody p={4}>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:type', 'Type')}:
                            </Text>
                            <Badge colorScheme={option.flexible ? 'green' : 'blue'}>
                              {option.flexible 
                                ? t('crypto:flexible', 'Flexible') 
                                : t('crypto:fixed', 'Fixed Term')
                              }
                            </Badge>
                          </HStack>
                          
                          {!option.flexible && (
                            <HStack justify="space-between">
                              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                {t('crypto:lockPeriod', 'Lock Period')}:
                              </Text>
                              <Text fontWeight="medium">
                                {option.lockPeriod} {t('crypto:days', 'days')}
                              </Text>
                            </HStack>
                          )}
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:minimumDeposit', 'Minimum Deposit')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.minAmount} {option.symbol}
                            </Text>
                          </HStack>
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                              {t('crypto:totalDeposited', 'Total Deposited')}:
                            </Text>
                            <Text fontWeight="medium">
                              {option.totalDeposited}
                            </Text>
                          </HStack>
                          
                          <Divider />
                          
                          {option.userDeposited > 0 ? (
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:yourDeposit', 'Your Deposit')}:
                                </Text>
                                <Text fontWeight="medium">
                                  {option.userDeposited} {option.symbol} (${option.userDepositedValue})
                                </Text>
                              </HStack>
                              
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                                  {t('crypto:accruedInterest', 'Accrued Interest')}:
                                </Text>
                                <Text fontWeight="medium" color={isDark ? 'blue.400' : 'blue.600'}>
                                  {option.interest} {option.symbol} (${option.interestValue})
                                </Text>
                              </HStack>
                            </VStack>
                          ) : null}
                        </VStack>
                      </CardBody>
                      
                      <CardFooter p={4} bg={isDark ? 'whiteAlpha.50' : 'gray.50'}>
                        <Button 
                          variant="crypto-solid"
                          width="100%"
                          onClick={() => handleOpenSavingsModal(option)}
                        >
                          {option.userDeposited > 0 
                            ? t('crypto:manageDeposit', 'Manage Deposit') 
                            : t('crypto:depositNow', 'Deposit Now')
                          }
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </Container>
        </Box>
        
        {/* How it Works / FAQ Section */}
        <Box py={12}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <Heading as="h2" size="lg" textAlign="center">
                {t('crypto:howItWorks', 'How BitDash Earn Works')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <VStack
                  bg={isDark ? 'gray.700' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  spacing={4}
                  align="center"
                >
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                  >
                    <Text fontSize="2xl" fontWeight="bold">1</Text>
                  </Box>
                  <Heading size="md" textAlign="center">
                    {t('crypto:depositAssets', 'Deposit Your Assets')}
                  </Heading>
                  <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:depositAssetsDescription', 'Transfer your crypto assets to BitDash and choose from our range of earn products based on your risk tolerance and time horizon.')}
                  </Text>
                </VStack>
                
                <VStack
                  bg={isDark ? 'gray.700' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  spacing={4}
                  align="center"
                >
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                  >
                    <Text fontSize="2xl" fontWeight="bold">2</Text>
                  </Box>
                  <Heading size="md" textAlign="center">
                    {t('crypto:earnInterest', 'Earn Interest & Rewards')}
                  </Heading>
                  <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:earnInterestDescription', 'Your assets begin earning interest immediately. Monitor your growing balance and rewards in real-time through the BitDash dashboard.')}
                  </Text>
                </VStack>
                
                <VStack
                  bg={isDark ? 'gray.700' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  spacing={4}
                  align="center"
                >
                  <Box
                    color={isDark ? 'brand.crypto.400' : 'brand.crypto.500'}
                    p={3}
                    borderRadius="full"
                    bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                  >
                    <Text fontSize="2xl" fontWeight="bold">3</Text>
                  </Box>
                  <Heading size="md" textAlign="center">
                    {t('crypto:withdrawAnytime', 'Withdraw Anytime')}
                  </Heading>
                  <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:withdrawAnytimeDescription', 'Access your assets and earned interest according to the terms of your chosen product. Flexible options allow withdrawal at any time, while fixed terms provide higher returns.')}
                  </Text>
                </VStack>
              </SimpleGrid>
              
              <Box 
                bg={isDark ? "whiteAlpha.100" : "brand.crypto.50"} 
                p={6} 
                borderRadius="lg"
                mt={4}
              >
                <VStack spacing={4} align="center">
                  <Heading size="md">{t('crypto:readyToStart', 'Ready to Start Earning?')}</Heading>
                  <Text textAlign="center" maxW="2xl" color={isDark ? 'gray.300' : 'gray.700'}>
                    {t('crypto:readyToStartDescription', 'Join thousands of users who are growing their crypto assets with BitDash Earn. Start with as little as $1 equivalent in supported cryptocurrencies.')}
                  </Text>
                  <Button
                    as={NextLink}
                    href="/signup"
                    colorScheme="brand.crypto"
                    size="lg"
                    borderRadius="full"
                    px={8}
                  >
                    {t('crypto:createAccount', 'Create an Account')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
      </Box>
      
      {/* Staking Modal */}
      <Modal isOpen={isStakeModalOpen} onClose={onStakeModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedAsset && (
              <HStack>
                <Box boxSize={8} position="relative">
                  <Image
                    src={selectedAsset.icon}
                    alt={selectedAsset.name}
                    width={32}
                    height={32}
                  />
                </Box>
                <Text>{t('crypto:stakeAsset', 'Stake')} {selectedAsset.name}</Text>
              </HStack>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAsset && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>{t('crypto:stakeAmount', 'Stake Amount')} ({selectedAsset.symbol})</FormLabel>
                  <InputGroup>
                    <NumberInput
                      value={stakeAmount}
                      onChange={(valueString) => setStakeAmount(valueString)}
                      min={selectedAsset.minAmount}
                      precision={8}
                      width="100%"
                    >
                      <NumberInputField borderRadius="md" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightElement width="4.5rem" mr={6}>
                      <Button h="1.75rem" size="sm" onClick={() => setStakeAmount(selectedAsset.minAmount.toString())}>
                        {t('crypto:min', 'Min')}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:minimumStake', 'Minimum Stake')}:
                  </Text>
                  <Text fontWeight="medium">
                    {selectedAsset.minAmount} {selectedAsset.symbol}
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:availableBalance', 'Available Balance')}:
                  </Text>
                  <Text fontWeight="medium">
                    0.5432 {selectedAsset.symbol}
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:estimatedApy', 'Estimated APY')}:
                  </Text>
                  <Text fontWeight="bold" color={isDark ? 'green.400' : 'green.600'}>
                    {selectedAsset.apy}%
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:lockPeriod', 'Lock Period')}:
                  </Text>
                  <Text fontWeight="medium">
                    {selectedAsset.lockPeriod === 0 
                      ? t('crypto:flexible', 'Flexible') 
                      : `${selectedAsset.lockPeriod} ${t('crypto:days', 'days')}`
                    }
                  </Text>
                </HStack>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-compound" mb="0" fontSize="sm">
                    {t('crypto:autoCompound', 'Auto-compound rewards')}
                  </FormLabel>
                  <Switch 
                    id="auto-compound" 
                    isChecked={autoCompound}
                    onChange={(e) => setAutoCompound(e.target.checked)}
                    colorScheme="brand.crypto"
                  />
                </FormControl>
                
                <Box 
                  bg={isDark ? "whiteAlpha.100" : "gray.50"} 
                  p={3} 
                  borderRadius="md"
                  fontSize="sm"
                >
                  <Text fontWeight="medium">{t('crypto:termsAndConditions', 'Terms & Conditions')}:</Text>
                  <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="xs" mt={1}>
                    {t('crypto:stakingTerms', 'By staking your assets, you agree to lock them for the specified period. Early unstaking may result in forfeiture of accrued rewards. Staking rewards are calculated daily and distributed according to the protocol\'s schedule.')}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onStakeModalClose}>
              {t('crypto:cancel', 'Cancel')}
            </Button>
            <Button 
              colorScheme="brand.crypto" 
              onClick={handleStakeSubmit}
              isDisabled={!stakeAmount || parseFloat(stakeAmount) < (selectedAsset?.minAmount || 0)}
            >
              {t('crypto:confirmStake', 'Confirm Stake')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Yield Farming Modal */}
      <Modal isOpen={isYieldModalOpen} onClose={onYieldModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedAsset ? (
                selectedAsset.icons ? (
                <HStack>
                    <HStack spacing={-2}>
                    {selectedAsset.icons.map((icon, idx) => (
                        <Box
                        key={idx}
                        boxSize={8}
                        position="relative"
                        borderRadius="full"
                        overflow="hidden"
                        borderWidth={2}
                        borderColor={isDark ? 'gray.800' : 'white'}
                        zIndex={selectedAsset.icons.length - idx}
                        >
                        <Image
                            src={icon}
                            alt={selectedAsset.symbols?.[idx] || selectedAsset.name}
                            width={32}
                            height={32}
                        />
                        </Box>
                    ))}
                    </HStack>
                    <Text>{t('crypto:provideLiquidity', 'Provide Liquidity')} - {selectedAsset.name}</Text>
                </HStack>
                ) : (
                <Text>{t('crypto:provideLiquidity', 'Provide Liquidity')} - {selectedAsset.name}</Text>
                )
            ) : null}
            </ModalHeader>

          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAsset && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                  {t('crypto:lpProvisionGuide', 'To provide liquidity, you need to supply an equal value of both tokens in the pair.')}
                </Text>
                
                <Link
                  href={`https://${selectedAsset.platform.toLowerCase().replace(/\s+/g, '')}.org`}
                  isExternal
                  color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'}
                >
                  {t('crypto:visitPlatform', 'Visit')} {selectedAsset.platform} <ExternalLinkIcon mx="2px" />
                </Link>
                
                <Box 
                  bg={isDark ? "yellow.900" : "yellow.50"} 
                  p={3} 
                  borderRadius="md"
                  fontSize="sm"
                  borderLeft="4px solid"
                  borderColor="yellow.500"
                >
                  <HStack align="flex-start">
                    <InfoIcon color="yellow.500" mt={0.5} />
                    <Text color={isDark ? 'gray.300' : 'gray.700'} fontSize="sm">
                      {t('crypto:dexWarning', 'BitDash is providing information about this pool but does not directly manage these liquidity pools. Always conduct your own research before providing liquidity to any protocol.')}
                    </Text>
                  </HStack>
                </Box>
                
                <Divider />
                
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="medium">{t('crypto:poolInfo', 'Pool Information')}:</Text>
                  
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:platform', 'Platform')}:
                    </Text>
                    <Text fontWeight="medium">
                      {selectedAsset.platform}
                    </Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:estimatedApy', 'Estimated APY')}:
                    </Text>
                    <Text fontWeight="bold" color={isDark ? 'green.400' : 'green.600'}>
                      {selectedAsset.apy}%
                    </Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:totalValueLocked', 'TVL')}:
                    </Text>
                    <Text fontWeight="medium">
                      {selectedAsset.tvl}
                    </Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:rewardToken', 'Reward Token')}:
                    </Text>
                    <Text fontWeight="medium">
                      {selectedAsset.rewards.token}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onYieldModalClose}>
              {t('crypto:close', 'Close')}
            </Button>
            <Button 
              as={Link}
              href={`https://${selectedAsset?.platform.toLowerCase().replace(/\s+/g, '')}.org`}
              isExternal
              colorScheme="green"
              leftIcon={<ExternalLinkIcon />}
            >
              {t('crypto:goToProtocol', 'Go to Protocol')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Savings Modal */}
      <Modal isOpen={isSavingsModalOpen} onClose={onSavingsModalClose} size="md">
        <ModalOverlay />
        <ModalContent bg={isDark ? 'gray.800' : 'white'}>
          <ModalHeader>
            {selectedAsset && (
              <HStack>
                <Box boxSize={8} position="relative">
                  <Image
                    src={selectedAsset.icon}
                    alt={selectedAsset.name}
                    width={32}
                    height={32}
                  />
                </Box>
                <Text>{t('crypto:depositAsset', 'Deposit')} {selectedAsset.name}</Text>
              </HStack>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAsset && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>{t('crypto:depositAmount', 'Deposit Amount')} ({selectedAsset.symbol})</FormLabel>
                  <InputGroup>
                    <NumberInput
                      value={savingsAmount}
                      onChange={(valueString) => setSavingsAmount(valueString)}
                      min={selectedAsset.minAmount}
                      precision={selectedAsset.symbol === 'BTC' || selectedAsset.symbol === 'ETH' ? 8 : 2}
                      width="100%"
                    >
                      <NumberInputField borderRadius="md" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightElement width="4.5rem" mr={6}>
                      <Button h="1.75rem" size="sm" onClick={() => setSavingsAmount(selectedAsset.minAmount.toString())}>
                        {t('crypto:min', 'Min')}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:minimumDeposit', 'Minimum Deposit')}:
                  </Text>
                  <Text fontWeight="medium">
                    {selectedAsset.minAmount} {selectedAsset.symbol}
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:availableBalance', 'Available Balance')}:
                  </Text>
                  <Text fontWeight="medium">
                    1.2345 {selectedAsset.symbol}
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:estimatedApy', 'Estimated APY')}:
                  </Text>
                  <Text fontWeight="bold" color={isDark ? 'blue.400' : 'blue.600'}>
                    {selectedAsset.apy}%
                  </Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('crypto:type', 'Type')}:
                  </Text>
                  <Badge colorScheme={selectedAsset.flexible ? 'green' : 'blue'}>
                    {selectedAsset.flexible 
                      ? t('crypto:flexible', 'Flexible') 
                      : t('crypto:fixed', 'Fixed Term')
                    }
                  </Badge>
                </HStack>
                
                {!selectedAsset.flexible && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:lockPeriod', 'Lock Period')}:
                    </Text>
                    <Text fontWeight="medium">
                      {selectedAsset.lockPeriod} {t('crypto:days', 'days')}
                    </Text>
                  </HStack>
                )}
                
                <Box 
                  bg={isDark ? "whiteAlpha.100" : "gray.50"} 
                  p={3} 
                  borderRadius="md"
                  fontSize="sm"
                >
                  <Text fontWeight="medium">{t('crypto:savingsTerms', 'Savings Terms')}:</Text>
                  <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="xs" mt={1}>
                    {selectedAsset.flexible 
                      ? t('crypto:flexibleTerms', 'Flexible savings allow you to deposit and withdraw at any time. Interest is calculated daily and paid out daily to your savings account.')
                      : t('crypto:fixedTerms', 'Fixed term savings require your deposit to remain locked for the full term to receive the stated interest rate. Early withdrawal may result in reduced interest payments.')
                    }
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onSavingsModalClose}>
              {t('crypto:cancel', 'Cancel')}
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSavingsSubmit}
              isDisabled={!savingsAmount || parseFloat(savingsAmount) < (selectedAsset?.minAmount || 0)}
            >
              {t('crypto:confirmDeposit', 'Confirm Deposit')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
    </>
  );
}