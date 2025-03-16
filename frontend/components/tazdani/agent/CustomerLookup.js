// components/pay/agent/CustomerLookup.js
import {
  Input,
  VStack,
  Button,
  Text,
  Box,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const CustomerLookup = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: customers, refetch } = useQuery({
    queryKey: ['customers', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?filters[phone][$contains]=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      return data.data;
    },
    enabled: false
  });

  const handleSearch = async () => {
    setIsSearching(true);
    await refetch();
    setIsSearching(false);
  };

  return (
    <VStack spacing={4} align="stretch">
      <InputGroup>
        <InputLeftElement children={<FiSearch />} />
        <Input
          placeholder="Search by phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </InputGroup>

      <Button
        onClick={handleSearch}
        isLoading={isSearching}
      >
        Search
      </Button>

      {customers?.map((customer) => (
        <Box
          key={customer.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          cursor="pointer"
          onClick={() => onSelectCustomer(customer)}
          _hover={{ bg: 'gray.50' }}
        >
          <Text fontWeight="bold">{customer.attributes.name}</Text>
          <Text>{customer.attributes.phone}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default CustomerLookup;