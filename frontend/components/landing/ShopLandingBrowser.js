// components/landing/ShopLandingBrowser.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Flex,
  useColorModeValue,
  Badge,
  Image,
  Divider,
  Stack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import {
  Store,
  Truck,
  Warehouse,
  ShoppingBag,
  Package,
  CreditCard,
  Percent,
  Globe,
  Shield,
  ChevronRight
} from 'lucide-react';
import MarketplacePreview from '@/components/MarketplacePreview';
import StockFlowAnimation from '@/components/StockFlowAnimation';

const MotionBox = motion(Box);

const ShopLandingPage = () => {
  const { t } = useTranslation();
  const bgAccent = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="7xl" pt={20} pb={20}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="center">
          <GridItem>
            <VStack align="start" spacing={6} textAlign={{ base: 'center', lg: 'left' }}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="md">
                {t('create_your_store_now')}
              </Badge>
              <Heading fontSize={{ base: '3xl', lg: '5xl' }} fontWeight="bold">
                {t('bitshop_the_future_of_libyan_ecommerce')}
              </Heading>
              <Text fontSize={{ base: 'md', lg: 'lg' }} color="gray.500">
                {t('list_products_manage_orders_and_sell_anywhere')}
              </Text>
              <HStack spacing={4}>
                <Button size="lg" colorScheme="blue" rightIcon={<ChevronRight />}>{t('get_started')}</Button>
                <Button size="lg" variant="ghost" colorScheme="blue">{t('learn_more')}</Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem>
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <StockFlowAnimation />
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      <Divider my={10} />

      {/* Live Marketplace Preview */}
      <Box py={16}>
        <Container maxW="7xl">
          <Heading size="xl" textAlign="center" mb={6}>{t('live_marketplace_preview')}</Heading>
          <MarketplacePreview />
        </Container>
      </Box>

      <Divider my={10} />

      {/* Why Choose BitShop */}
      <Box py={16}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[
              {
                title: t('own_your_store'),
                description: t('fully_customize_your_shop'),
                icon: Store,
              },
              {
                title: t('logistics_and_warehousing'),
                description: t('we_handle_storage_and_delivery'),
                icon: Warehouse,
              },
              {
                title: t('seamless_payments'),
                description: t('secure_online_transactions'),
                icon: CreditCard,
              }
            ].map((feature, index) => (
              <Card key={index} border="1px solid" borderColor={borderColor} boxShadow="xl" p={6}>
                <CardBody>
                  <VStack align="center" spacing={6}>
                    <Icon as={feature.icon} boxSize={14} color="blue.500" />
                    <Heading size="md" textAlign="center">{feature.title}</Heading>
                    <Text color="gray.500" textAlign="center">{feature.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box py={16} bg={bgAccent}>
        <Container maxW="5xl" textAlign="center">
          <VStack spacing={6}>
            <Heading size="2xl">{t('start_selling_today')}</Heading>
            <Text fontSize="lg" color="gray.500">
              {t('no_fees_no_hassle_just_growth')}
            </Text>
            <Button size="lg" colorScheme="blue" rightIcon={<ChevronRight />}>{t('create_your_store')}</Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ShopLandingPage;