import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  Container, 
  useColorMode, 
  VStack, 
  HStack, 
  Grid,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Store, ShoppingBag, MapPin, Truck } from 'lucide-react';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const PhoneScreen = ({ children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      w={{ base: "260px", md: "375px" }}
      h={{ base: "520px", md: "750px" }}
      borderRadius="3xl"
      overflow="hidden"
      position="relative"
      bg={isDark ? "gray.800" : "white"}
      boxShadow="2xl"
      border="14px solid"
      borderColor={isDark ? "gray.700" : "gray.200"}
      transition="transform 0.5s ease"
      mx="auto"
    >
      {children}
    </Box>
  );
};

const AnimatedPhoneContent = ({ content, scrollProgress, index }) => {
  // Calculate the progress for this specific section
  const sectionProgress = Math.max(0, Math.min(1, scrollProgress - index));
  
  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
      <motion.div
        style={{
          height: '100%',
          width: '100%',
          transform: `translateY(${sectionProgress * -20}px)`,
        }}
      >
        {/* Animated content specific to each section */}
        {index === 0 && (
          // Restaurant Selection Screen
          <motion.div
            initial="hidden"
            animate={sectionProgress > 0.2 ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: sectionProgress > (0.3 + i * 0.15) ? 1 : 0 
                }}
                transition={{ duration: 0.4 }}
              >
                <Box
                  w="full"
                  bg={isDark ? "gray.800" : "white"}
                  borderRadius="xl"
                  p={4}
                  my={2}
                  boxShadow="md"
                >
                  <HStack spacing={4}>
                    <Box 
                      w="60px" 
                      h="60px" 
                      bg="blue.500" 
                      borderRadius="lg"
                      transform={`scale(${Math.min(1, sectionProgress * 2)})`}
                    />
                    <VStack align="start" spacing={1}>
                      <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate={sectionProgress > (0.4 + i * 0.15) ? "visible" : "hidden"}
                      >
                        <Text fontWeight="bold">Restaurant {i + 1}</Text>
                        <Text fontSize="sm" color="gray.500">⭐️ 4.{8 - i} • 15-25 min</Text>
                      </motion.div>
                    </VStack>
                  </HStack>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        )}

        {index === 1 && (
          // Menu Selection Screen
          <motion.div
            style={{ height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionProgress > 0.2 ? 1 : 0 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: 0,
                  opacity: sectionProgress > (0.3 + i * 0.15) ? 1 : 0 
                }}
                transition={{ duration: 0.4 }}
              >
                <Box
                  w="full"
                  bg={isDark ? "gray.800" : "white"}
                  borderRadius="xl"
                  p={4}
                  my={2}
                  boxShadow="md"
                >
                  <HStack justify="space-between">
                    <motion.div
                      variants={textVariants}
                      initial="hidden"
                      animate={sectionProgress > (0.4 + i * 0.15) ? "visible" : "hidden"}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Menu Item {i + 1}</Text>
                        <Text fontSize="sm" color="gray.500">15.99 BIT</Text>
                      </VStack>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: sectionProgress > (0.5 + i * 0.15) ? 1 : 0 }}
                    >
                      <Box w="60px" h="60px" bg="green.500" borderRadius="lg" />
                    </motion.div>
                  </HStack>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        )}

        {index === 2 && (
          // Delivery Tracking Screen
          <motion.div
            style={{ height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionProgress > 0.2 ? 1 : 0 }}
          >
            <Box
              w="full"
              h="60%"
              bg={isDark ? "gray.800" : "white"}
              borderRadius="xl"
              p={4}
              position="relative"
              overflow="hidden"
            >
              <motion.div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, transparent 0%, rgba(72, 187, 120, 0.1) 100%)',
                  transform: `translateX(${-100 + sectionProgress * 100}%)`,
                }}
              />
              <motion.div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#48BB78',
                  position: 'absolute',
                  left: `${sectionProgress * 100}%`,
                  top: `${50 + Math.sin(sectionProgress * Math.PI) * 20}%`,
                }}
              />
            </Box>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0,
                opacity: sectionProgress > 0.6 ? 1 : 0 
              }}
            >
              <Box
                w="full"
                bg={isDark ? "gray.800" : "white"}
                borderRadius="xl"
                p={4}
                mt={4}
                boxShadow="md"
              >
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="bold">Estimated delivery: 15-20 mins</Text>
                  <Box w="full" h="2" bg="gray.200" borderRadius="full">
                    <motion.div
                      style={{
                        height: '100%',
                        backgroundColor: '#48BB78',
                        borderRadius: 'full',
                        width: `${sectionProgress * 60}%`,
                      }}
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    Your order is being prepared
                  </Text>
                </VStack>
              </Box>
            </motion.div>
          </motion.div>
        )}

        {index === 3 && (
          // Delivery Complete Screen
          <motion.div
            style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionProgress > 0.2 ? 1 : 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: sectionProgress > 0.4 ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Box
                w="120px"
                h="120px"
                borderRadius="full"
                bg="green.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="5xl"
                color="white"
                transform={`scale(${Math.min(1, sectionProgress * 1.5)})`}
              >
                ✓
              </Box>
            </motion.div>
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={sectionProgress > 0.6 ? "visible" : "hidden"}
            >
              <VStack spacing={2} mt={6}>
                <Heading size="lg">Order Delivered!</Heading>
                <Text color="gray.500" textAlign="center">
                  Don't forget to rate your experience
                </Text>
              </VStack>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </VStack>
  );
};

