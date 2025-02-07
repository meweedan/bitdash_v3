// components/pay/StatsDisplay.js
import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

const StatsDisplay = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const stats = [
    {
      label: "Month's Spending",
      value: "4,280",
      change: "+12%",
      icon: DollarSign
    },
    {
      label: "Active Vouchers",
      value: "3",
      subtext: "2 expiring soon",
      icon: Clock
    },
    {
      label: "Total Savings",
      value: "925",
      change: "+8%",
      icon: TrendingUp
    }
  ];

  return (
    <VStack spacing={4} align="stretch">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <HStack key={index} spacing={4}>
            <Box
              p={2}
              bg={isDark ? 'whiteAlpha.100' : 'gray.100'}
              rounded="lg"
              color={isDark ? 'white' : 'gray.600'}
            >
              <Icon size={16} />
            </Box>
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" color="gray.500">{stat.label}</Text>
              <HStack spacing={2}>
                <Text fontWeight="bold">{stat.value} {stat.label.includes('Spending') || stat.label.includes('Savings') ? 'LYD' : ''}</Text>
                {stat.change && (
                  <Text fontSize="sm" color={stat.change.startsWith('+') ? 'green.500' : 'red.500'}>
                    {stat.change}
                  </Text>
                )}
              </HStack>
              {stat.subtext && (
                <Text fontSize="xs" color="gray.500">{stat.subtext}</Text>
              )}
            </VStack>
          </HStack>
        );
      })}
    </VStack>
  );
};

export default StatsDisplay;