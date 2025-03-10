// components/pay/merchant/PaymentLinksList.js
import {
  VStack,
  Box,
  Text,
  Badge,
  Spinner,
  useColorModeValue,
  HStack,
  IconButton,
  useToast,
  useClipboard,
  Tooltip
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isPast } from 'date-fns';
import { FiTrash2, FiCopy, FiLink } from 'react-icons/fi';

const PaymentLinksList = ({ merchantId }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: links, isLoading } = useQuery({
    queryKey: ['payment-links', merchantId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links?` +
        `filters[merchant][id][$eq]=${merchantId}&` +
        `populate=*&` +
        `sort[0]=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch payment links');
      return response.json();
    },
    enabled: !!merchantId
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links/${linkId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to delete payment link');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      toast({
        title: 'Payment link deleted',
        status: 'success',
        duration: 3000
      });
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!links?.data?.length) {
    return <Text color="gray.500">No payment links found</Text>;
  }

  return (
    <VStack spacing={4} align="stretch">
      {links.data.map((link) => (
        <PaymentLinkItem 
          key={link.id} 
          link={link}
          onDelete={() => deleteMutation.mutate(link.id)}
        />
      ))}
    </VStack>
  );
};

const PaymentLinkItem = ({ link, onDelete }) => {
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const { attributes } = link;
  const paymentUrl = `https://cash.bitdash.app/${attributes.metadata?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${attributes.link_id}`;
  const { hasCopied, onCopy } = useClipboard(paymentUrl);
  const isExpired = attributes.expiry ? isPast(new Date(attributes.expiry)) : false;

  return (
    <Box
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{ bg: bgHover }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Badge colorScheme={isExpired ? 'red' : attributes.status === 'active' ? 'green' : 'yellow'}>
              {isExpired ? 'EXPIRED' : attributes.status.toUpperCase()}
            </Badge>
            <Badge colorScheme="purple">{attributes.payment_type}</Badge>
          </HStack>
          <HStack>
            <Tooltip label={hasCopied ? 'Copied!' : 'Copy Link'}>
              <IconButton
                icon={<FiCopy />}
                size="sm"
                variant="ghost"
                onClick={onCopy}
              />
            </Tooltip>
            <Tooltip label="Delete Link">
              <IconButton
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={onDelete}
              />
            </Tooltip>
          </HStack>
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            {attributes.amount.toLocaleString()} {attributes.currency}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Created {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
          </Text>
        </HStack>

        {attributes.expiry && (
          <Text fontSize="xs" color="gray.500">
            Expires {format(parseISO(attributes.expiry), 'MMM d, h:mm a')}
          </Text>
        )}

        <HStack>
          <FiLink size={14} />
          <Text fontSize="sm" color="gray.500" isTruncated>
            {paymentUrl}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PaymentLinksList;