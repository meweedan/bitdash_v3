// components/MarketplacePreview.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Button,
  Grid,
  IconButton,
  Select,
  Input,
  InputGroup,
  Image,
  InputLeftElement,
  Icon,
  Badge,
  Skeleton,
  useColorMode,
  useColorModeValue,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { ShoppingBag, Heart, Search, Star } from 'lucide-react';

// Items per page
const ITEMS_PER_PAGE = 12;

/** Card for a single product item (Amazon style) */
const ProductCard = ({ product, onFavoriteToggle, isFavorited }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  // Safely access attributes with fallbacks
  const attributes = product?.attributes || {};
  const {
    name = '',
    description = '',
    price = 0,
    stock = 0,
    status = 'available',
    rating = 0,
    category = '',
    subcategory = '',
  } = attributes;

  // Safely access nested data
  const images = attributes?.images?.data || [];
  const owner = attributes?.owner?.data?.attributes || {};
  
  // ProductCard component - fix image access
const imageUrl = product?.attributes?.images?.data?.[0]?.attributes?.url
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
  : '/placeholder-product.jpg';

  // Handle view item with proper error checks
  const handleViewItem = () => {
  if (!product?.attributes?.name || !product?.attributes?.owner?.data?.attributes?.shopName) {
    console.error('Missing required data for navigation');
    return;
  }
  
  const shopSlug = product.attributes.owner.data.attributes.shopName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const productSlug = product.attributes.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  
  router.push(`/shop/${shopSlug}/${productSlug}`);
};

  return (
    <Box
      bg={isDark ? 'whiteAlpha.100' : 'whiteAlpha.700'}
      backdropFilter="blur(6px)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      position="relative"
    >
      {/* Product Image */}
      <Box position="relative" h="220px">
        <Image
          src={imageUrl}
          alt={name}
          objectFit="cover"
          w="full"
          h="full"
          fallbackSrc="/placeholder-product.jpg"
        />
        <IconButton
          icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorited ? 'red' : 'gray'}
          variant="ghost"
          onClick={() => onFavoriteToggle(product.id)}
          aria-label="Favorite"
        />
      </Box>

      {/* Product Details */}
      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Text
              fontWeight="semibold"
              fontSize="md"
              noOfLines={1}
              color={useColorModeValue('gray.800', 'whiteAlpha.900')}
            >
              {name}
            </Text>
            <Badge colorScheme={status === 'available' ? 'green' : 'red'}>
              {status === 'available' ? t('in_stock') : t('out_of_stock')}
            </Badge>
          </HStack>

          <Text
            color="gray.500"
            fontSize="sm"
            noOfLines={2}
            lineHeight="shorter"
          >
            {description}
          </Text>

          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg" color="blue.500">
                {parseFloat(price).toFixed(2)} LYD
              </Text>
              {rating > 0 && (
                <HStack spacing={1}>
                  <Star size={14} color="#f6c84c" />
                  <Text fontSize="xs" color="gray.600">
                    {rating.toFixed(1)}
                  </Text>
                </HStack>
              )}
            </VStack>
            <VStack align="end" spacing={0}>
              {category && <Badge>{category}</Badge>}
              {subcategory && <Badge variant="outline">{subcategory}</Badge>}
            </VStack>
          </HStack>

          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<ShoppingBag size={16} />}
            isDisabled={status !== 'available' || stock <= 0}
            onClick={handleViewItem}
          >
            {t('see_item')}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

/**
 * Main MarketplacePreview
 */
export default function MarketplacePreview() {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating:desc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  // React Query fetch
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['products', searchTerm, sortBy, page],
    queryFn: async () => {
      try {
        // Base params for pagination and population
        const params = new URLSearchParams({
          'filters[status][$eq]': 'available',
          'pagination[page]': page.toString(),
          'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
          'populate': '*', // This will populate all relations
        });

        // Add search filters if search term exists
        if (searchTerm) {
          params.append('filters[$or][0][name][$containsi]', searchTerm);
          params.append('filters[$or][1][description][$containsi]', searchTerm);
        }

        // Add sorting
        if (sortBy) {
          const [field, direction] = sortBy.split(':');
          params.append('sort[0]', `${field}:${direction}`);
        }

        console.log('Fetching URL:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();
        console.log('API Response:', result);

        return result;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Safely extract items
  const items = Array.isArray(data?.data?.attributes?.results) ? data?.data?.attributes?.results : [];
  const pagination = data?.data?.attributes?.pagination || {};

  // Toggle favorites
  const handleFavoriteToggle = (productId) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast({
          title: t('removed_from_favorites'),
          status: 'info',
          duration: 2000,
        });
      } else {
        newSet.add(productId);
        toast({
          title: t('added_to_favorites'),
          status: 'success',
          duration: 2000,
        });
      }
      return newSet;
    });
  };

  // Banner background
  const heroBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box w="full" position="relative">
      {/* Banner */}
      <Flex
        bg={heroBg}
        py={8}
        px={4}
        mb={4}
        align="center"
        justify="center"
        direction="column"
        textAlign="center"
      >
        <Heading fontSize={{ base: '2xl', md: '4xl' }} color="blue.500">
          {t('our_marketplace')}
        </Heading>
        <Text color="gray.500" mt={2} maxW="3xl">
          {t('explore_best_deals')}
        </Text>
      </Flex>

      {/* Container */}
      <Container maxW="7xl" mb={8}>
        {/* Search / Sort */}
        <VStack spacing={4} mb={8}>
          <HStack w="full">
            {/* Search Input */}
            <InputGroup size="lg" maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} color="gray.500" />
              </InputLeftElement>
              <Input
                placeholder={t('search_products')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={isDark ? 'whiteAlpha.50' : 'whiteAlpha.500'}
                borderWidth="1px"
                borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
              />
            </InputGroup>

            {/* Sort Dropdown */}
            <Select
              size="lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              w="200px"
              bg={isDark ? 'whiteAlpha.50' : 'whiteAlpha.500'}
              borderWidth="1px"
              borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
            >
              <option value="rating:desc">{t('top_rated')}</option>
              <option value="createdAt:desc">{t('newest')}</option>
              <option value="price:asc">{t('price_low_to_high')}</option>
              <option value="price:desc">{t('price_high_to_low')}</option>
            </Select>
          </HStack>
        </VStack>

        {/* Main content area */}
        {error ? (
          <Box textAlign="center" p={6}>
            <Text color="red.500" fontWeight="bold">
              {error.message || t('error_loading_products')}
            </Text>
          </Box>
        ) : isLoading || isFetching ? (
          <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={4}>
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Skeleton key={i} height="320px" borderRadius="lg" />
            ))}
          </Grid>
        ) : items.length === 0 ? (
          <Box textAlign="center" p={6}>
            <Text>{t('no_products_available')}</Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  attributes: product
                }}
                onFavorite={handleFavoriteToggle}
                isFavorited={favorites.has(product.id)}
              />
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination && (
          <HStack justify="center" mt={8} spacing={4}>
            <Button
              isDisabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t('previous')}
            </Button>
            <Text>
              {t('page_x_of_y', {
                x: page,
                y: pagination.pageCount || 1,
              })}
            </Text>
            <Button
              isDisabled={page >= (pagination.pageCount || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('next')}
            </Button>
          </HStack>
        )}
      </Container>
    </Box>
  );
};