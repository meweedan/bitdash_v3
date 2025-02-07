import React, { useState } from 'react';
import { Box, useColorMode, Icon, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Car, 
  MapPin, 
  Clock, 
  Lock, 
  User, 
  CheckCircle, 
  Bell, 
  Phone,
  Navigation,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const MotionBox = motion(Box);

const SafetyFeature = ({ icon: FeatureIcon, title, description, x, y, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const primaryColor = useColorModeValue('#e6c093', '#edb26d');
  
  return (
    <MotionBox
      position="absolute"
      left={x}
      top={y}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <VStack spacing={2} align="center">
        <MotionBox
          animate={{
            boxShadow: isHovered 
              ? `0 0 20px ${primaryColor}` 
              : '0 0 0px transparent'
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            as={FeatureIcon} 
            boxSize={8} 
            color={primaryColor}
            filter={`drop-shadow(0 0 8px ${primaryColor})`}
          />
        </MotionBox>
        
        <AnimatePresence>
          {isHovered && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              bg={useColorModeValue('white', 'gray.800')}
              p={3}
              borderRadius="xl"
              boxShadow="xl"
              maxW="200px"
              textAlign="center"
              zIndex={100}
            >
              <Text fontWeight="bold" mb={1}>{title}</Text>
              <Text fontSize="sm">{description}</Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </MotionBox>
  );
};

const SafetyAnimation = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const primaryColor = useColorModeValue('#e6c093', '#edb26d');
  const bgGradient = useColorModeValue(
    'radial-gradient(circle, rgba(230,192,147,0.1) 0%, rgba(255,255,255,0) 70%)',
    'radial-gradient(circle, rgba(237,178,109,0.1) 0%, rgba(0,0,0,0) 70%)'
  );

  const safetyFeatures = [
    {
      icon: Shield,
      title: "Driver Verification",
      description: "All drivers undergo rigorous background checks",
      x: "20%",
      y: "30%"
    },
    {
      icon: Navigation,
      title: "Live Tracking",
      description: "Share your ride with trusted contacts",
      x: "80%",
      y: "30%"
    },
    {
      icon: Bell,
      title: "24/7 Support",
      description: "Immediate assistance whenever you need it",
      x: "35%",
      y: "70%"
    },
    {
      icon: UserCheck,
      title: "Identity Verification",
      description: "Multi-factor authentication for all rides",
      x: "65%",
      y: "70%"
    }
  ];

  // Animated Car Path
  const carPath = {
    initial: { x: "-50%", y: "50%" },
    animate: {
      x: ["-50%", "150%"],
      y: ["50%", "50%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <Box 
      position="relative" 
      h="500px" 
      overflow="hidden" 
      borderRadius="2xl"
      bg={bgGradient}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at center, ${primaryColor}11 0%, transparent 70%),
          linear-gradient(${primaryColor}05 1px, transparent 1px),
          linear-gradient(90deg, ${primaryColor}05 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 20px 20px, 20px 20px',
        animation: 'pulse 4s ease-in-out infinite'
      }}
    >
      {/* Central Shield Pulse */}
      <MotionBox
        position="absolute"
        left="50%"
        top="50%"
        style={{ x: "-50%", y: "-50%" }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon 
          as={Shield} 
          boxSize={24} 
          color={primaryColor}
          filter={`drop-shadow(0 0 20px ${primaryColor})`}
        />
      </MotionBox>

      {/* Moving Car with Safety Indicator */}
      <MotionBox
        position="absolute"
        variants={carPath}
        initial="initial"
        animate="animate"
      >
        <VStack spacing={1}>
          <Icon 
            as={Car} 
            boxSize={10} 
            color={primaryColor}
            filter={`drop-shadow(0 0 10px ${primaryColor})`}
          />
          <MotionBox
            width="40px"
            height="2px"
            bg={primaryColor}
            animate={{
              opacity: [0.4, 1, 0.4],
              width: ["30px", "50px", "30px"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </VStack>
      </MotionBox>

      {/* Safety Features */}
      {safetyFeatures.map((feature, index) => (
        <SafetyFeature
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          x={feature.x}
          y={feature.y}
          delay={index * 0.2}
        />
      ))}

      {/* Connection Lines */}
      {safetyFeatures.map((_, index) => (
        <MotionBox
          key={`line-${index}`}
          position="absolute"
          left="50%"
          top="50%"
          width="100px"
          height="1px"
          bg={primaryColor}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            rotate: index * 90
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.5
          }}
          style={{
            transformOrigin: "left center"
          }}
        />
      ))}

      {/* Pulse Rings */}
      {[1, 2, 3].map((index) => (
        <MotionBox
          key={`ring-${index}`}
          position="absolute"
          left="50%"
          top="50%"
          width="200px"
          height="200px"
          borderRadius="full"
          border={`1px solid ${primaryColor}`}
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </Box>
  );
};

export default SafetyAnimation;