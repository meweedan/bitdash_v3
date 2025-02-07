// components/transactions/PaymentLinkList.js
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Spinner,
  useColorModeValue,
  Icon,
  Button,
  useToast,
  IconButton,
  Tooltip,
  useClipboard
} from '@chakra-ui/react';
import {
  FiClock,
  FiLink,
  FiCopy,
  FiQrCode,
  FiTrash2,
  FiExternalLink
} from 'react-icons/fi';
import { format, parseISO, isPast } from 'date-fns';

const PaymentLinkItem = ({ paymentLink, onDelete }) => {
  const { attributes } = paymentLink;
  const metadata = attributes.metadata || {};
  const paymentUrl = `https://cash.bitdash.app/cash/${metadata.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${attributes.link_id}`;
  
  const { onCopy, hasCopied } = useClipboard(paymentUrl);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const toast = useToast();

  const isExpired = attributes.expiry ? isPast(new Date(attributes.expiry)) : false;
  const statusColor = isExpired ? 'red' : attributes.status === 'active' ? 'green' : 'yellow';

  const handleCopy = (e) => {
    e.stopPropagation();
    onCopy();
    toast({
      title: 'Link Copied',
      description: 'Payment link copied to clipboard',
      status: 'success',
      duration: 2000
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(paymentLink.id);
    }
  };

  const handleOpenLink = (e) => {
    e.stopPropagation();
    window.open(paymentUrl, '_blank');
  };

  return (
    <Box
      p={4}
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={handleCopy}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiLink} color={statusColor} />
            <Text fontWeight="bold">
              {attributes.amount.toLocaleString()} {attributes.currency}
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Badge colorScheme={statusColor}>
              {isExpired ? 'Expired' : attributes.status}
            </Badge>
            {metadata.linkType === 'qr' && (
              <Badge colorScheme="purple">QR</Badge>
            )}
            <Badge colorScheme="blue">
              {attributes.payment_type}
            </Badge>
          </HStack>
        </HStack>

        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {attributes.description || `Payment for ${metadata.businessName}`}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {paymentUrl}
          </Text>
        </VStack>

        <HStack justify="space-between">
          <HStack spacing={4} fontSize="sm" color="gray.500">
            <HStack>
              <Icon as={FiClock} />
              <Text>
                {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
              </Text>
            </HStack>
            {attributes.expiry && (
              <HStack>
                <Text>Expires:</Text>
                <Text>
                  {format(parseISO(attributes.expiry), 'MMM d, h:mm a')}
                </Text>
              </HStack>
            )}
          </HStack>

          <HStack>
            <Tooltip label="Copy Link">
              <IconButton
                size="sm"
                icon={<Icon as={hasCopied ? FiCheck : FiCopy} />}
                onClick={handleCopy}
                colorScheme={hasCopied ? 'green' : 'gray'}
                variant="ghost"
                aria-label="Copy Link"
              />
            </Tooltip>
            <Tooltip label="Open Link">
              <IconButton
                size="sm"
                icon={<Icon as={FiExternalLink} />}
                onClick={handleOpenLink}
                variant="ghost"
                aria-label="Open Link"
              />
            </Tooltip>
            {onDelete && (
              <Tooltip label="Delete Link">
                <IconButton
                  size="sm"
                  icon={<Icon as={FiTrash2} />}
                  onClick={handleDelete}
                  colorScheme="red"
                  variant="ghost"
                  aria-label="Delete Link"
                />
              </Tooltip>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

const PaymentLinkList = ({ paymentLinks, isLoading, onDelete }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!paymentLinks?.length) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No payment links found</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {paymentLinks.map((link) => (
        <PaymentLinkItem 
          key={link.id} 
          paymentLink={link} 
          onDelete={onDelete}
        />
      ))}
    </VStack>
  );
};

export default PaymentLinkList;