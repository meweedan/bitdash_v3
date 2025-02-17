// components/pay/merchant/PaymentLinksList.js
import React, { useState } from 'react';
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
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useBreakpointValue,
  useDisclosure,
  Input,
  Select,
  Portal
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isPast } from 'date-fns';
import { 
  FiTrash2, 
  FiCopy, 
  FiLink, 
  FiShare2, 
  FiMoreVertical,
  FiQrCode,
  FiFilter,
  FiRefreshCw,
  FiEdit
} from 'react-icons/fi';

const PaymentLinksList = ({ merchantId, currency, onQRCode }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const [selectedLink, setSelectedLink] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  // Fetch payment links
  const { data: links, isLoading } = useQuery({
    queryKey: ['payment-links', merchantId, filters],
    queryFn: async () => {
      let filterQuery = `filters[merchant][id][$eq]=${merchantId}`;
      
      if (filters.status) filterQuery += `&filters[status][$eq]=${filters.status}`;
      if (filters.type) filterQuery += `&filters[payment_type][$eq]=${filters.type}`;
      if (filters.search) {
        filterQuery += `&filters[$or][0][description][$containsi]=${filters.search}`;
        filterQuery += `&filters[$or][1][link_id][$containsi]=${filters.search}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links?${filterQuery}&populate=*&sort[0]=createdAt:desc`,
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

  // Delete payment link mutation
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
      setSelectedLink(null);
    }
  });

  // Share payment link
  const handleShare = async (link) => {
    const shareUrl = `https://cash.bitdash.app/${link.attributes.link_id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Link',
          text: `Payment request for ${link.attributes.amount} ${currency}`,
          url: shareUrl
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copied to clipboard',
        status: 'success',
        duration: 2000
      });
    }
  };

  const PaymentLinkItem = ({ link }) => {
    const { attributes } = link;
    const { hasCopied, onCopy } = useClipboard(
      `https://cash.bitdash.app/${attributes.link_id}`
    );
    const isExpired = attributes.expiry ? isPast(new Date(attributes.expiry)) : false;
    const bgHover = useColorModeValue('gray.50', 'gray.700');

    return (
      <Box
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        bg={useColorModeValue('white', 'gray.800')}
        _hover={{ bg: bgHover }}
        transition="all 0.2s"
      >
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Badge 
                colorScheme={
                  isExpired ? 'red' : 
                  attributes.status === 'active' ? 'green' : 
                  attributes.status === 'completed' ? 'blue' : 
                  'yellow'
                }
              >
                {isExpired ? 'EXPIRED' : attributes.status.toUpperCase()}
              </Badge>
              <Badge colorScheme="purple">
                {attributes.payment_type}
              </Badge>
            </HStack>

            <HStack spacing={2}>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy Link'}>
                <IconButton
                  icon={<FiCopy />}
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                />
              </Tooltip>
              
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem 
                    icon={<FiQrCode />}
                    onClick={() => onQRCode?.(link)}
                  >
                    Show QR Code
                  </MenuItem>
                  <MenuItem 
                    icon={<FiShare2 />}
                    onClick={() => handleShare(link)}
                  >
                    Share Link
                  </MenuItem>
                  <MenuItem 
                    icon={<FiEdit />}
                    isDisabled={isExpired}
                  >
                    Edit Link
                  </MenuItem>
                  <MenuItem 
                    icon={<FiTrash2 />}
                    color="red.500"
                    onClick={() => setSelectedLink(link)}
                  >
                    Delete Link
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="lg">
              {attributes.amount.toLocaleString()} {attributes.currency}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Created {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
            </Text>
          </Flex>

          {attributes.description && (
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {attributes.description}
            </Text>
          )}

          {attributes.expiry && (
            <Text fontSize="xs" color={isExpired ? "red.500" : "gray.500"}>
              {isExpired ? 'Expired' : 'Expires'} {format(parseISO(attributes.expiry), 'MMM d, h:mm a')}
            </Text>
          )}

          <HStack fontSize="sm" color="gray.500">
            <FiLink size={14} />
            <Text isTruncated>
              {`https://cash.bitdash.app/${attributes.link_id}`}
            </Text>
          </HStack>
        </VStack>
      </Box>
    );
  };

  // Delete confirmation dialog
  const DeleteConfirmation = () => (
    <AlertDialog
      isOpen={!!selectedLink}
      onClose={() => setSelectedLink(null)}
      leastDestructiveRef={undefined}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete Payment Link</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this payment link? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => setSelectedLink(null)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => deleteMutation.mutate(selectedLink.id)}
              isLoading={deleteMutation.isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!links?.data?.length) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        py={8}
        gap={4}
      >
        <Text color="gray.500">No payment links found</Text>
        <Button
          leftIcon={<FiRefreshCw />}
          onClick={() => {
            setFilters({
              status: '',
              type: '',
              search: ''
            });
          }}
        >
          Reset Filters
        </Button>
      </Flex>
    );
  }

  return (
    <VStack spacing={4} w="full">
      {/* Filter controls */}
      <Flex 
        w="full" 
        justify="space-between" 
        align="center"
        wrap="wrap"
        gap={2}
      >
        <Input
          placeholder="Search links..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          size={isMobile ? "sm" : "md"}
          maxW={isMobile ? "full" : "250px"}
        />

        <HStack>
          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            size={isMobile ? "sm" : "md"}
            maxW="150px"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </Select>

          <IconButton
            icon={<FiRefreshCw />}
            variant="ghost"
            onClick={() => queryClient.invalidateQueries(['payment-links'])}
            size={isMobile ? "sm" : "md"}
          />
        </HStack>
      </Flex>

      {/* Links list */}
      <VStack spacing={4} w="full">
        {links.data.map((link) => (
          <PaymentLinkItem key={link.id} link={link} />
        ))}
      </VStack>

      {/* Delete confirmation */}
      <DeleteConfirmation />
    </VStack>
  );
};

export default PaymentLinksList;