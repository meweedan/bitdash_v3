import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBalanceScale,
  FaBolt,
  FaCheckCircle,
  FaMobileAlt,
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const MotionBox = motion(Box);

const TradeDemo = () => {
  const router = useRouter();
  // A clean, light gradient background (Apple-style minimalism)
  const bgGradient = useColorModeValue(
    'linear(to-r, #f5f5f7, #ffffff)',
    'linear(to-r, gray.700, gray.800)'
  );
  // Use subtle, neutral accent colors
  const accentColor = useColorModeValue('brand,bittrade.400', 'brand.forex.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const features = [
    {
      title: 'Ultra-Low Spreads',
      icon: FaChartLine,
      desc: 'Experience spreads as low as 0.0 pips with deep liquidity.',
    },
    {
      title: 'Shariah-Compliant',
      icon: FaBalanceScale,
      desc: '100% swap‑free for ethical, interest‑free trading.',
    },
    {
      title: 'High Leverage',
      icon: FaBolt,
      desc: 'Trade with up to 1:500 leverage for maximum opportunity.',
    },
    {
      title: 'Zero Commissions',
      icon: FaCheckCircle,
      desc: 'No hidden fees—just pure trading efficiency.',
    },
    {
      title: 'MT5 Platform',
      icon: FaMobileAlt,
      desc: 'Seamlessly trade on desktop, mobile, or web with MT5.',
    },
  ];

  return (
    <Layout>
    <Box bg={bgGradient} py={16} px={{ base: 6, md: 12 }}>
      {/* Hero Section */}
      <Flex direction="column" align="center" textAlign="center" mb={16}>
        <MotionBox
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heading
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="extrabold"
            color={accentColor}
          >
            Forex & Crypto Trading Redefined
          </Heading>
        </MotionBox>
        <MotionBox
          mt={4}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.500"
            maxW="800px"
          >
            Discover an elegantly simple trading experience engineered for
            speed, security, and ethical, Shariah‑compliant conditions.
          </Text>
        </MotionBox>
      </Flex>

      {/* Features Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16}>
        {features.map((feature, idx) => (
          <MotionBox
            key={idx}
            whileHover={{ scale: 1.03 }}
            bg={cardBg}
            p={8}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            textAlign="center"
            boxShadow="xl"
          >
            <Icon as={feature.icon} boxSize={10} color={accentColor} mb={4} />
            <Heading size="md" mb={2} color={accentColor}>
              {feature.title}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {feature.desc}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Call-to-Action Section */}
      <Flex justify="center" mb={16}>
        <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="bittrade-solid"
            size="lg"
            px={10}
            py={6}
            onClick={() => router.push('/signup/trader')}
          >
            Start Trading Today
          </Button>
        </MotionBox>
      </Flex>

      {/* Additional Info Section */}
      <Box textAlign="center">
        <Heading size="lg" color={accentColor} mb={4}>
          Engineered for Excellence
        </Heading>
        <Text fontSize="md" color="gray.500" maxW="700px" mx="auto">
          Our platform delivers lightning-fast execution, a sleek user
          interface, and top-tier security—empowering you to trade with
          confidence in a truly ethical environment.
        </Text>
      </Box>
    </Box>
    </Layout>
  );
};

export default TradeDemo;
