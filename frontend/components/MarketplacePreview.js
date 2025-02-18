import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  Text,
  Image,
  Badge,
  Icon,
  useColorMode,
  Skeleton,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  useToast,
  Container,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import {
  ShoppingBag,
  Heart,
  Star,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  Filter
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ product, onFavorite, isFavorited }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();

  return (
    <Box
      bg={isDark ? 'gray.800' : 'white'}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      position="relative"
    >
      {/* Product Image */}
      <Box position="relative" h="200px">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images?.[0]?.url}`}
          alt={product.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        <IconButton
          icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorited ? 'red' : 'gray'}
          variant="ghost"
          onClick={() => onFavorite(product.id)}
          aria-label="Favorite"
        />
      </Box>

      {/* Product Info */}
      <Box p={4}>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {product.name}
            </Text>
            <Badge colorScheme={product.stock > 0 ? 'green' : 'red'}>
              {product.stock > 0 ? t('in_stock') : t('out_of_stock')}
            </Badge>
          </HStack>

          {/* Shop Info */}
          <HStack spacing={2}>
            <Avatar
              size="sm"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.owner?.logo?.url}`}
              name={product.owner?.shopName}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">
                {product.owner?.shopName}
              </Text>
              <HStack spacing={1}>
                <Icon as={Star} color="yellow.400" boxSize={3} />
                <Text fontSize="xs" color="gray.500">
                  {product.owner?.rating?.toFixed(1)}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Price and Rating */}
          <HStack justify="space-between" pt={2}>
            <Text fontWeight="bold" fontSize="xl" color="blue.500">
              {product.price} LYD
            </Text>
            <HStack spacing={1}>
              <Icon as={Star} color="yellow.400" />
              <Text>{product.rating?.toFixed(1)}</Text>
            </HStack>
          </HStack>

          {/* Action Buttons */}
          <Button
            leftIcon={<ShoppingBag />}
            colorScheme="blue"
            size="sm"
            isDisabled={product.stock <= 0}
          >
            {t('add_to_cart')}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const MarketplacePreview = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  const toast = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating:desc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch products with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, sortBy, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page,
        'pagination[pageSize]': ITEMS_PER_PAGE,
        sort: sortBy,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/search?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return response.json();
    },
    keepPreviousData: true
  });

  // Handle favorite toggle
  const handleFavoriteToggle = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: t('removed_from_favorites'),
          status: 'info',
          duration: 2000
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: t('added_to_favorites'),
          status: 'success',
          duration: 2000
        });
      }
      return newFavorites;
    });
  };

  return (
    <Container maxW="7xl" py={8}>
      {/* Search and Filters */}
      <VStack spacing={6} w="full" mb={8}>
        <HStack w="full" spacing={4}>
          <InputGroup size="lg">
            <InputLeftElement>
              <Icon as={Search} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder={t('search_products')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={isDark ? 'gray.800' : 'white'}
            />
          </InputGroup>
          <Select
            size="lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            w="200px"
            bg={isDark ? 'gray.800' : 'white'}
          >
            <option value="rating:desc">{t('top_rated')}</option>
            <option value="createdAt:desc">{t('newest')}</option>
            <option value="price:asc">{t('price_low_to_high')}</option>
            <option value="price:desc">{t('price_high_to_low')}</option>
          </Select>
        </HStack>
      </VStack>

      {/* Products Grid */}
      {isLoading ? (
        <Grid
          templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          gap={6}
        >
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} h="400px" borderRadius="lg" />
          ))}
        </Grid>
      ) : error ? (
        <Box
          p={8}
          bg={isDark ? 'red.900' : 'red.50'}
          color={isDark ? 'red.200' : 'red.600'}
          borderRadius="lg"
          textAlign="center"
        >
          <Text>{t('error_loading_products')}</Text>
        </Box>
      ) : (
        <>
          <Grid
            templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
            gap={6}
          >
            {data?.data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={handleFavoriteToggle}
                isFavorited={favorites.has(product.id)}
              />
            ))}
          </Grid>

          {/* Pagination */}
          <Flex justify="center" mt={8}>
            <HStack>
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                isDisabled={page === 1}
              >
                {t('previous')}
              </Button>
              <Text>
                {t('page_x_of_y', { x: page, y: Math.ceil((data?.meta?.total || 0) / ITEMS_PER_PAGE) })}
              </Text>
              <Button
                onClick={() => setPage(p => p + 1)}
                isDisabled={!data?.meta?.hasNextPage}
              >
                {t('next')}
              </Button>
            </HStack>
          </Flex>
        </>
      )}
    </Container>
  );
};

export default MarketplacePreview;