// components/pay/WalletBalance.js
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  VStack,
  Text,
  HStack,
  Spinner,
  useColorModeValue,
  useBreakpointValue,
  Progress,
  Tooltip,
  Flex,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiMoreVertical,
  FiActivity 
} from 'react-icons/fi';

const WalletBalance = ({ type }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['walletBalance', type],
    queryFn: async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[${type}][users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch wallet');
      const data = await response.json();
      return data.data[0];
    },
    refetchInterval: 10000
  });

  if (isLoading) {
    return (
      <Box
        p={4}
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        w="full"
      >
        <Flex justify="center" align="center" h="100px">
          <Spinner size="xl" color={accentColor} />
        </Flex>
      </Box>
    );
  }

  // Calculate daily limit usage
  const dailyUsage = wallet?.attributes?.transactions?.data?.reduce((sum, tx) => {
    const txDate = new Date(tx.attributes.createdAt);
    const today = new Date();
    if (txDate.toDateString() === today.toDateString()) {
      return sum + tx.attributes.amount;
    }
    return sum;
  }, 0) || 0;

  const dailyLimitPercentage = (dailyUsage / wallet?.attributes?.dailyLimit) * 100;

  return (
    <Box
      p={isMobile ? 4 : 6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      w="full"
      position="relative"
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <IconButton
              icon={<FiDollarSign />}
              variant="ghost"
              colorScheme="blue"
              isRound
              size={isMobile ? "sm" : "md"}
              aria-label="Wallet"
            />
            <Text fontSize={isMobile ? "md" : "lg"} color="gray.500">
              Available Balance
            </Text>
          </HStack>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<FiActivity />}>Transaction History</MenuItem>
              <MenuItem icon={<FiClock />}>Limits & Usage</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <HStack spacing={2}>
          <Text 
            fontSize={isMobile ? "2xl" : "3xl"} 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
          >
            {wallet?.attributes?.balance?.toLocaleString() || '0'}
          </Text>
          <Text fontSize={isMobile ? "lg" : "xl"} color="gray.500">
            {wallet?.attributes?.currency || 'LYD'}
          </Text>
          {wallet?.attributes?.isActive && (
            <Badge colorScheme="green" ml={2}>Active</Badge>
          )}
        </HStack>

        <VStack spacing={1} align="stretch">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              Daily Limit Usage
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {dailyUsage.toLocaleString()} / {wallet?.attributes?.dailyLimit?.toLocaleString()} {wallet?.attributes?.currency}
            </Text>
          </Flex>
          <Tooltip 
            label={`${dailyLimitPercentage.toFixed(1)}% of daily limit used`}
            placement="bottom"
          >
            <Progress 
              value={dailyLimitPercentage} 
              size="sm" 
              colorScheme={dailyLimitPercentage > 80 ? 'red' : 'blue'}
              borderRadius="full"
            />
          </Tooltip>
        </VStack>

        {!isMobile && (
          <HStack spacing={4} mt={2}>
            <Flex align="center" gap={1}>
              <FiTrendingUp color="green" />
              <Text fontSize="sm" color="gray.500">
                Last Activity: {new Date(wallet?.attributes?.lastActivity).toLocaleString()}
              </Text>
            </Flex>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default WalletBalance;