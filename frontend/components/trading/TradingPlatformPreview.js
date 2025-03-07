import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  Badge,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  FaDesktop,
  FaMobileAlt,
  FaCode,
  FaCheckCircle,
  FaDownload,
  FaApple,
  FaAndroid,
} from 'react-icons/fa';

const TradingPlatformPreview = () => {
  const [platformType, setPlatformType] = useState('web');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('brand.forex.500', 'brand.forex.400');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');


  return (
    <Box>
      <Tabs 
      variant="soft-rounded"
        mb={6}
        onChange={(index) => setPlatformType(['web', 'mobile'][index])}
      >
        <TabList justifyContent="center">
          <Tab><HStack><Icon as={FaDesktop} mr={2} />Web Platform</HStack></Tab>
          <Tab><HStack><Icon as={FaMobileAlt} mr={2} />Mobile Apps</HStack></Tab>
        </TabList>
      </Tabs>

      <Box mb={6}>
        {platformType === 'web' && (
          <Box
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
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xl" fontWeight="bold">
                  Advanced WebTrader Platform
                </Text>
              </Box>
            </Box>
            
            <HStack mt={4} justify="center" spacing={4}>
              <Button
                leftIcon={<FaDownload />}
                color="brand.forex.400"
              >
                Web Platform
              </Button>
            </HStack>
          </Box>
        )}

        {platformType === 'mobile' && (
          <Box
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
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Icon as={FaApple} boxSize={8}  mb={2} />
                  <Text fontSize="sm" fontWeight="bold" >
                    MT5 iOS App
                  </Text>
                </Box>
              </Box>
              
              <Box
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
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Icon as={FaAndroid} boxSize={8}  mb={2} />
                  <Text fontSize="sm" fontWeight="bold" >
                    MT5 Android App
                  </Text>
                </Box>
              </Box>
            </Flex>
            
            <HStack mt={4} justify="center" spacing={4}>
              <Button
                leftIcon={<FaApple />}
                color="brand.forex.400"
              >
                iOS
              </Button>
              <Button
                leftIcon={<FaAndroid />}
                color="brand.forex.400"
              >
                Android
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Custom heading component for each platform type
const Heading = ({ platformType }) => {
  const headings = {
    web: 'Professional Web Trading Platform',
    mobile: 'Mobile Trading Applications',
  };
  
  const icons = {
    web: FaDesktop,
    mobile: FaMobileAlt,
  };
  
  return (
    <HStack spacing={2}>
      <Icon as={icons[platformType]} color="brand.forex.500" boxSize={5} />
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
        py={3} 
        px={4} 
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