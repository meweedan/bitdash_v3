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
  
  // Destructure the Strapi data structure
  const { attributes } = product;

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
      <Box position="relative" h="200px">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.images?.data?.[0]?.attributes?.url}`}
          alt={attributes.name}
          objectFit="cover"
          w="100%"
          h="100%"
          fallbackSrc="/placeholder-product.jpg"
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

      <Box p={4}>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {attributes.name}
            </Text>
            <Badge colorScheme={attributes.stock > 0 ? 'green' : 'red'}>
              {attributes.stock > 0 ? t('in_stock') : t('out_of_stock')}
            </Badge>
          </HStack>

          <HStack spacing={2}>
            <Avatar
              size="sm"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.owner?.data?.attributes?.logo?.data?.attributes?.url}`}
              name={attributes.owner?.data?.attributes?.shopName}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">
                {attributes.owner?.data?.attributes?.shopName}
              </Text>
              <HStack spacing={1}>
                <Icon as={Star} color="yellow.400" boxSize={3} />
                <Text fontSize="xs" color="gray.500">
                  {attributes.owner?.data?.attributes?.rating?.toFixed(1)}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <HStack justify="space-between" pt={2}>
            <Text fontWeight="bold" fontSize="xl" color="blue.500">
              {attributes.price} LYD
            </Text>
            <HStack spacing={1}>
              <Icon as={Star} color="yellow.400" />
              <Text>{attributes.rating?.toFixed(1)}</Text>
            </HStack>
          </HStack>

          <Button
            leftIcon={<ShoppingBag />}
            colorScheme="blue"
            size="sm"
            isDisabled={attributes.stock <= 0}
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

  const { data, isLoading, error } = useQuery({
  queryKey: ['products', searchTerm, sortBy, page],
  queryFn: async () => {
    const params = new URLSearchParams({
      'filters[status][$eq]': 'available',
      'pagination[page]': page.toString(),
      'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
      'populate': 'images,owner.logo',
    });

    if (searchTerm) {
      params.append('filters[$or][0][name][$containsi]', searchTerm);
      params.append('filters[$or][1][description][$containsi]', searchTerm);
    }

    if (sortBy) {
      const [field, order] = sortBy.split(':');
      params.append('sort', `${field}:${order}`);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`
    );

    if (!response.ok) {
      console.error('API Error:', await response.text());
      throw new Error('Failed to fetch products');
    }

    const result = await response.json();
    console.log('API Response:', result);

    return result;
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
          <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
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