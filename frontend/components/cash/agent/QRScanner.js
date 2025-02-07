import React from 'react';
import QrReader from 'react-qr-reader-es6';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Logo from '@/components/Logo';

const QRScanner = ({ isOpen, onClose }) => {
  const router = useRouter();
  const toast = useToast();

  const handleScan = (data) => {
    if (data) {
      if (data.includes('/menu/')) {
        onClose();
        router.push(data);
      }
    }
  };

  const handleError = (err) => {
    console.error('Scan error:', err);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent bg="black">
        <DrawerCloseButton 
          color="white"
          bg="blackAlpha.600"
          borderRadius="full"
          size="lg"
          m={4}
          zIndex={2}
        />
        <DrawerBody p={0}>
          <Box position="relative" h="100vh">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{
                width: '100%',
                height: '100%',
              }}
              facingMode="environment"
              position="absolute"
              color="#1179be"
              border="2px solid #1179be"
              borderRadius="lg"
              zIndex={1}
            />
            <Text
              position="absolute"
              bottom="20%"
              left="50%"
              transform="translateX(-50%)"
              color="white"
              fontSize="xl"
              bg="blackAlpha.700"
              px={4}
              py={2}
              borderRadius="full"
              zIndex={1}
            >
              <Logo />
            </Text>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default QRScanner;