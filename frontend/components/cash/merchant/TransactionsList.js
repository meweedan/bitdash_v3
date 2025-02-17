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
  Tooltip
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

const TransactionsList = ({ merchantId }) => {
  // Filtering and pagination state
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch transactions
  const { 
    data: transactionsData, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['merchantTransactions', merchantId, filters, page, pageSize],
    queryFn: async () => {
      // Construct dynamic filter query
      let filterQuery = `filters[merchant][id][$eq]=${merchantId}`;
      
      if (filters.type) {
        filterQuery += `&filters[type][$eq]=${filters.type}`;
      }
      
      if (filters.status) {
        filterQuery += `&filters[status][$eq]=${filters.status}`;
      }
      
      if (filters.startDate) {
        filterQuery += `&filters[createdAt][$gte]=${filters.startDate}`;
      }
      
      if (filters.endDate) {
        filterQuery += `&filters[createdAt][$lte]=${filters.endDate}`;
      }

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

  // Transaction filtering logic
  const filteredTransactions = useMemo(() => {
    return transactionsData?.data || [];
  }, [transactionsData]);

  // Transaction details modal state
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Color scheme for transaction types
  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return 'green';
      case 'withdrawal': return 'red';
      case 'transfer': return 'blue';
      case 'payment': return 'purple';
      default: return 'gray';
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Render empty state
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

  // Transaction Item Component
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
            <Text fontWeight="medium">
              {attributes.merchant?.data?.attributes?.metadata?.businessName || 'Transaction'}
            </Text>
            <Text 
              fontWeight="bold"
              color={attributes.type === 'deposit' ? 'green.500' : 'red.500'}
            >
              {attributes.type === 'deposit' ? '+' : '-'} {attributes.amount.toLocaleString()} {attributes.currency}
            </Text>
          </HStack>
          <HStack w="full" justify="space-between">
            <Badge colorScheme={attributes.status === 'completed' ? 'green' : 'yellow'}>
              {attributes.type}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              {format(parseISO(attributes.createdAt), 'MMM d, h:mm a')}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    );
  };

  // Transaction Details Modal
  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    const { attributes } = selectedTransaction;

    return (
      <Modal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Transaction Type</Text>
                <Badge colorScheme={attributes.status === 'completed' ? 'green' : 'yellow'}>
                  {attributes.type}
                </Badge>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text>Amount</Text>
                <Text fontWeight="bold" color={attributes.type === 'deposit' ? 'green.500' : 'red.500'}>
                  {attributes.type === 'deposit' ? '+' : '-'} {attributes.amount.toLocaleString()} {attributes.currency}
                </Text>
              </HStack>

              {attributes.fee && (
                <HStack justify="space-between">
                  <Text>Fee</Text>
                  <Text>{attributes.fee.toLocaleString()} {attributes.currency}</Text>
                </HStack>
              )}

              <Divider />

              <VStack align="stretch">
                <Text fontWeight="bold">Metadata</Text>
                <HStack justify="space-between">
                  <Text>Date</Text>
                  <Text>{format(parseISO(attributes.createdAt), 'MMMM d, yyyy, h:mm:ss a')}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Reference</Text>
                  <Text>{attributes.reference || 'N/A'}</Text>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  // Filtering Controls
  const FilterControls = () => {
    return (
      <HStack 
        spacing={4} 
        bg={useColorModeValue('gray.50', 'gray.700')} 
        p={4} 
        borderRadius="md"
        wrap="wrap"
      >
        <Select 
          placeholder="Transaction Type"
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          maxW="200px"
        >
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="payment">Payment</option>
          <option value="transfer">Transfer</option>
        </Select>

        <Select 
          placeholder="Status"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          maxW="200px"
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </Select>

        <Input 
          type="date" 
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
        />

        <Input 
          type="date" 
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
        />

        <Tooltip label="Apply Filters">
          <IconButton 
            icon={<FiFilter />} 
            onClick={refetch}
            colorScheme="blue"
          />
        </Tooltip>
        <Tooltip label="Reset Filters">
          <IconButton 
            icon={<FiRefreshCw />} 
            onClick={() => {
              setFilters({
                type: '',
                status: '',
                startDate: '',
                endDate: ''
              });
              refetch();
            }}
            colorScheme="gray"
          />
        </Tooltip>
      </HStack>
    );
  };

  // Pagination Controls
  const PaginationControls = () => {
    const pagination = transactionsData?.meta?.pagination || {};
    const { page: currentPage, pageCount, total } = pagination;

    return (
      <HStack justify="space-between" w="full" p={4}>
        <Text>
          Page {currentPage} of {pageCount} (Total: {total} transactions)
        </Text>
        <HStack>
          <Button 
            leftIcon={<FiChevronLeft />}
            isDisabled={currentPage <= 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button 
            rightIcon={<FiChevronRight />}
            isDisabled={currentPage >= pageCount}
            onClick={() => setPage(prev => Math.min(pageCount, prev + 1))}
          >
            Next
          </Button>
        </HStack>
      </HStack>
    );
  };

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