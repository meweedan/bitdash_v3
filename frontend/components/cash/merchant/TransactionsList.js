// components/pay/merchant/TransactionsList.js
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Badge, 
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  Input,
  Flex,
  Button,
  Divider,
  Spinner,
  IconButton,
  Tooltip,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  FiArrowDownLeft, 
  FiArrowUpRight, 
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

const TransactionsList = ({ merchantId, currency, mobileView }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(mobileView ? 5 : 10);

  const { 
    data: transactionsData, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['merchantTransactions', merchantId, filters, page, pageSize],
    queryFn: async () => {
      let filterQuery = `filters[merchant][id][$eq]=${merchantId}`;
      if (filters.type) filterQuery += `&filters[type][$eq]=${filters.type}`;
      if (filters.status) filterQuery += `&filters[status][$eq]=${filters.status}`;
      if (filters.startDate) filterQuery += `&filters[createdAt][$gte]=${filters.startDate}`;
      if (filters.endDate) filterQuery += `&filters[createdAt][$lte]=${filters.endDate}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` +
        `${filterQuery}` +
        `&pagination[page]=${page}` +
        `&pagination[pageSize]=${pageSize}` +
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!merchantId
  });

  const filteredTransactions = useMemo(() => transactionsData?.data || [], [transactionsData]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return 'green';
      case 'withdrawal': return 'red';
      case 'transfer': return 'blue';
      case 'payment': return 'purple';
      default: return 'gray';
    }
  };

  const TransactionItem = ({ transaction }) => {
    const { attributes } = transaction;
    const color = getTransactionColor(attributes.type);

    return (
      <HStack 
        w="full"
        p={3}
        bg={useColorModeValue('white', 'gray.700')}
        borderRadius="md"
        boxShadow="sm"
        spacing={4}
        cursor="pointer"
        _hover={{ 
          bg: useColorModeValue('gray.50', 'gray.600'),
          transform: 'translateY(-2px)',
          transition: 'all 0.2s'
        }}
        onClick={() => setSelectedTransaction(transaction)}
      >
        <Icon 
          as={attributes.type === 'deposit' ? FiArrowDownLeft : FiArrowUpRight}
          color={`${color}.500`}
          boxSize={6}
        />

        <VStack flex={1} align="start" spacing={1}>
          <HStack w="full" justify="space-between">
            <Text fontWeight="medium" fontSize={isMobile ? 'sm' : 'md'}>
              {attributes.merchant?.data?.attributes?.metadata?.businessName || 'Transaction'}
            </Text>
            <Text 
              fontWeight="bold"
              fontSize={isMobile ? 'sm' : 'md'}
              color={attributes.type === 'deposit' ? 'green.500' : 'red.500'}
            >
              {attributes.type === 'deposit' ? '+' : '-'} {attributes.amount.toLocaleString()} {currency}
            </Text>
          </HStack>
          <HStack w="full" justify="space-between">
            <Badge 
              colorScheme={attributes.status === 'completed' ? 'green' : 'yellow'}
              fontSize={isMobile ? 'xs' : 'sm'}
            >
              {attributes.type}
            </Badge>
            <Text fontSize={isMobile ? 'xs' : 'sm'} color="gray.500">
              {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    );
  };

  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    const { attributes } = selectedTransaction;

    return (
      <Modal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)}
        size={isMobile ? 'full' : 'md'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* ... (same as before) ... */}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  const FilterControls = () => {
    return (
      <SimpleGrid 
        columns={isMobile ? 1 : 4} 
        spacing={4}
        bg={useColorModeValue('gray.50', 'gray.700')} 
        p={4} 
        borderRadius="md"
      >
        <Select 
          placeholder="Transaction Type"
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="payment">Payment</option>
          <option value="transfer">Transfer</option>
        </Select>

        {/* ... (other filter controls) ... */}
      </SimpleGrid>
    );
  };

  const PaginationControls = () => {
    const pagination = transactionsData?.meta?.pagination || {};
    const { page: currentPage, pageCount, total } = pagination;

    return (
      <HStack justify="space-between" w="full" p={4}>
        <Text fontSize={isMobile ? 'sm' : 'md'}>
          Page {currentPage} of {pageCount} (Total: {total})
        </Text>
        <HStack>
          <Button 
            leftIcon={<FiChevronLeft />}
            isDisabled={currentPage <= 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            size={isMobile ? 'sm' : 'md'}
          >
            {isMobile ? 'Prev' : 'Previous'}
          </Button>
          <Button 
            rightIcon={<FiChevronRight />}
            isDisabled={currentPage >= pageCount}
            onClick={() => setPage(prev => Math.min(pageCount, prev + 1))}
            size={isMobile ? 'sm' : 'md'}
          >
            {isMobile ? 'Next' : 'Next'}
          </Button>
        </HStack>
      </HStack>
    );
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!filteredTransactions || filteredTransactions.length === 0) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        py={8} 
        direction="column"
        textAlign="center"
      >
        <Text color="gray.500">No transactions found</Text>
      </Flex>
    );
  }

  return (
    <VStack spacing={4} w="full">
      <FilterControls />
      <VStack spacing={2} w="full">
        {filteredTransactions.map((transaction) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
          />
        ))}
      </VStack>
      <PaginationControls />
      <TransactionDetailsModal />
    </VStack>
  );
};

export default TransactionsList;