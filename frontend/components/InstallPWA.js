// components/InstallPrompt.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Image,
  useToast,
  IconButton,
  useColorMode,
  useBreakpointValue
} from '@chakra-ui/react';
import { X } from 'lucide-react';

/**
 * For domain-based icon switching.
 * Add more subdomains if needed.
 */
function getAppIconByDomain() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('Adfaly')) return '/Adfaly.png';
    if (hostname.includes('utlubha')) return '/utlubha.png';
  }
  // fallback
  return '/app-logo.png';
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();

  // We'll choose an icon once at mount
  const [iconSrc, setIconSrc] = useState('/bitdash-logo.png');

  // Responsive positioning
  const positioning = useBreakpointValue({
    base: {
      position: 'fixed',
      bottom: 4,
      left: 4,
      right: 4,
      width: 'auto',
      margin: 'auto',
      maxWidth: '400px',
    },
    md: {
      position: 'fixed',
      bottom: 6,
      right: 6,
      width: '300px',
    },
  });

  // Quirky messages array
  const quirkySlogans = [
    "Pssst, you can add us as a PWA (a cool app for your laptop) or on your phone!",
    "Yo, wanna make this website feel like a real app? We've got the magic sauce!",
    "One-click transformation from boring website to epic app. Interested? 👀",
    "Turn this website into your personal digital sidekick. Install now!",
    "App-ception incoming! Add us to your device and level up your experience.",
    "Be a tech wizard – install our PWA and impress your friends!"
  ];

  useEffect(() => {
    // Decide which icon to show at mount
    setIconSrc(getAppIconByDomain());

    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) return;

    // Check local storage for last shown timestamp
    const lastShownTimestamp = localStorage.getItem('installPromptLastShown');
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // Only show if never shown before or more than 7 days have passed
    if (!lastShownTimestamp || parseInt(lastShownTimestamp) < sevenDaysAgo) {
      const handleBeforeInstallPrompt = (e) => {
        // Prevent Chrome <68 from auto showing the prompt
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
        localStorage.setItem('installPromptLastShown', Date.now().toString());
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the native prompt
      const result = await deferredPrompt.prompt();
      console.log('Install prompt result:', result);

      // Clear it
      setDeferredPrompt(null);
      setShowPrompt(false);

      toast({
        title: 'App installed successfully!',
        description: 'Your digital companion is ready to roll!',
        status: 'success',
        duration: 3000,
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error installing app:', error);
      toast({
        title: 'Oops! Installation hiccup',
        description: 'Try again or install manually, tech ninja',
        status: 'error',
        duration: 3000,
        position: 'bottom-right',
      });
    }
  };

  if (!showPrompt) return null;

  // Random slogan
  const randomSlogan =
    quirkySlogans[Math.floor(Math.random() * quirkySlogans.length)];

  // Hard-coded black background
  const bgColor = 'black';
  const textColor = 'white';
  const borderColor = 'gray.600';

  return (
    <Box
      {...positioning}
      bg={bgColor}
      boxShadow="lg"
      borderRadius="lg"
      p={4}
      zIndex={1000}
      border="2px solid"
      borderColor={borderColor}
    >
      <VStack spacing={3} align="stretch">
        <HStack justifyContent="space-between" alignItems="center">
          <HStack>
            <Image
              src={iconSrc}
              alt="App Icon"
              boxSize="40px"
              borderRadius="md"
            />
            <Text fontWeight="bold" color={textColor}>
              Add to Your Device
            </Text>
          </HStack>
          <IconButton
            icon={<X size={20} />}
            variant="ghost"
            colorScheme="whiteAlpha"
            size="sm"
            onClick={() => setShowPrompt(false)}
            aria-label="Close install prompt"
          />
        </HStack>

        <Text fontSize="sm" color={textColor}>
          {randomSlogan}
        </Text>

        <HStack>
          <Button colorScheme="blue" size="sm" onClick={handleInstall} flex={1}>
            Install Now
          </Button>
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            size="sm"
            onClick={() => setShowPrompt(false)}
          >
            Nah, Later
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default InstallPrompt;