import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Box, useColorModeValue, VStack, HStack, Text } from '@chakra-ui/react';
import { Car, MapPin, Navigation2, Clock, User, Shield, Star } from 'lucide-react';
import { useBreakpointValue } from '@chakra-ui/react';

const RideAnimation = () => {
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  // Get breakpoint to adjust sizes
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Theme colors using new BitRide palette
  const primaryColor = useColorModeValue('#e6c093', '#edb26d');
  const accentColor = useColorModeValue('#ebcdab', '#c6a783');
  const bgColor = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)');
  const textColor = useColorModeValue('gray.800', 'white');
  const gridColor = useColorModeValue('rgba(230,192,147,0.2)', 'rgba(237,178,109,0.2)');

  // Adjust sizes for mobile
  const phoneWidth = useBreakpointValue({ base: '220px', md: '280px' });
  const phoneHeight = useBreakpointValue({ base: '450px', md: '580px' });
  const carSize = useBreakpointValue({ base: 32, md: 48 });
  const iconSize = useBreakpointValue({ base: 16, md: 24 });

  // Phone interface with responsive sizing
  const PhoneInterface = () => (
    <VStack spacing={3} height="100%" p={3}>
      {/* Status Bar */}
      <HStack justify="space-between" w="full" px={2}>
        <Clock size={isMobile ? 12 : 16} />
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <User size={isMobile ? 12 : 16} color={primaryColor} />
        </motion.div>
      </HStack>

      {/* Map Area - Adjusted for mobile */}
      <Box
        position="relative"
        w="full"
        h="50%"
        borderRadius="xl"
        overflow="hidden"
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        {/* Responsive Grid Background */}
        <motion.div
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            backgroundImage: `
              linear-gradient(${gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? '15px 15px' : '20px 20px',
            transform: 'rotateX(60deg) translateY(-50%)',
          }}
          animate={{
            y: [0, isMobile ? -15 : -20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Route Points - Adjusted positioning */}
        <motion.div style={{ position: 'absolute', left: '25%', top: '65%' }}>
          <MapPin size={iconSize} color={primaryColor} />
        </motion.div>
        <motion.div style={{ position: 'absolute', right: '25%', top: '35%' }}>
          <Navigation2 size={iconSize} color={primaryColor} />
        </motion.div>

        {/* Moving Car - Adjusted animation range */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [isMobile ? -30 : -50, isMobile ? 30 : 50],
            y: [isMobile ? -15 : -20, isMobile ? 15 : 20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <Car size={iconSize} color={primaryColor} />
        </motion.div>
      </Box>

      {/* Ride Details - Adjusted spacing */}
      <VStack 
        w="full" 
        bg={useColorModeValue('white', 'gray.800')} 
        p={isMobile ? 3 : 4} 
        borderRadius="xl"
        align="start"
        spacing={2}
      >
        <Text fontWeight="bold" fontSize={isMobile ? "xs" : "sm"}>Your BitRide</Text>
        <HStack justify="space-between" w="full">
          <HStack spacing={2}>
            <Car size={isMobile ? 14 : 16} color={primaryColor} />
            <Text fontSize={isMobile ? "xs" : "sm"}>Luxury Sedan</Text>
          </HStack>
          <Text fontSize={isMobile ? "xs" : "sm"} color={primaryColor}>3 mins away</Text>
        </HStack>
        
        <motion.div
          style={{ width: '100%' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Box h="2px" bg={primaryColor} />
        </motion.div>
      </VStack>

      {/* Driver Info - Adjusted for mobile */}
      <HStack 
        w="full" 
        bg={useColorModeValue('white', 'gray.800')} 
        p={isMobile ? 3 : 4} 
        borderRadius="xl"
        justify="space-between"
      >
        <HStack spacing={2}>
          <Box
            w={isMobile ? "30px" : "40px"}
            h={isMobile ? "30px" : "40px"}
            borderRadius="full"
            bg={primaryColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <User size={isMobile ? 16 : 20} color="white" />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize={isMobile ? "xs" : "sm"}>James Wilson</Text>
            <HStack spacing={1}>
              <Star size={isMobile ? 10 : 12} fill={primaryColor} color={primaryColor} />
              <Text fontSize={isMobile ? "2xs" : "xs"}>4.9</Text>
            </HStack>
          </VStack>
        </HStack>
        <Shield size={isMobile ? 16 : 20} color={primaryColor} />
      </HStack>
    </VStack>
  );

  // Main return with responsive scaling
  return (
    <Box
      ref={containerRef}
      position="relative"
      height="100%"
      width="100%"
      overflow="hidden"
      style={{ perspective: isMobile ? '800px' : '1000px' }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        initial={{ rotateX: isMobile ? 15 : 20, rotateY: isMobile ? -15 : -20 }}
        animate={{ 
          rotateX: isMobile ? [15, 18, 15] : [20, 25, 20], 
          rotateY: isMobile ? [-15, -12, -15] : [-20, -15, -20] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Background Grid - Adjusted scale for mobile */}
        <motion.div
          style={{
            position: 'absolute',
            width: '400%',
            height: '400%',
            top: '-150%',
            left: '-150%',
            backgroundImage: `
              linear-gradient(${gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? '30px 30px' : '40px 40px',
            transform: 'rotateX(60deg)',
          }}
          animate={{
            backgroundPosition: ['0px 0px', isMobile ? '30px 30px' : '40px 40px']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Main Car - Adjusted animation range */}
        <motion.div
          style={{
            position: 'absolute',
            left: isMobile ? '20%' : '30%',
            top: '50%',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            x: isMobile ? [-100, 100] : [-200, 200],
            y: isMobile ? [-50, 50] : [-100, 100],
            rotateY: [0, -45],
            z: [0, isMobile ? 50 : 100]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <motion.div style={{ transform: `scale(${isMobile ? 1.5 : 2})` }}>
            <Car 
              size={carSize}
              color={primaryColor}
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
            />
          </motion.div>
        </motion.div>

        {/* Phone - Adjusted size and position */}
        <motion.div
          style={{
            position: 'absolute',
            right: isMobile ? '5%' : '10%',
            top: '50%',
            width: phoneWidth,
            height: phoneHeight,
            transformStyle: 'preserve-3d',
            transform: `translate(0, -50%) rotateY(${isMobile ? -15 : -20}deg)`,
          }}
          animate={{
            rotateY: isMobile ? [-15, -12, -15] : [-20, -15, -20],
            y: ['-50%', '-48%', '-50%']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            position="relative"
            width="100%"
            height="100%"
            borderRadius={isMobile ? "30px" : "40px"}
            bg={bgColor}
            border={isMobile ? "10px solid" : "14px solid"}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            overflow="hidden"
            boxShadow="2xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <PhoneInterface />
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default RideAnimation;