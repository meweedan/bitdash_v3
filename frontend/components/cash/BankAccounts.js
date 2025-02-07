// components/pay/BankAccounts.js
import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { 
  CreditCard, 
  MoreVertical, 
  Star,
  Edit,
  Trash
} from 'lucide-react';

const BankAccounts = ({ limit }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Example data - would come from API in production
  const accounts = [
    {
      id: 1,
      bank: 'CIB Bank',
      lastFour: '4532',
      type: 'debit',
      isDefault: true
    },
    {
      id: 2,
      bank: 'QNB',
      lastFour: '8901',
      type: 'credit',
      isDefault: false
    },
    {
      id: 3,
      bank: 'NBE',
      lastFour: '3456',
      type: 'debit',
      isDefault: false
    }
  ];

  const displayAccounts = limit ? accounts.slice(0, limit) : accounts;

  return (
    <VStack spacing={3} align="stretch">
      {displayAccounts.map((account) => (
        <HStack
          key={account.id}
          p={3}
          bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
          rounded="lg"
          justify="space-between"
        >
          <HStack spacing={3}>
            <Box
              p={2}
              bg={isDark ? 'whiteAlpha.100' : 'white'}
              rounded="lg"
              color={isDark ? 'white' : 'gray.600'}
            >
              <CreditCard size={16} />
            </Box>
            <VStack align="start" spacing={0}>
              <HStack>
                <Text fontWeight="medium">{account.bank}</Text>
                {account.isDefault && (
                  <Star size={12} fill="currentColor" color={isDark ? 'yellow.200' : 'yellow.500'} />
                )}
              </HStack>
              <Text fontSize="sm" color="gray.500">•••• {account.lastFour}</Text>
            </VStack>
          </HStack>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreVertical size={16} />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
              <MenuItem icon={<Star size={16} />}>Set as Default</MenuItem>
              <MenuItem icon={<Trash size={16} />} color="red.500">Remove</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      ))}
    </VStack>
  );
};

export default BankAccounts;