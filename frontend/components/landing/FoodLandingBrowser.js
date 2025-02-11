import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  useColorMode,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { 
  ArrowUpRight, 
  ChevronRight,
  Utensils,
  Timer,
  Truck,
  Star,
  Shield,
  Smartphone,
} from 'lucide-react';

import GradientHeading from '@/components/GradientHeading';

// Phone demo component that shows the app flow
const PhoneFrame = ({ children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      w={{ base: "280px", md: "375px" }}
      h={{ base: "560px", md: "750px" }}
      borderRadius="3xl"
      overflow="hidden"
      position="relative"
      bg={isDark ? "gray.800" : "white"}
      boxShadow="2xl"
      border="14px solid"
      borderColor={isDark ? "gray.700" : "gray.200"}
      mx="auto"
    >
      {children}
    </Box>
  );
};

// App demo screens that cycle automatically
const AppDemo = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const screens = [
    // Restaurant Selection Screen
    <AnimatePresence key="restaurants">
      <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          >
            <Box
              w="full"
              bg={isDark ? "gray.800" : "white"}
              borderRadius="xl"
              p={4}
              boxShadow="md"
              borderWidth="1px"
              borderColor="brand.bitfood.500"
            >
              <HStack spacing={4}>
                <Box 
                  w="60px" 
                  h="60px" 
                  bg="brand.bitfood.500" 
                  borderRadius="lg"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{t('food.flow.restaurant')} {i + 1}</Text>
                  <Text fontSize="sm" color="gray.500">⭐️ 4.{8 - i} • {t('food.flow.deliveryTime')}</Text>
                </VStack>
              </HStack>
            </Box>
          </motion.div>
        ))}
      </VStack>
    </AnimatePresence>,

    // Menu Selection Screen
    <AnimatePresence key="menu">
      <VStack spacing={4} p={4} h="full">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          >
            <Box
              w="full"
              bg={isDark ? "gray.800" : "white"}
              borderRadius="xl"
              p={4}
              boxShadow="md"
              borderWidth="1px"
              borderColor="brand.bitfood.500"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{t('food.flow.menuItem')} {i + 1}</Text>
                  <Text fontSize="sm" color="gray.500">15.99 BIT</Text>
                </VStack>
                <Box w="60px" h="60px" bg="brand.bitfood.500" borderRadius="lg" />
              </HStack>
            </Box>
          </motion.div>
        ))}
      </VStack>
    </AnimatePresence>,

    // Delivery Tracking Screen
    <AnimatePresence key="tracking">
      <VStack spacing={4} p={4} h="full">
        <Box
          w="full"
          h="60%"
          borderRadius="xl"
          p={4}
          position="relative"
          overflow="hidden"
          borderWidth="1px"
          borderColor="brand.bitfood.500"
        >
          <motion.div
            animate={{
              x: ["0%", "100%"],
              y: ["0%", "100%"]
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ffa78a",
              position: "absolute"
            }}
          />
        </Box>
        <Box
          w="full"
          borderRadius="xl"
          p={4}
          boxShadow="md"
          borderWidth="1px"
          borderColor="brand.bitfood.500"
        >
          <VStack align="stretch" spacing={3}>
            <Text fontWeight="bold">{t('food.flow.estimatedDelivery')}</Text>
            <Box w="full" h="2" borderRadius="full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 2 }}
                style={{
                  height: "100%",
                  backgroundColor: "#ffa78a",
                  borderRadius: "full"
                }}
              />
            </Box>
            <Text fontSize="sm" color="gray.500">
              {t('food.flow.preparing')}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </AnimatePresence>,

    // Delivery Complete Screen
    <AnimatePresence key="complete">
      <VStack 
        spacing={8} 
        p={8} 
        h="full" 
        justify="center" 
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg="brand.bitfood.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="5xl"
            color="white"
          >
            ✓
          </Box>
        </motion.div>
        <VStack spacing={2}>
          <Heading size="lg">{t('food.flow.orderDelivered')}</Heading>
          <Text color="gray.500" textAlign="center">
            {t('food.flow.rateExperience')}
          </Text>
        </VStack>
      </VStack>
    </AnimatePresence>
  ];

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
};

