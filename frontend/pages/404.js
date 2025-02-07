import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const MotionBox = motion(Box);

export default function Custom404() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [randomDigits, setRandomDigits] = useState(['4', '0', '4']);

  // Colors for the theme
  const colors = {
    primary: '#0066CC',
    secondary: '#0099FF',
    accent: isDark ? '#00BFFF' : '#003366',
    bg: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    subtext: isDark ? '#A0AEC0' : '#4A5568',
  };

  // Scramble effect for numbers
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setRandomDigits(prev => prev.map(() => Math.floor(Math.random() * 10).toString()));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setRandomDigits(['4', '0', '4']);
      }, 500);
    }
  }, [isHovered]);

  return (
    <Layout>
        <Head>
        <title>{`${t('404')}`}</title>
        <link href="/favicon.ico" rel="icon"/>
      </Head>
      <Container maxW="container.xl" h="70vh" position="relative" overflow="hidden">
        {/* Background Grid */}
        <Box
          position="absolute"
          inset={0}
          bgImage={`radial-gradient(${colors.accent}20 1px, transparent 1px)`}
          bgSize="30px 30px"
          opacity={0.5}
        />

        {/* Main Content */}
        <VStack
          spacing={8}
          justify="center"
          h="full"
          position="relative"
          zIndex={2}
        >
          {/* Animated 404 */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Heading
              fontSize={{ base: "8rem", md: "15rem" }}
              fontWeight="bold"
              letterSpacing="wider"
              bgGradient={`linear(to-r, ${colors.primary}, ${colors.secondary})`}
              bgClip="text"
              position="relative"
              sx={{
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-20px)' }
                },
                animation: 'float 3s ease-in-out infinite',
                '&::before, &::after': {
                  content: '"404"',
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  mixBlendMode: 'multiply'
                },
                '&::before': {
                  left: '2px',
                  color: colors.accent,
                  animation: 'glitch 3s infinite linear alternate-reverse'
                },
                '&::after': {
                  left: '-2px',
                  color: colors.primary,
                  animation: 'glitch 2s infinite linear alternate-reverse'
                },
                '@keyframes glitch': {
                  '0%': {
                    clipPath: 'polygon(0 2%, 100% 2%, 100% 5%, 0 5%)',
                    transform: 'translate(0)'
                  },
                  '20%': {
                    clipPath: 'polygon(0 15%, 100% 15%, 100% 15%, 0 15%)',
                    transform: 'translate(-5px)'
                  },
                  '40%': {
                    clipPath: 'polygon(0 10%, 100% 10%, 100% 20%, 0 20%)',
                    transform: 'translate(5px)'
                  },
                  '60%': {
                    clipPath: 'polygon(0 1%, 100% 1%, 100% 2%, 0 2%)',
                    transform: 'translate(-5px)'
                  },
                  '80%': {
                    clipPath: 'polygon(0 33%, 100% 33%, 100% 33%, 0 33%)',
                    transform: 'translate(0)'
                  },
                  '100%': {
                    clipPath: 'polygon(0 44%, 100% 44%, 100% 44%, 0 44%)',
                    transform: 'translate(5px)'
                  }
                }
              }}
            >
              {randomDigits.join('')}
            </Heading>
          </MotionBox>

          {/* Error Message */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            textAlign="center"
          >
            <Heading
              size="xl"
              mb={4}
              bgGradient={`linear(to-r, ${colors.primary}, ${colors.secondary})`}
              bgClip="text"
            >
              {t('pageNotFound')}
            </Heading>
            <Text 
              fontSize="xl" 
              color={colors.subtext} 
              maxW="xl" 
              mx="auto"
              px={4}
            >
              {t('pageNotFoundMessage')}
            </Text>
          </MotionBox>

          {/* Back Button */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              leftIcon={<ArrowLeft />}
              size="lg"
              bg={colors.primary}
              color="white"
              _hover={{
                bg: colors.secondary,
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
              onClick={() => router.push('/')}
              px={8}
              py={6}
              fontSize="xl"
            >
              {t('backToHome')}
            </Button>
          </MotionBox>

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <MotionBox
              key={i}
              position="absolute"
              w="4px"
              h="4px"
              bg={colors.accent}
              borderRadius="full"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </VStack>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}