// components/modals/WalletQRModal.js
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Box,
  HStack,
  useToast,
  useClipboard,
  Divider
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiCopy, FiShare2, FiLink } from 'react-icons/fi';

const WalletQRModal = ({ isOpen, onClose, walletData, profileId }) => {
  const toast = useToast();
  
  // Ensure we have a valid profile ID, either from props or from walletData
  const customerId = profileId || walletData?.customer?.data?.id || walletData?.customer?.id;
  const paymentLink = customerId 
    ? `https://Adfaly.bitdash.app/profile/${customerId}`
    : '';

  const { hasCopied: hasWalletCopied, onCopy: onWalletCopy } = useClipboard(walletData.walletId);
  const { hasCopied: hasLinkCopied, onCopy: onLinkCopy } = useClipboard(paymentLink);

  const handleShare = async () => {
    if (!customerId) {
      toast({
        title: 'Error',
        description: 'Unable to generate payment link. Profile ID not found.',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Payment Link',
          text: `Send me money using my BitCash payment link`,
          url: paymentLink
        });
      } catch (err) {
        console.error('Share failed:', err);
        onLinkCopy();
        toast({
          title: 'Link Copied Instead',
          description: 'The payment link has been copied to your clipboard',
          status: 'success',
          duration: 2000
        });
      }
    } else {
      onLinkCopy();
      toast({
        title: 'Payment Link Copied',
        description: 'The payment link has been copied to your clipboard',
        status: 'success',
        duration: 2000
      });
    }
  };

  const qrBackground = useColorModeValue('white', 'gray.800');
  const qrForeground = useColorModeValue('#1A202C', '#FFFFFF');

  // Don't render if we don't have a valid customer ID
  if (!customerId) {
    toast({
      title: 'Error',
      description: 'Unable to generate QR code. Profile ID not found.',
      status: 'error',
      duration: 3000
    });
    onClose();
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Your Payment QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} pb={6}>
            <Box
              p={4}
              bg={qrBackground}
              borderRadius="xl"
              boxShadow="md"
              position="relative"
            >
              <QRCodeCanvas
                value={paymentLink}
                size={250}
                level="H"
                bgColor={qrBackground}
                fgColor={qrForeground}
                includeMargin={true}
                style={{
                  borderRadius: '16px'
                }}
              />
            </Box>

            <VStack spacing={4} w="full">
              <Box w="full">
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mb={2}
                >
                  Payment Link
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  textAlign="center"
                  wordBreak="break-all"
                  px={4}
                >
                  {paymentLink}
                </Text>
              </Box>

              <Divider />

              <Box w="full">
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mb={2}
                >
                  Wallet ID
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  textAlign="center"
                  wordBreak="break-all"
                  px={4}
                >
                  {walletData.walletId}
                </Text>
              </Box>

              <HStack spacing={4} mt={2}>
                <Button
                  leftIcon={<FiLink />}
                  onClick={onLinkCopy}
                  colorScheme={hasLinkCopied ? 'green' : 'gray'}
                  variant="outline"
                  size="sm"
                >
                  {hasLinkCopied ? 'Link Copied!' : 'Copy Link'}
                </Button>
                <Button
                  leftIcon={<FiCopy />}
                  onClick={onWalletCopy}
                  colorScheme={hasWalletCopied ? 'green' : 'gray'}
                  variant="outline"
                  size="sm"
                >
                  {hasWalletCopied ? 'ID Copied!' : 'Copy ID'}
                </Button>
                <Button
                  leftIcon={<FiShare2 />}
                  onClick={handleShare}
                  colorScheme="blue"
                  size="sm"
                >
                  Share
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletQRModal;