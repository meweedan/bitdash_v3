// components/SubscriptionCard.js
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Badge,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';

const SubscriptionCard = ({ plan, isSelected, onSelect }) => {
  const { t } = useTranslation('common');
  const { formatPrice } = useCurrency();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth="2px"
      borderColor={isSelected ? 'blue.500' : borderColor}
      borderRadius="lg"
      position="relative"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
    >
      {plan.popular && (
        <Badge
          colorScheme="blue"
          position="absolute"
          top={-3}
          right={-3}
          rounded="full"
          px={3}
          py={1}
        >
          {t('subscription.mostPopular')}
        </Badge>
      )}

      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          {plan.name}
        </Text>

        <HStack align="baseline" spacing={1}>
          <Text fontSize="3xl" fontWeight="bold">
            {formatPrice(plan.monthlyPrice)}
          </Text>
          <Text fontSize="sm" color={textColor}>
            /{t('subscription.perMonth')}
          </Text>
        </HStack>

        <Text color={textColor} fontSize="sm">
          {plan.commission_rate}% {t('subscription.commission')}
        </Text>

        <List spacing={3}>
          {plan.features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FiCheck} color="green.500" />
              <Text fontSize="sm">{feature}</Text>
            </ListItem>
          ))}
        </List>

        <Button
          colorScheme="blue"
          onClick={() => onSelect(plan.id)}
          isDisabled={isSelected}
          size="lg"
          mt={4}
        >
          {isSelected ? t('subscription.currentPlan') : t('subscription.subscribe')}
        </Button>
      </VStack>
    </Box>
  );
};

export default SubscriptionCard;