const ParallaxSection = ({ children, index, scrollProgress }) => {
  // Calculate opacity based on scroll progress
  const opacity = () => {
    const distance = Math.abs(scrollProgress - index);
    // Full opacity when section is in view
    if (distance < 0.5) return 1;
    // Gradual fade out as section moves away
    if (distance < 1.5) return 1 - (distance - 0.5);
    return 0;
  };

  return (
    <MotionBox
      height="100vh"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="sticky"
      top={0}
      style={{ opacity: opacity() }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </MotionBox>
  );
};

const DeluxeDeliveryFlow = () => {
  const containerRef = useRef();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const sections = [
    {
      icon: Store,
      title: "Browse Restaurants",
      description: "Discover local favorites and new places to eat. Filter by cuisine, price, or delivery time.",
      screen: (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ width: '100%' }}
            >
              <Box
                w="full"
                bg={isDark ? "gray.800" : "white"}
                borderRadius="xl"
                p={4}
                boxShadow="md"
              >
                <HStack spacing={4}>
                  <Box w="60px" h="60px" bg="blue.500" borderRadius="lg" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Restaurant {i + 1}</Text>
                    <Text fontSize="sm" color="gray.500">⭐️ 4.{8 - i} • 15-25 min</Text>
                  </VStack>
                </HStack>
              </Box>
            </motion.div>
          ))}
        </VStack>
      )
    },
    {
      icon: ShoppingBag,
      title: "Select Your Items",
      description: "Browse menus and customize your order with just a few taps.",
      screen: (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ width: '100%' }}
            >
              <Box
                w="full"
                bg={isDark ? "gray.800" : "white"}
                borderRadius="xl"
                p={4}
                boxShadow="md"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Menu Item {i + 1}</Text>
                    <Text fontSize="sm" color="gray.500">15.99 BIT</Text>
                  </VStack>
                  <Box w="60px" h="60px" bg="green.500" borderRadius="lg" />
                </HStack>
              </Box>
            </motion.div>
          ))}
        </VStack>
      )
    },
    {
      icon: Truck,
      title: "Track Your Order",
      description: "Watch your order being prepared and delivered in real-time.",
      screen: (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          <Box
            w="full"
            h="60%"
            bg={isDark ? "gray.800" : "white"}
            borderRadius="xl"
            p={4}
            boxShadow="md"
            position="relative"
            overflow="hidden"
          >
            <motion.div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#48BB78',
                position: 'absolute',
              }}
              animate={{
                x: ["0%", "100%"],
                y: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </Box>
          <Box
            w="full"
            bg={isDark ? "gray.800" : "white"}
            borderRadius="xl"
            p={4}
            boxShadow="md"
          >
            <VStack align="stretch" spacing={3}>
              <Text fontWeight="bold">Estimated delivery: 15-20 mins</Text>
              <Box w="full" h="2" bg="gray.200" borderRadius="full">
                <motion.div
                  style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: "#48BB78",
                    borderRadius: "full",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1 }}
                />
              </Box>
              <Text fontSize="sm" color="gray.500">Your order is being prepared</Text>
            </VStack>
          </Box>
        </VStack>
      )
    },
    {
      icon: MapPin,
      title: "Delivery Complete",
      description: "Rate your experience and earn rewards with BitCash.",
      screen: (
        <VStack spacing={8} p={8} h="full" justify="center" bg={isDark ? "gray.900" : "gray.50"}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              bg="green.500"
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
            <Heading size="lg">Order Delivered!</Heading>
            <Text color="gray.500" textAlign="center">
              Don't forget to rate your experience
            </Text>
          </VStack>
        </VStack>
      )
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(3, (scrolled / totalHeight) * 3));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box 
      ref={containerRef} 
      height="400vh"
      position="relative"
    >
      {sections.map((section, index) => (
        <ParallaxSection 
          key={index} 
          index={index}
          scrollProgress={scrollProgress}
        >
          <Container maxW={isMobile ? "100%" : "container.xl"} px={isMobile ? 4 : 8}>
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: 8, lg: 16 }}
              alignItems="center"
            >
              <VStack 
                spacing={6} 
                align={{ base: "center", lg: "start" }}
                order={{ base: 2, lg: 1 }}
              >
                <Box fontSize={{ base: "4xl", md: "6xl" }} color={isDark ? "white" : "black"}>
                  <section.icon />
                </Box>
                <MotionHeading
                  size={{ base: "xl", md: "2xl" }}
                  textAlign={{ base: "center", lg: "left" }}
                >
                  {section.title}
                </MotionHeading>
                <MotionText
                  fontSize={{ base: "md", md: "xl" }}
                  color="gray.500"
                  maxW="lg"
                  textAlign={{ base: "center", lg: "left" }}
                >
                  {section.description}
                </MotionText>
              </VStack>

              <Box order={{ base: 1, lg: 2 }}>
                <PhoneScreen>
                  {section.screen}
                </PhoneScreen>
              </Box>
            </Grid>
          </Container>
        </ParallaxSection>
      ))}
    </Box>
  );
};

export default DeluxeDeliveryFlow;