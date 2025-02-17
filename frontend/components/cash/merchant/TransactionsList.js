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
  IconButton,
  Tooltip,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Collapse,
  Divider,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { 
  FiArrowDownLeft, 
  FiArrowUpRight, 
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiMoreVertical,
  FiDownload,
  FiSearch,
} from 'react-icons/fi';
import { format, parseISO, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

const TransactionsList = ({ merchantId, currency, mobileView }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    search: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(isMobile ? 5 : 10);

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Fetch transactions
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
      if (filters.search) {
        filterQuery += `&filters[$or][0][reference][$containsi]=${filters.search}`;
        filterQuery += `&filters[$or][1][metadata][businessName][$containsi]=${filters.search}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` +
        `${filterQuery}&` +
        `pagination[page]=${page}&` +
        `pagination[pageSize]=${pageSize}&` +
        `sort[0]=createdAt:desc&` +
        `populate=*`,
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

  const transactions = useMemo(() => transactionsData?.data || [], [transactionsData]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Transaction type colors
  const getTransactionColor = (type) => {
    const colors = {
      deposit: 'green',
      withdrawal: 'red',
      transfer: 'blue',
      payment: 'purple',
      shop_sale: 'orange',
      shop_payout: 'teal',
      conversion: 'pink'
    };
    return colors[type] || 'gray';
  };

  // Transaction item component
  const TransactionItem = ({ transaction }) => {
    const { attributes: tx } = transaction;
    const color = getTransactionColor(tx.type);
    const isIncoming = ['deposit', 'payment', 'shop_sale'].includes(tx.type);

    return (
      <Box
        p={4}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{ bg: hoverBg }}
        cursor="pointer"
        onClick={() => setSelectedTransaction(transaction)}
        transition="all 0.2s"
      >
        <HStack spacing={4} align="start">
          <Icon 
            as={isIncoming ? FiArrowDownLeft : FiArrowUpRight}
            color={`${color}.500`}
            boxSize={6}
          />

          <VStack align="start" spacing={1} flex={1}>
            <Flex w="full" justify="space-between" align="center">
              <Text fontWeight="medium">
                {tx.reference || 'Transaction'}
              </Text>
              <Text 
                fontWeight="bold"
                color={isIncoming ? 'green.500' : 'red.500'}
              >
                {isIncoming ? '+' : '-'} {tx.amount.toLocaleString()} {currency}
              </Text>
            </Flex>

            <Flex w="full" justify="space-between" align="center">
              <HStack spacing={2}>
                <Badge colorScheme={color}>{tx.type}</Badge>
                <Badge 
                  colorScheme={
                    tx.status === 'completed' ? 'green' :
                    tx.status === 'pending' ? 'yellow' :
                    'red'
                  }
                >
                  {tx.status}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {format(parseISO(tx.createdAt), 'MMM d, h:mm a')}
              </Text>
            </Flex>

            {tx.metadata && (
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {tx.metadata.description || tx.metadata.businessName || ''}
              </Text>
            )}
          </VStack>

          {!isMobile && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList>
                <MenuItem>View Details</MenuItem>
                <MenuItem>Download Receipt</MenuItem>
                {tx.status === 'pending' && (
                  <MenuItem>Cancel Transaction</MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Box>
    );
  };

  // Filter drawer/modal for mobile
  const FilterView = isMobile ? Drawer : Modal;
  const FilterWrapper = ({ children }) => (
    <FilterView
      isOpen={isFilterOpen}
      onClose={onFilterClose}
      placement={isMobile ? "bottom" : "right"}
    >
      <FilterView.Overlay />
      <FilterView.Content>
        <FilterView.CloseButton />
        <FilterView.Header>Filter Transactions</FilterView.Header>
        <FilterView.Body>
          <VStack spacing={4}>
            {children}
          </VStack>
        </FilterView.Body>
      </FilterView.Content>
    </FilterView>
  );

  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Empty state
  if (!transactions.length) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        py={8}
        gap={4}
      >
        <Text color="gray.500">No transactions found</Text>
        <Button
          leftIcon={<FiRefreshCw />}
          onClick={() => {
            setFilters({
              type: '',
              status: '',
              startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
              endDate: format(new Date(), 'yyyy-MM-dd'),
              search: ''
            });
            refetch();
          }}
        >
          Reset Filters
        </Button>
      </Flex>
    );
  }

  return (
    <VStack spacing={4} w="full">
      {/* Header with filters */}
      <Flex 
        w="full" 
        justify="space-between" 
        align="center"
        wrap="wrap"
        gap={2}
      >
        <HStack>
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            size={isMobile ? "sm" : "md"}
            width={isMobile ? "full" : "auto"}
          />
          <IconButton
            icon={<FiFilter />}
            onClick={onFilterOpen}
            variant="ghost"
            aria-label="Filter"
            size={isMobile ? "sm" : "md"}
          />
        </HStack>

        <HStack>
          <IconButton
            icon={<FiRefreshCw />}
            onClick={() => refetch()}
            variant="ghost"
            aria-label="Refresh"
            size={isMobile ? "sm" : "md"}
          />
          <IconButton
            icon={<FiDownload />}
            variant="ghost"
            aria-label="Export"
            size={isMobile ? "sm" : "md"}
          />
        </HStack>
      </Flex>

      {/* Transactions list */}
      <VStack spacing={2} w="full">
        {transactions.map((transaction) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction}
          />
        ))}
      </VStack>

      {/* Pagination */}
      <Flex w="full" justify="space-between" align="center" py={4}>
        <Text fontSize={isMobile ? "sm" : "md"} color="gray.500">
          Showing {transactions.length} of {transactionsData?.meta?.pagination?.total || 0}
        </Text>
        <HStack>
          <Button
            leftIcon={<FiChevronLeft />}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            isDisabled={page === 1}
            size={isMobile ? "sm" : "md"}
          >
            Previous
          </Button>
          <Button
            rightIcon={<FiChevronRight />}
            onClick={() => setPage(prev => prev + 1)}
            isDisabled={!transactionsData?.meta?.pagination?.hasNextPage}
            size={isMobile ? "sm" : "md"}
          >
            Next
          </Button>
        </HStack>
      </Flex>

      {/* Filter drawer/modal */}
      <FilterView
        isOpen={isFilterOpen}
        onClose={onFilterClose}
      >
        <VStack spacing={4} p={4}>
          <Select
            placeholder="Transaction Type"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="shop_sale">Shop Sale</option>
            <option value="shop_payout">Shop Payout</option>
          </Select>

          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </Select>

          <HStack>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </HStack>

          <Button 
            w="full" 
            onClick={onFilterClose}
            colorScheme="blue"
          >
            Apply Filters
          </Button>
        </VStack>
      </FilterView>
    </VStack>
  );
};

export default TransactionsList;