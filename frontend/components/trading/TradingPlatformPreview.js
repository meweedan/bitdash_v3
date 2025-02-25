import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  HStack,
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Badge,
  Image,
  Divider,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaDesktop,
  FaMobileAlt,
  FaCode,
  FaCheckCircle,
  FaDownload,
  FaApple,
  FaAndroid,
  FaWindows,
  FaTools,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaRobot,
  FaBell,
  FaCogs,
  FaLayerGroup,
  FaPlug,
} from 'react-icons/fa';

const TradingPlatformPreview = () => {
  const [platformType, setPlatformType] = useState('web');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('brand.bittrade.500', 'brand.bittrade.400');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');

  // Platform features
  const platformFeatures = {
    web: [
      { 
        title: 'Advanced Charting',
        description: 'Multi-timeframe analysis with 70+ technical indicators and drawing tools',
        icon: FaChartLine
      },
      { 
        title: 'One-Click Trading',
        description: 'Execute trades instantly with customizable quick-trade panels',
        icon: FaChartBar
      },
      { 
        title: 'Market Depth',
        description: 'Visualize order book data and liquidity across price levels',
        icon: FaLayerGroup
      },
      { 
        title: 'Trading Alerts',
        description: 'Set custom price alerts and notifications for your watchlist',
        icon: FaBell
      },
      { 
        title: 'Risk Management',
        description: 'Advanced order types including OCO and trailing stops',
        icon: FaTools
      },
      { 
        title: 'Multi-Device Sync',
        description: 'Synchronize your settings, watchlists and charts across devices',
        icon: FaDesktop
      }
    ],
    mobile: [
      { 
        title: 'On-the-Go Trading',
        description: 'Full trading functionality optimized for mobile devices',
        icon: FaMobileAlt
      },
      { 
        title: 'Biometric Security',
        description: 'Face ID and fingerprint login for enhanced security',
        icon: FaCheckCircle
      },
      { 
        title: 'Push Notifications',
        description: 'Instant alerts for price movements, margin calls, and filled orders',
        icon: FaBell
      },
      { 
        title: 'Mobile Charts',
        description: 'Advanced charting with touchscreen-optimized controls',
        icon: FaChartLine
      },
      { 
        title: 'Offline Mode',
        description: 'Access market analysis and account information even when offline',
        icon: FaCogs
      },
      { 
        title: 'Widget Support',
        description: 'Customizable home screen widgets for quick market overviews',
        icon: FaLayerGroup
      }
    ],
    api: [
      { 
        title: 'REST API',
        description: 'Comprehensive REST API with extensive documentation',
        icon: FaCode
      },
      { 
        title: 'WebSocket Feeds',
        description: 'Real-time data streaming for market data and order updates',
        icon: FaPlug
      },
      { 
        title: 'FIX Protocol',
        description: 'FIX 4.4 support for institutional-grade connectivity',
        icon: FaPlug
      },
      { 
        title: 'Rate Limits',
        description: 'High rate limits designed for algorithmic trading strategies',
        icon: FaChartBar
      },
      { 
        title: 'Historical Data',
        description: 'Access to full market history for backtesting and analysis',
        icon: FaChartPie
      },
      { 
        title: 'Authentication',
        description: 'Secure API key management with granular permission controls',
        icon: FaCheckCircle
      }
    ]
  };

  return (
    <Box>
      <Tabs 
        variant="soft-rounded" 
        colorScheme="blue" 
        size="md" 
        mb={6}
        onChange={(index) => setPlatformType(['web', 'mobile', 'api'][index])}
      >
        <TabList justifyContent="center">
          <Tab><HStack><Icon as={FaDesktop} mr={2} />Web Platform</HStack></Tab>
          <Tab><HStack><Icon as={FaMobileAlt} mr={2} />Mobile Apps</HStack></Tab>
          <Tab><HStack><Icon as={FaCode} mr={2} />API Solutions</HStack></Tab>
        </TabList>
      </Tabs>

      <Box mb={6}>
        {platformType === 'web' && (
          <Box
            bg={secondaryBg}
            borderRadius="md"
            p={4}
            mb={6}
          >
            <VStack spacing={2} align="center" mb={4}>
              <Heading platformType="web" />
              <Text fontSize="sm" textAlign="center" maxW="2xl">
                Our powerful web trading platform provides professional tools with no downloads required.
                Trade from any device with an internet browser while accessing institutional-grade features.
              </Text>
            </VStack>
            
            <Box 
              bg="gray.900" 
              borderRadius="md" 
              height="200px" 
              position="relative"
              overflow="hidden"
            >
              {/* Placeholder for platform preview image */}
              <Box 
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Advanced WebTrader Platform
                </Text>
              </Box>
            </Box>
            
            <HStack mt={4} justify="center" spacing={4}>
              <Button
                leftIcon={<FaDownload />}
                colorScheme="blue"
                size="sm"
              >
                Launch Web Platform
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
              >
                View Demo
              </Button>
            </HStack>
          </Box>
        )}

        {platformType === 'mobile' && (
          <Box
            bg={secondaryBg}
            borderRadius="md"
            p={4}
            mb={6}
          >
            <VStack spacing={2} align="center" mb={4}>
              <Heading platformType="mobile" />
              <Text fontSize="sm" textAlign="center" maxW="2xl">
                Trade anywhere with our award-winning mobile applications for iOS and Android.
                Enjoy the full range of trading features with a native mobile experience.
              </Text>
            </VStack>
            
            <Flex 
              justify="center" 
              gap={4} 
              wrap="wrap"
            >
              <Box
                bg="gray.900"
                borderRadius="md"
                width="150px"
                height="280px"
                position="relative"
                overflow="hidden"
              >
                {/* Placeholder for iOS app preview */}
                <Box 
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Icon as={FaApple} boxSize={8} color="white" mb={2} />
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    iOS App
                  </Text>
                </Box>
              </Box>
              
              <Box
                bg="gray.900"
                borderRadius="md"
                width="150px"
                height="280px"
                position="relative"
                overflow="hidden"
              >
                {/* Placeholder for Android app preview */}
                <Box 
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Icon as={FaAndroid} boxSize={8} color="white" mb={2} />
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    Android App
                  </Text>
                </Box>
              </Box>
            </Flex>
            
            <HStack mt={4} justify="center" spacing={4}>
              <Button
                leftIcon={<FaApple />}
                colorScheme="blue"
                size="sm"
              >
                Download for iOS
              </Button>
              <Button
                leftIcon={<FaAndroid />}
                colorScheme="blue"
                size="sm"
              >
                Download for Android
              </Button>
            </HStack>
          </Box>
        )}

        {platformType === 'api' && (
          <Box
            bg={secondaryBg}
            borderRadius="md"
            p={4}
            mb={6}
          >
            <VStack spacing={2} align="center" mb={4}>
              <Heading platformType="api" />
              <Text fontSize="sm" textAlign="center" maxW="2xl">
                Build custom trading systems, algorithms, and bots with our comprehensive API solutions.
                Designed for programmers, quants, and institutional traders.
              </Text>
            </VStack>
            
            <Box
              p={4}
              borderRadius="md"
              bg="gray.900"
              color="green.400"
              fontFamily="mono"
              fontSize="sm"
              mb={4}
              overflowX="auto"
            >
              <Text>// Example API request to get market data</Text>
              <Text color="white">GET /api/v1/market/ticker/BTC-USD</Text>
              <Box h={2} />
              <Text>// Response</Text>
              <Text color="blue.300">{'{'}</Text>
              <Text color="blue.300" ml={4}>"symbol": "BTC-USD",</Text>
              <Text color="blue.300" ml={4}>"price": "61247.80",</Text>
              <Text color="blue.300" ml={4}>"bid": "61245.20",</Text>
              <Text color="blue.300" ml={4}>"ask": "61250.40",</Text>
              <Text color="blue.300" ml={4}>"24h_change": "2.14",</Text>
              <Text color="blue.300" ml={4}>"24h_volume": "24582.34"</Text>
              <Text color="blue.300">{'}'}</Text>
            </Box>
            
            <HStack mt={4} justify="center" spacing={4}>
              <Button
                leftIcon={<FaCode />}
                colorScheme="blue"
                size="sm"
              >
                API Documentation
              </Button>
              <Button
                leftIcon={<FaDownload />}
                variant="outline"
                colorScheme="blue"
                size="sm"
              >
                Download SDKs
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
      
      {/* Platform features */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {platformFeatures[platformType].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              p={4}
              bg={cardBg}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              height="100%"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
                borderColor: 'blue.300'
              }}
              transition="all 0.2s"
            >
              <Flex align="center" mb={3}>
                <Icon as={feature.icon} color={accentColor} boxSize={5} mr={3} />
                <Text fontWeight="bold">{feature.title}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {feature.description}
              </Text>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>
      
      {/* Platform comparison */}
      <Box
        mt={10}
        p={6}
        bg={secondaryBg}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={4} align="center" mb={6}>
          <Text fontSize="lg" fontWeight="bold">
            Choose the Platform That Suits Your Trading Style
          </Text>
          <Text fontSize="sm" textAlign="center" maxW="xl">
            All platforms sync seamlessly with your BitTrade account, allowing you to trade with your preferred tools while maintaining a unified portfolio.
          </Text>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <PlatformFeatureCard 
            title="Web Platform"
            subtitle="Professional Trading Station"
            icon={FaDesktop}
            features={[
              'No downloads required',
              'Advanced charting',
              'Full trading capabilities',
              'Multi-monitor support',
              'Custom layouts'
            ]}
            accentColor={accentColor}
            current={platformType === 'web'}
          />
          
          <PlatformFeatureCard 
            title="Mobile Apps"
            subtitle="Trading on the Go"
            icon={FaMobileAlt}
            features={[
              'iOS and Android',
              'Biometric security',
              'Push notifications',
              'Mobile-optimized charts',
              'Offline mode'
            ]}
            accentColor={accentColor}
            current={platformType === 'mobile'}
          />
          
          <PlatformFeatureCard 
            title="API Solutions"
            subtitle="Algorithmic Trading"
            icon={FaCode}
            features={[
              'REST and WebSocket',
              'FIX protocol support',
              'Multiple SDKs',
              'Extensive documentation',
              'Historical data access'
            ]}
            accentColor={accentColor}
            current={platformType === 'api'}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// Custom heading component for each platform type
const Heading = ({ platformType }) => {
  const headings = {
    web: 'Professional Web Trading Platform',
    mobile: 'Mobile Trading Applications',
    api: 'API & Developer Solutions'
  };
  
  const icons = {
    web: FaDesktop,
    mobile: FaMobileAlt,
    api: FaCode
  };
  
  return (
    <HStack spacing={2}>
      <Icon as={icons[platformType]} color="brand.bittrade.500" boxSize={5} />
      <Text fontSize="lg" fontWeight="bold">
        {headings[platformType]}
      </Text>
    </HStack>
  );
};

// Platform feature card component
const PlatformFeatureCard = ({ title, subtitle, icon, features, accentColor, current }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = current ? accentColor : useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      bg={cardBg}
      borderRadius="md"
      borderWidth="2px"
      borderColor={borderColor}
      overflow="hidden"
      position="relative"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'md'
      }}
    >
      {current && (
        <Badge 
          position="absolute" 
          top={2} 
          right={2} 
          colorScheme="blue"
          zIndex={1}
        >
          Selected
        </Badge>
      )}
      
      <Box 
        bg={accentColor} 
        py={3} 
        px={4} 
        color="white"
        textAlign="center"
      >
        <Icon as={icon} boxSize={6} mb={2} />
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="xs" opacity={0.8}>{subtitle}</Text>
      </Box>
      
      <Box p={4}>
        <List spacing={2}>
          {features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FaCheckCircle} color={accentColor} />
              <Text fontSize="sm">{feature}</Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TradingPlatformPreview;