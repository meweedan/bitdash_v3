// pages/pay/transactions.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  Car,
  CreditCard,
  Wallet
} from 'lucide-react';

import Layout from '@/components/Layout';

const TransactionItem = ({ transaction }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const getIcon = () => {
    switch(transaction.category) {
      case 'food':
        return Coffee;
      case 'transport':
        return Car;
      case 'transfer':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const Icon = getIcon();

  return (
    <Box
      p={4}
      bg={isDark ? 'gray.800' : 'white'}
      rounded="lg"
      shadow="sm"
      _hover={{ bg: isDark ? 'gray.750' : 'gray.50' }}
      cursor="pointer"
    >
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Box
            p={2}
            bg={isDark ? 'gray.700' : 'gray.100'}
            rounded="lg"
          >
            <Icon size={20} />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontWeight="medium">{transaction.description}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(transaction.date).toLocaleDateString()} • {transaction.time}
            </Text>
          </VStack>
        </HStack>
        <VStack align="end" spacing={1}>
          <Text 
            fontWeight="bold"
            color={transaction.type === 'credit' ? 'green.500' : undefined}
          >
            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} LYD
          </Text>
          <Badge 
            size="sm" 
            colorScheme={transaction.status === 'completed' ? 'green' : 'yellow'}
          >
            {transaction.status}
          </Badge>
        </VStack>
      </HStack>
    </Box>
  );
};

const Transactions = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Example transaction data
  const transactions = [
    {
      id: 1,
      description: 'Coffee at BitMenu Cafe',
      amount: 75,
      type: 'debit',
      status: 'completed',
      category: 'food',
      date: '2024-01-24',
      time: '10:30 AM'
    },
    {
      id: 2,
      description: 'Car Service via BitAuto',
      amount: 500,
      type: 'debit',
      status: 'completed',
      category: 'transport',
      date: '2024-01-23',
      time: '2:15 PM'
    },
    {
      id: 3,
      description: 'Received from Ahmed',
      amount: 1000,
      type: 'credit',
      status: 'completed',
      category: 'transfer',
      date: '2024-01-23',
      time: '11:45 AM'
    }
  ];

  const handleExport = () => {
    // Export functionality
  };

  const filterTransactions = () => {
    return transactions.filter(tx => {
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filter !== 'all' && tx.type !== filter) {
        return false;
      }
      return true;
    });
  };

  const filteredTransactions = filterTransactions();

  return (
    <Layout>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <HStack>
              <Button
                variant="ghost"
                leftIcon={<ArrowLeft />}
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Heading size="lg">Transaction History</Heading>
            </HStack>
            <Button
              leftIcon={<Download />}
              onClick={handleExport}
              variant="outline"
            >
              Export
            </Button>
          </HStack>

          {/* Filters */}
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement>
                <Search size={20} />
              </InputLeftElement>
              <Input
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              maxW="150px"
            >
              <option value="all">All Types</option>
              <option value="credit">Money In</option>
              <option value="debit">Money Out</option>
            </Select>

            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              maxW="150px"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
          </HStack>

          {/* Transaction List */}
          <VStack spacing={4} align="stretch">
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </VStack>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <VStack py={12} spacing={4}>
              <Text color="gray.500">No transactions found</Text>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                  setTimeRange('all');
                }}
              >
                Clear Filters
              </Button>
            </VStack>
          )}

          {/* Load More */}
          {filteredTransactions.length > 0 && (
            <Button variant="ghost" onClick={() => {}}>
              Load More
            </Button>
          )}
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Transactions;