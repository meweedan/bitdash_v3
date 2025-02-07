import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon
} from '@chakra-ui/react';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';

const OfflinePage = () => {
  const { t } = useTranslation('common');

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} textAlign="center">
          <Icon as={FiWifiOff} w={16} h={16} color="gray.400" />
          <Heading size="xl">{t('offlineTitle')}</Heading>
          <Text fontSize="lg" color="gray.600">
            {t('offlineMessage')}
          </Text>
          <Button
            leftIcon={<FiRefreshCw />}
            colorScheme="blue"
            size="lg"
            onClick={handleRefresh}
          >
            {t('tryAgain')}
          </Button>
        </VStack>
      </Container>
    </Layout>
  );
};

export default OfflinePage;