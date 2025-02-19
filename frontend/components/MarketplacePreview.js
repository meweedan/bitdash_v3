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
  InputLeftElement,
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
function ProductCard({ product, onFavoriteToggle, isFavorited }) {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  // Safe destructuring
  const {
    id,
    attributes = {},
  } = product || {};

  const {
    name = '',
    price = 0,
    stock = 0,
    rating = 0,
    status = 'available',
    images,
    owner,
    category,
    subcategory,
    description = '',
  } = attributes;

  // Build slug for dynamic route
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const shopName = owner?.data?.attributes?.shopName || 'unknown-shop';

  // Go to item page
  const handleViewItem = () => {
    router.push(`/shop/${shopName}/${slug}`);
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
        <Box
          as="img"
          src={
            images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images.data[0].attributes.url}`
              : '/placeholder-product.jpg'
          }
          alt={name}
          objectFit="cover"
          w="full"
          h="full"
        />
        <IconButton
          icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorited ? 'red' : 'gray'}
          variant="ghost"
          onClick={() => onFavoriteToggle(id)}
          aria-label="Favorite"
        />
      </Box>

      {/* Product Details */}
      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          {/* Title + Stock */}
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

          {/* Description */}
          <Text
            color="gray.500"
            fontSize="sm"
            noOfLines={2}
            lineHeight="shorter"
          >
            {description}
          </Text>

          {/* Price, Category, Rating */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg" color="blue.500">
                {parseFloat(price).toFixed(2)} LYD
              </Text>
              <HStack spacing={1}>
                {rating > 0 && (
                  <>
                    <Star size={14} color="#f6c84c" />
                    <Text fontSize="xs" color="gray.600">
                      {rating.toFixed(1)}
                    </Text>
                  </>
                )}
              </HStack>
            </VStack>
            <VStack align="end" spacing={0}>
              {category && <Badge>{category}</Badge>}
              {subcategory && <Badge variant="outline">{subcategory}</Badge>}
            </VStack>
          </HStack>

          {/* View item button */}
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
}

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
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['shop-items', searchTerm, sortBy, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'filters[status][$eq]': 'available',
        'pagination[page]': page.toString(),
        'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
        'populate[images]': '*',
        'populate[owner]': '*',
      });

      // Searching by name/description
      if (searchTerm) {
        params.append('filters[$or][0][name][$containsi]', searchTerm);
        params.append('filters[$or][1][description][$containsi]', searchTerm);
      }

      // Sorting: e.g. "rating:desc"
      if (sortBy) {
        params.append('sort', sortBy); 
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch products (${res.status})`);
      }
      return res.json();
    },
    keepPreviousData: true,
  });

  // Safely extract items
  const items = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta?.pagination || {};

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
          <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavoriteToggle={handleFavoriteToggle}
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