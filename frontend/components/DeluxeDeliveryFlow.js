import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  VStack, 
  HStack,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';

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

const DeluxeDeliveryFlow = () => {
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
            style={{ width: '100%' }}
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
      <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            style={{ width: '100%' }}
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
      <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
        <Box
          w="full"
          h="60%"
          bg={isDark ? "gray.800" : "white"}
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
              backgroundColor: useColorModeValue('#ffa78a', '#ff8963'),
              position: "absolute"
            }}
          />
        </Box>
        <Box
          w="full"
          bg={isDark ? "gray.800" : "white"}
          borderRadius="xl"
          p={4}
          boxShadow="md"
          borderWidth="1px"
          borderColor="brand.bitfood.500"
        >
          <VStack align="stretch" spacing={3}>
            <Text fontWeight="bold">{t('food.flow.estimatedDelivery')}</Text>
            <Box w="full" h="2" bg="gray.200" borderRadius="full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 2 }}
                style={{
                  height: "100%",
                  backgroundColor: useColorModeValue('#ffa78a', '#ff8963'),
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
        bg={isDark ? "gray.900" : "gray.50"}
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

export default DeluxeDeliveryFlow;