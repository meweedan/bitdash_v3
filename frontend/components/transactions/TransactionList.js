//components/transactions/TransactionList.js
import {
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Avatar,
  Spinner,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCreditCard,
  FiDollarSign,
  FiShoppingBag,
  FiSend,
  FiRefreshCw,
  FiUser,
  FiUsers
} from 'react-icons/fi';
import { format } from 'date-fns';

const getTransactionIcon = (type, metadata = {}) => {
  switch (type) {
    case 'payment':
      return metadata?.linkType === 'qr' ? FiCreditCard : FiShoppingBag;
    case 'transfer':
      return FiSend;
    case 'conversion':
      return FiRefreshCw;
    case 'credit':
      return FiArrowDownLeft;
    case 'debit':
      return FiArrowUpRight;
    default:
      return FiDollarSign;
  }
};

const getTransactionColor = (type) => {
  switch (type) {
    case 'payment':
      return 'purple.500';
    case 'transfer':
      return 'blue.500';
    case 'credit':
      return 'green.500';
    case 'debit':
      return 'red.500';
    case 'conversion':
      return 'orange.500';
    default:
      return 'gray.500';
  }
};

// Export the getTransactionDetails function with robust null checking
  export const getTransactionDetails = (transaction) => {
    // Ensure transaction and attributes exist
    if (!transaction || !transaction.attributes) {
      return {
        amount: 0,
        currency: 'LYD',
        type: 'unknown',
        status: 'unknown',
        reference: '',
        fee: 0,
        title: 'Unknown Transaction',
        description: '',
        date: new Date(),
        isQR: false
      };
    }

    const { attributes } = transaction;
    // Use empty object as fallback for nested objects
    const metadata = attributes.metadata || {};
    const paymentLink = attributes.payment_link?.data?.attributes || {};
    const merchant = attributes.merchant?.data?.attributes || {};

    let title = attributes.type;
    let description = '';

    if (attributes.type === 'payment') {
      // Use description from transaction or payment link
      title = attributes.description || paymentLink.description || 'Payment';
      description = metadata.businessName || merchant.metadata?.businessName || '';
    }

    return {
      amount: parseFloat(attributes.amount || 0),
      currency: attributes.currency || 'LYD',
      type: attributes.type,
      status: attributes.status,
      reference: attributes.reference,
      fee: parseFloat(attributes.fee || 0),
      title,
      description,
      date: new Date(attributes.createdAt),
      // Use optional chaining and provide a fallback
      isQR: !!(paymentLink || metadata?.linkType === 'qr')
    };
  };

const TransactionItem = ({ transaction }) => {
  const {
    type,
    amount,
    currency,
    status,
    fee,
    metadata,
    reference,
    merchant,
    payment_link,
    sender,
    receiver,
    createdAt
  } = transaction.attributes;

  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const color = getTransactionColor(type);
  const IconComponent = getTransactionIcon(type, metadata);

  // Format amount based on type
  const isOutgoing = ['payment', 'transfer', 'debit'].includes(type);
  const displayAmount = `${isOutgoing ? '-' : '+'} ${amount?.toLocaleString()} ${currency}`;

  // Get transaction title
  const getTransactionTitle = () => {
    if (merchant?.data?.attributes?.metadata?.businessName) {
      return merchant.data.attributes.metadata.businessName;
    }
    if (payment_link?.data?.attributes?.metadata?.businessName) {
      return payment_link.data.attributes.metadata.businessName;
    }
    if (receiver?.data?.attributes?.fullName) {
      return `To: ${receiver.data.attributes.fullName}`;
    }
    if (sender?.data?.attributes?.fullName) {
      return `From: ${sender.data.attributes.fullName}`;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const details = getTransactionDetails(transaction);
    
  return (
    <Box>
      <HStack justify="space-between">
        <VStack align="start">
          <Text fontWeight="bold">{details.title}</Text>
          {details.description && (
            <Text fontSize="sm" color="gray.500">{details.description}</Text>
          )}
          {details.reference && (
            <Text fontSize="xs" color="gray.500">Ref: {details.reference}</Text>
          )}
        </VStack>
        <VStack align="end">
          <Text fontWeight="bold">{details.amount.toLocaleString()} {details.currency}</Text>
          <Badge colorScheme={details.status === 'completed' ? 'green' : 'yellow'}>
            {details.status}
          </Badge>
          {details.isQR && <Badge colorScheme="purple">QR</Badge>}
        </VStack>
      </HStack>
    </Box>
  );
};

const TransactionList = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No transactions found</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={2} align="stretch">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </VStack>
  );
};

export default TransactionList;