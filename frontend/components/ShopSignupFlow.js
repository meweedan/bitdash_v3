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
  useTheme,
  Flex
} from '@chakra-ui/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Store, Package, Truck, Warehouse, ShoppingBag, Check } from 'lucide-react';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);
const MotionFlex = motion(Flex);

const PhoneScreen = ({ children, platform }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const theme = useTheme();
  const platformColor = theme.colors.brand[platform];
  
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
      boxShadow={`0 0 40px ${platformColor[200]}33`}
      border="14px solid"
      borderColor={isDark ? "gray.700" : platformColor[50]}
      transition="all 0.5s ease"
      mx="auto"
      _hover={{
        boxShadow: `0 0 60px ${platformColor[200]}66`,
        transform: "translateY(-8px)"
      }}
    >
      {children}
    </Box>
  );
};

const ShopSignupFlow = ({ platform = 'bitshop' }) => {
  const containerRef = useRef();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const platformColor = theme.colors.brand[platform];
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Use useScroll instead of useState for scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const sections = [
    {
      title: "Quick Shop Setup",
      description: "Create your online store in minutes with easy verification",
      icon: Store,
      screen: (progress) => (
        <VStack 
          spacing={4} 
          p={4} 
          h="full" 
          bg={isDark ? "gray.900" : "gray.50"}
          position="relative"
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: progress > 0 ? 1 : 0,
              y: progress > 0 ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={6} w="full" p={4}>
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                bg={platformColor[500]}
                mb={4}
              />
              <VStack spacing={4} w="full">
                {[...Array(3)].map((_, i) => (
                  <MotionBox
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ 
                      x: progress > 0.2 + (i * 0.1) ? 0 : -20,
                      opacity: progress > 0.2 + (i * 0.1) ? 1 : 0 
                    }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    w="full"
                  >
                    <Box
                      w="full"
                      h="12"
                      bg={isDark ? "gray.800" : "white"}
                      borderRadius="lg"
                      p={3}
                    />
                  </MotionBox>
                ))}
              </VStack>
            </VStack>
          </MotionBox>
        </VStack>
      )
    },
    {
      title: "List Your Products",
      description: "Add products with rich descriptions and pricing",
      icon: Package,
      screen: (progress) => (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          {[...Array(4)].map((_, i) => (
            <MotionBox
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: progress > 0.2 + (i * 0.1) ? 0 : -20,
                opacity: progress > 0.2 + (i * 0.1) ? 1 : 0 
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              w="full"
            >
              <HStack
                w="full"
                bg={isDark ? "gray.800" : "white"}
                p={4}
                borderRadius="xl"
                spacing={4}
              >
                <Box
                  w="60px"
                  h="60px"
                  bg={platformColor[500]}
                  borderRadius="md"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Product {i + 1}</Text>
                  <Text fontSize="sm" color="gray.500">$19.99</Text>
                  <Badge colorScheme="green">In Stock</Badge>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </VStack>
      )
    },
    {
      title: "Fulfilled by BitShop",
      description: "We handle storage and shipping",
      icon: Warehouse,
      screen: (progress) => (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          <Box
            w="full"
            h="60%"
            bg={isDark ? "gray.800" : "white"}
            borderRadius="xl"
            p={4}
            position="relative"
            overflow="hidden"
          >
            <MotionBox
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              {[...Array(3)].map((_, i) => (
                <MotionBox
                  key={i}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ 
                    x: progress > 0.3 + (i * 0.1) ? 0 : -100,
                    opacity: progress > 0.3 + (i * 0.1) ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                >
                  <HStack spacing={4}>
                    <Box w="40px" h="40px" bg={platformColor[500]} borderRadius="md" />
                    <Box flex={1} h="4px" bg={platformColor[500]} borderRadius="full" />
                    <Box w="40px" h="40px" bg="green.500" borderRadius="md">
                      <Check />
                    </Box>
                  </HStack>
                </MotionBox>
              ))}
            </MotionBox>
          </Box>
        </VStack>
      )
    },
    {
      title: "Start Selling",
      description: "Focus on growing your business",
      icon: ShoppingBag,
      screen: (progress) => (
        <VStack spacing={4} p={4} h="full" bg={isDark ? "gray.900" : "gray.50"}>
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ 
              scale: progress > 0.3 ? 1 : 0 
            }}
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
              bg="green.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Check size={60} color="white" />
            </Box>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: progress > 0.5 ? 1 : 0,
              y: progress > 0.5 ? 0 : 20 
            }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} pt={8}>
              <Heading size="md">Ready to Go!</Heading>
              <Text color="gray.500" textAlign="center">
                Your shop is now live
              </Text>
            </VStack>
          </MotionBox>
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
        <motion.div
          key={index}
          style={{
            height: "100vh",
            width: "100%",
            position: "sticky",
            top: 0,
            // Calculate opacity based on scroll position
            opacity: useTransform(
              scrollYProgress,
              [index/3, (index+1)/3, (index+2)/3],
              [0, 1, 0]
            )
          }}
        >
          <Container maxW="8xl" h="full">
            <Grid
              h="full"
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: 8, lg: 16 }}
              alignItems="center"
            >
              <VStack 
                spacing={6} 
                align={{ base: "center", lg: "start" }}
                order={{ base: 2, lg: 1 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Box fontSize={{ base: "4xl", md: "6xl" }} color={platformColor[500]}>
                    <section.icon />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Heading
                    size={{ base: "xl", md: "2xl" }}
                    textAlign={{ base: "center", lg: "left" }}
                  >
                    {section.title}
                  </Heading>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Text
                    fontSize={{ base: "md", md: "xl" }}
                    color="gray.500"
                    maxW="lg"
                    textAlign={{ base: "center", lg: "left" }}
                  >
                    {section.description}
                  </Text>
                </motion.div>
              </VStack>

              <Box order={{ base: 1, lg: 2 }}>
                <PhoneScreen platform={platform}>
                  {section.screen(useTransform(
                    scrollYProgress,
                    [(index)/3, (index+0.5)/3, (index+1)/3],
                    [0, 1, 0]
                  ))}
                </PhoneScreen>
              </Box>
            </Grid>
          </Container>
        </motion.div>
      ))}
    </Box>
  );
};

export default ShopSignupFlow;