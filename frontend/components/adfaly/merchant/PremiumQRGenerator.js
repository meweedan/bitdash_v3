// components/Adfaly/merchant/PremiumQRGenerator.js
import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  useColorModeValue,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tabs,
  Divider,
  Badge,
  Image,
  Input,
  FormControl,
  FormLabel,
  Switch,
  useToast,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiDownload, FiShoppingCart, FiEye, FiCopy, FiShare2 } from 'react-icons/fi';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

const PremiumQRGenerator = ({ 
  isOpen, 
  onClose, 
  merchantData,
  onOrder 
}) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showLogo, setShowLogo] = useState(true);
  const [previewMode, setPreviewMode] = useState('digital');
  const qrRef = useRef();
  const toast = useToast();

  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );

  const qrStyles = {
    default: {
      bgColor: '#FFFFFF',
      fgColor: '#1179BE',
      logoImage: '/images/adfaly-logo.png'
    },
    premium: {
      bgColor: '#000000',
      fgColor: '#FFFFFF',
      logoImage: '/images/adfaly-logo-white.png'
    },
    modern: {
      bgColor: '#1A1A1A',
      fgColor: '#00F6FF',
      logoImage: '/images/adfaly-logo-blue.png'
    }
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(qrRef.current);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${merchantData.businessName}-QR.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    const paymentUrl = `https://Adfaly.bitdash.app/pay/${merchantData.id}`;
    navigator.clipboard.writeText(paymentUrl);
    toast({
      title: 'Link Copied',
      status: 'success',
      duration: 2000
    });
  };

  const handleShare = async () => {
    const paymentUrl = `https://Adfaly.bitdash.app/pay/${merchantData.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${merchantData.businessName}`,
          text: 'Scan or click to pay',
          url: paymentUrl
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const QRDisplay = () => (
    <Box
      ref={qrRef}
      p={8}
      bgGradient={bgGradient}
      borderRadius="xl"
      width="12in"
      height="8in"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{ transform: previewMode === 'digital' ? 'scale(0.2)' : 'none' }}
    >
      {/* Merchant Logo or Name */}
      {merchantData.logo ? (
        <Image
          src={merchantData.logo}
          alt={merchantData.businessName}
          width="100px"
          height="100px"
          borderRadius="full"
          mb={4}
        />
      ) : (
        <Text
          fontSize="24px"
          fontWeight="bold"
          color="white"
          mb={4}
        >
          {merchantData.businessName}
        </Text>
      )}

      {/* QR Code */}
      <Box
        bg="white"
        p={6}
        borderRadius="2xl"
        boxShadow="xl"
      >
        <QRCode
          value={`https://Adfaly.bitdash.app/pay/${merchantData.id}`}
          size={300}
          level="H"
          bgColor={qrStyles[selectedTheme].bgColor}
          fgColor={qrStyles[selectedTheme].fgColor}
          imageSettings={showLogo ? {
            src: qrStyles[selectedTheme].logoImage,
            height: 60,
            width: 60,
            excavate: true
          } : undefined}
        />
      </Box>

      {/* Branding */}
      <VStack mt={6} spacing={2}>
        <Text
          color="white"
          fontSize="18px"
          fontWeight="bold"
        >
          Powered by BitDash
        </Text>
        <Text
          color="white"
          fontSize="18px"
          fontFamily="sans-serif"
          dir="rtl"
        >
          مدعوم من بت داش
        </Text>
      </VStack>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Premium QR Code Generator</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={4}>
              <Tab>Customize</Tab>
              <Tab>Preview</Tab>
              <Tab>Order Options</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <HStack spacing={4}>
                      {Object.keys(qrStyles).map(style => (
                        <Button
                          key={style}
                          onClick={() => setSelectedTheme(style)}
                          variant={selectedTheme === style ? 'solid' : 'outline'}
                          colorScheme="blue"
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </Button>
                      ))}
                    </HStack>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Show BitCash Logo</FormLabel>
                    <Switch
                      isChecked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      colorScheme="blue"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6}>
                  <Box
                    position="relative"
                    width="full"
                    height="500px"
                    overflow="hidden"
                    border="2px dashed"
                    borderColor="gray.200"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <QRDisplay />
                  </Box>

                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiDownload />}
                      onClick={handleDownload}
                      colorScheme="blue"
                    >
                      Download
                    </Button>
                    <Button
                      leftIcon={<FiCopy />}
                      onClick={handleCopyLink}
                    >
                      Copy Link
                    </Button>
                    <Button
                      leftIcon={<FiShare2 />}
                      onClick={handleShare}
                    >
                      Share
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box
                    p={6}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Premium QR Frame</Heading>
                      <Text>High-quality 12" x 8" frame with your custom QR code</Text>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">50 LYD</Text>
                        <Button
                          colorScheme="blue"
                          leftIcon={<FiShoppingCart />}
                          onClick={() => onOrder('frame')}
                        >
                          Order Frame
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>

                  <Box
                    p={6}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Welcome Pack</Heading>
                      <Text>Complete merchant starter kit including:</Text>
                      <UnorderedList>
                        <ListItem>Premium QR Frame</ListItem>
                        <ListItem>Business Card Holder</ListItem>
                        <ListItem>Merchant Guide</ListItem>
                        <ListItem>BitCash Stickers</ListItem>
                        <ListItem>Table Stands</ListItem>
                      </UnorderedList>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">150 LYD</Text>
                        <Button
                          colorScheme="purple"
                          leftIcon={<FiShoppingCart />}
                          onClick={() => onOrder('welcomePack')}
                        >
                          Order Welcome Pack
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PremiumQRGenerator;