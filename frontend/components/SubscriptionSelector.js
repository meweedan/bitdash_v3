// components/SubscriptionSelector.js
import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import SubscriptionCard from './SubscriptionCard';  // Make sure this path is correct
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionConfig';

const SubscriptionSelector = ({ selectedTier, onSelect }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <SubscriptionCard
          key={plan.id}
          plan={plan}
          isSelected={selectedTier === plan.id}
          onSelect={() => onSelect(plan.id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default SubscriptionSelector;