// Feature section with animated icon
const FeatureCard = ({ feature }) => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <VStack
        spacing={6}
        p={8}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        _hover={{
          transform: 'translateY(-4px)',
          shadow: 'xl'
        }}
        transition="all 0.2s"
      >
        <Box
          p={4}
          borderRadius="xl"
          position="relative"
        >
          <Icon 
            as={feature.icon}
            boxSize={8}
            color="brand.bitfood.500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              border: "2px solid",
              borderColor: "var(--chakra-colors-brand-bitfood-500)"
            }}
          />
        </Box>

        <VStack spacing={4} align="center" textAlign="center">
          <Heading size="md">{t(feature.title)}</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            {t(feature.description)}
          </Text>
        </VStack>

        <SimpleGrid columns={2} spacing={4} w="full">
          {feature.features.map((featureKey, idx) => (
            <HStack
              key={idx}
              spacing={2}
              p={3}
              borderRadius="lg"
              bg={useColorModeValue('gray.50', 'gray.900')}
              fontSize="sm"
            >
              <Icon as={ChevronRight} boxSize={4} color="brand.bitfood.500" />
              <Text>{t(featureKey)}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </VStack>
    </motion.div>
  );
};

const FoodLanding = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const router = useRouter();

  const features = [
    {
      icon: Utensils,
      title: 'features.dining.title',
      description: 'features.dining.description',
      features: [
        'features.dining.quick',
        'features.dining.menu',
        'features.dining.payment',
        'features.dining.rewards'
      ]
    },
    {
      icon: Truck,
      title: 'features.delivery.title',
      description: 'features.delivery.description',
      features: [
        'features.delivery.tracking',
        'features.delivery.contactless',
        'features.delivery.scheduling',
        'features.delivery.special'
      ]
    },
    {
      icon: Star,
      title: 'features.premium.title',
      description: 'features.premium.description',
      features: [
        'features.premium.exclusive',
        'features.premium.priority',
        'features.premium.support',
        'features.premium.rewards'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('food.meta.title')}</title>
        <meta name="description" content={t('food.meta.description')} />
      </Head>

      <Box>
        {/* Hero Section */}
        <Box
          minH={{ base: "90vh", lg: "100vh" }}
          pt={{ base: 20, lg: 0 }}
          display="flex"
          alignItems="center"
          position="relative"
          overflow="hidden"
        >
          <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
            <VStack spacing={{ base: 8, lg: 12 }} align="center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VStack spacing={{ base: 4, lg: 6 }}>
                  <GradientHeading
                    fontSize={{ base: "4xl", sm: "5xl", lg: "7xl" }}
                    textAlign="center"
                    bgGradient="linear(to-r, brand.bitfood.500, brand.bitfood.700)"
                    px={{ base: 4, lg: 0 }}
                  >
                    {t('food.hero.title')}
                  </GradientHeading>

                  <Text
                    fontSize={{ base: "lg", sm: "xl", lg: "2xl" }}
                    textAlign="center"
                    maxW="2xl"
                    color={useColorModeValue('gray.600', 'gray.400')}
                  >
                    {t('food.hero.description')}
                  </Text>
                </VStack>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <VStack
                  spacing={{ base: 4, sm: 6 }}
                  direction={{ base: "column", sm: "row" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  <Button
                    size="lg"
                    variant="bitfood-solid"
                    rightIcon={<Smartphone />}
                    h={{ base: 12, lg: 14 }}
                    px={{ base: 8, lg: 10 }}
                    fontSize={{ base: "md", lg: "lg" }}
                    w={{ base: "full", sm: "auto" }}
                  >
                    {t('food.hero.downloadButton')}
                  </Button>
                  <Button
                    size="lg"
                    variant="bitfood-outline"
                    h={{ base: 12, lg: 14 }}
                    px={{ base: 8, lg: 10 }}
                    fontSize={{ base: "md", lg: "lg" }}
                    w={{ base: "full", sm: "auto" }}
                  >
                    {t('food.hero.exploreButton')}
                  </Button>
</VStack>
              </motion.div>

              {/* App Demo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box 
                  mt={{ base: 8, lg: 16 }}
                  position="relative"
                >
                  {/* Gradient background for phone */}
                  <Box
                    position="absolute"
                    inset={0}
                    bg="gradient-radial"
                    opacity={0.1}
                    bgGradient={useColorModeValue(
                      'radial(circle at 50% 50%, brand.bitfood.400 0%, transparent 70%)',
                      'radial(circle at 50% 50%, brand.bitfood.700 0%, transparent 70%)'
                    )}
                    transform="scale(1.2)"
                  />
                  <AppDemo />
                </Box>
              </motion.div>
            </VStack>
          </Container>
        </Box>

        {/* Features Section */}
        <Box 
          py={{ base: 16, lg: 24 }}
        >
          <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
            <VStack spacing={{ base: 12, lg: 16 }}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
                  color={useColorModeValue('gray.900', 'white')}
                >
                  {t('food.features.title')}
                </Heading>
                <Text
                  fontSize={{ base: "lg", lg: "xl" }}
                  color={useColorModeValue('gray.600', 'gray.400')}
                  maxW="2xl"
                >
                  {t('food.features.description')}
                </Text>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 8, lg: 12 }}
                w="full"
              >
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box py={{ base: 16, lg: 24 }}>
          <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              spacing={{ base: 10, lg: 16 }}
              textAlign="center"
            >
              <VStack>
                <Heading 
                  size={{ base: "2xl", lg: "3xl" }}
                  color="brand.bitfood.500"
                >
                  {t('food.stats.restaurants')}
                </Heading>
                <Text fontSize={{ base: "lg", lg: "xl" }}>
                  {t('food.stats.restaurantsLabel')}
                </Text>
              </VStack>
              <VStack>
                <Heading 
                  size={{ base: "2xl", lg: "3xl" }}
                  color="brand.bitfood.500"
                >
                  {t('food.stats.deliveryTime')}
                </Heading>
                <Text fontSize={{ base: "lg", lg: "xl" }}>
                  {t('food.stats.deliveryTimeLabel')}
                </Text>
              </VStack>
              <VStack>
                <Heading 
                  size={{ base: "2xl", lg: "3xl" }}
                  color="brand.bitfood.500"
                >
                  {t('food.stats.rating')}
                </Heading>
                <Text fontSize={{ base: "lg", lg: "xl" }}>
                  {t('food.stats.ratingLabel')}
                </Text>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box 
          py={{ base: 16, lg: 24 }}
        >
          <Container maxW="4xl" px={{ base: 4, sm: 6, lg: 8 }}>
            <VStack spacing={{ base: 8, lg: 12 }} textAlign="center">
              <VStack spacing={4}>
                <GradientHeading
                  fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
                  bgGradient="linear(to-r, brand.bitfood.500, brand.bitfood.700)"
                >
                  {t('food.cta.title')}
                </GradientHeading>
                <Text
                  fontSize={{ base: "lg", lg: "xl" }}
                  color={useColorModeValue('gray.600', 'gray.400')}
                  maxW="2xl"
                >
                  {t('food.cta.description')}
                </Text>
              </VStack>

              <VStack spacing={6}>
                <Button
                  size="lg"
                  variant="bitfood-solid"
                  rightIcon={<Smartphone />}
                  h={{ base: 12, lg: 14 }}
                  px={{ base: 8, lg: 10 }}
                  fontSize={{ base: "md", lg: "lg" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  {t('food.cta.downloadButton')}
                </Button>
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'gray.400')}
                >
                  {t('food.cta.availableOn')}
                </Text>
              </VStack>
            </VStack>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default FoodLanding;                