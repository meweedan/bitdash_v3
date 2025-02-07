import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import SubscriptionSelector from './SubscriptionSelector';
import { 
  SUBSCRIPTION_PLANS, 
  formatPrice, 
  CURRENCY_SYMBOLS 
} from '@/config/subscriptionConfig';

const SubscriptionInfo = ({ subscription, onUpgrade, onCancel }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { t } = useTranslation('common');

  const currentPlan = SUBSCRIPTION_PLANS.find(
    plan => plan.id === subscription?.tier?.toLowerCase()
  );

  // Get stored currency or default to USD
  const userCurrency = typeof window !== 'undefined' ? 
    localStorage.getItem('userCurrency') || 'USD' : 'USD';

  const getDaysRemaining = () => {
    if (!subscription?.end_date) return null;
    const end = new Date(subscription.end_date);
    const now = new Date();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProgressValue = () => {
    if (!subscription?.start_date || !subscription?.end_date) return 0;
    const start = new Date(subscription.start_date);
    const end = new Date(subscription.end_date);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const handleUpgrade = (newTier) => {
    onUpgrade(newTier);
    onClose();
  };

  return (
    <Box>
      <VStack
        spacing={6}
        p={6}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        width="100%"
      >
        {!subscription && (
          <Text color="red.500">{t('subscription.noData')}</Text>
        )}

        <Stat>
          <StatLabel>{t('subscription.currentPlan')}</StatLabel>
          <StatNumber>
            {currentPlan?.name || t('subscription.noPlan')}
            {subscription?.status && (
              <Badge
                ml={2}
                colorScheme={subscription.status === 'active' ? 'green' : 'red'}
              >
                {subscription.status}
              </Badge>
            )}
          </StatNumber>
          <StatHelpText>
            {currentPlan && (
              <>
                {CURRENCY_SYMBOLS[userCurrency]}
                {formatPrice(currentPlan.monthlyPrice, userCurrency)}/
                {t('pricing.month')} • 
                {currentPlan.commission_rate}% {t('pricing.commission')}
              </>
            )}
          </StatHelpText>
        </Stat>

        {subscription?.end_date && (
          <Box width="100%">
            <Text mb={2}>{t('subscription.period')}</Text>
            <Progress
              value={getProgressValue()}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
            />
            <Text mt={2} fontSize="sm" color="gray.500">
              {getDaysRemaining()} {t('subscription.daysRemaining')}
            </Text>
          </Box>
        )}

        {currentPlan && (
          <Box width="100%">
            <Text mb={3} fontWeight="bold">{t('subscription.includedFeatures')}:</Text>
            <Stack spacing={2}>
              {currentPlan.features.map((feature, index) => (
                <Text key={index} fontSize="sm">
                  <FiCheck 
                    style={{ 
                      display: 'inline-block', 
                      marginRight: '8px',
                      color: 'currentColor' 
                    }} 
                  />
                  {feature}
                </Text>
              ))}
            </Stack>
          </Box>
        )}

        <Divider />

        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
          <Button
            colorScheme="blue"
            onClick={onOpen}
            flex={1}
          >
            {t('subscription.upgradePlan')}
          </Button>
          {subscription?.tier !== 'free' && (
            <Button
              variant="outline"
              colorScheme="red"
              onClick={onCancel}
              flex={1}
            >
              {t('subscription.cancel')}
            </Button>
          )}
        </Stack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('subscription.upgrade')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SubscriptionSelector
              selectedTier={subscription?.tier}
              onSelect={handleUpgrade}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SubscriptionInfo;