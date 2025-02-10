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
  useBreakpointValue,
  Badge,
  Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Package, 
  Truck, 
  TrendingUp, 
  CheckCircle
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const PhoneScreen = ({ children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const screenSize = useBreakpointValue({ 
    base: { width: "280px", height: "560px" },
    md: { width: "375px", height: "750px" }
  });

  return (
    <Box
      w={screenSize?.width || "280px"}
      h={screenSize?.height || "560px"}
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

const AnimatedPhoneContent = ({ scrollProgress, index }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Calculate the progress for this specific section
  const sectionProgress = Math.max(0, Math.min(1, scrollProgress - index));
  
  return (
    <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
      <motion.div
        style={{
          height: '100%',
          width: '100%',
          transform: `translateY(${sectionProgress * -20}px)`,
        }}
      >
        {index === 0 && (
          // Store Setup Screen
          <motion.div
            initial="hidden"
            animate={sectionProgress > 0.02 ? "visible" : "visible"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 100, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: sectionProgress > (0.03 + i * 0.015) ? 1 : 0 
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
                      bg="brand.bitshop.500" 
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Store color="white" size={30} />
                    </Box>
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold">BitShop Store</Text>
                      <Text fontSize="sm" color="gray.500">Store Setup</Text>
                    </VStack>
                    <Badge colorScheme="orange">Pending</Badge>
                  </HStack>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        )}

        {index === 1 && (
          // Product Management Screen
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
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Box 
                        w="60px" 
                        h="60px" 
                        bg="green.500" 
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Package color="white" size={30} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Wireless Headphones</Text>
                        <Text fontSize="sm" color="gray.500">$129.99</Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green">In Stock</Badge>
                  </HStack>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        )}

        {index === 2 && (
          // Fulfillment Tracking Screen
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
              boxShadow="md"
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
              <VStack align="start" spacing={3} h="full" justify="center">
                <HStack w="full" justify="space-between">
                  <Text fontWeight="bold">Order #1234</Text>
                  <Badge colorScheme="green">In Transit</Badge>
                </HStack>
                <Flex w="full" align="center">
                  <Truck color="#48BB78" size={30} />
                  <Box flex={1} h="2" bg="gray.200" mx={3} position="relative">
                    <motion.div
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: `${sectionProgress * 100}%`,
                        backgroundColor: '#48BB78',
                        borderRadius: 'full'
                      }}
                    />
                  </Box>
                </Flex>
                <Text fontSize="sm" color="gray.500">Estimated Delivery: 15-20 mins</Text>
              </VStack>
            </Box>
            <Box
              w="full"
              bg={isDark ? "gray.700" : "gray.100"}
              borderRadius="xl"
              p={4}
              mt={4}
              boxShadow="md"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">Tracking Details</Text>
                  <Text fontSize="sm" color="gray.500">Last Updated: Just Now</Text>
                </VStack>
                <CheckCircle color="green" size={20} />
              </HStack>
            </Box>
          </motion.div>
        )}

        {index === 3 && (
          // Business Insights Screen
          <motion.div
            style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: sectionProgress > 0.02 ? 1 : 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: sectionProgress > 0.04 ? 1 : 0 }}
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
                color="white"
                transform={`scale(${Math.min(1, sectionProgress * 1.5)})`}
              >
                <TrendingUp size={60} />
              </Box>
            </motion.div>
            <VStack 
              spacing={4} 
              mt={6} 
              w="full" 
              px={4}
            >
              <Box
                w="full"
                bg={isDark ? "gray.800" : "white"}
                borderRadius="xl"
                p={4}
                boxShadow="md"
              >
                <VStack spacing={3} w="full">
                  <HStack w="full" justify="space-between">
                    <Text fontWeight="bold">Monthly Revenue</Text>
                    <Text color="green.500">+32%</Text>
                  </HStack>
                  <HStack w="full" justify="space-between">
                    <Text>Total Sales</Text>
                    <Text fontWeight="bold">$5,420</Text>
                  </HStack>
                  <HStack w="full" justify="space-between">
                    <Text>New Customers</Text>
                    <Text fontWeight="bold">124</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
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

const ShopSignupFlow = () => {
  const containerRef = useRef();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const sections = [
    {
      icon: Store,
      title: "Create Your Store",
      description: "Set up your online business in minutes with our simple verification process.",
      screen: (progress) => <AnimatedPhoneContent scrollProgress={progress} index={0} />
    },
    {
      icon: Package,
      title: "Add Your Products",
      description: "Showcase your products with rich descriptions and pricing.",
      screen: (progress) => <AnimatedPhoneContent scrollProgress={progress} index={1} />
    },
    {
      icon: Truck,
      title: "Fulfillment Tracking",
      description: "Monitor your orders from processing to delivery.",
      screen: (progress) => <AnimatedPhoneContent scrollProgress={progress} index={2} />
    },
    {
      icon: TrendingUp,
      title: "Business Insights",
      description: "Track performance and grow your business with detailed analytics.",
      screen: (progress) => <AnimatedPhoneContent scrollProgress={progress} index={3} />
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
                  {section.screen(scrollProgress)}
                </PhoneScreen>
              </Box>
            </Grid>
          </Container>
        </ParallaxSection>
      ))}
    </Box>
  );
};

export default ShopSignupFlow;