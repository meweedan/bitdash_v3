// components/pay/agent/ActionButtons.js
import { SimpleGrid, Button, Icon, Text, VStack } from '@chakra-ui/react';
import { 
  FiDollarSign, 
  FiCreditCard,
  FiUsers,
  FiActivity
} from 'react-icons/fi';

const ActionButton = ({ icon, label, sublabel, onClick, scheme }) => (
  <Button
    height="auto"
    p={6}
    onClick={onClick}
    colorScheme={scheme}
    variant="solid"
    display="flex"
    flexDirection="column"
    alignItems="center"
    _hover={{
      transform: 'translateY(-2px)',
      shadow: 'lg'
    }}
    transition="all 0.2s"
  >
    <Icon as={icon} boxSize={8} mb={2} />
    <VStack spacing={0}>
      <Text fontSize="lg" fontWeight="bold">{label}</Text>
      <Text fontSize="sm" opacity={0.8}>{sublabel}</Text>
    </VStack>
  </Button>
);

const ActionButtons = ({ onAction }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
      <ActionButton
        icon={FiDollarSign}
        label="Cash Deposit"
        sublabel="Process customer deposits"
        onClick={() => onAction('deposit')}
        scheme="green"
      />
      <ActionButton
        icon={FiCreditCard}
        label="Cash Withdrawal"
        sublabel="Process customer withdrawals"
        onClick={() => onAction('withdraw')}
        scheme="blue"
      />
      <ActionButton
        icon={FiUsers}
        label="Customer Search"
        sublabel="Find customer profiles"
        onClick={() => onAction('customers')}
        scheme="purple"
      />
      <ActionButton
        icon={FiActivity}
        label="Transactions"
        sublabel="View & manage transactions"
        onClick={() => onAction('transactions')}
        scheme="orange"
      />
    </SimpleGrid>
  );
};

export default ActionButtons;