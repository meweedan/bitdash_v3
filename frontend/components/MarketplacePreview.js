import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import {
  ShoppingBag,
  Heart,
  Star,
  Search,
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ product, onFavorite, isFavorited }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  // Destructure data based on your Strapi schema
  const {
    id,
    attributes: {
      name,
      price,
      stock,
      rating,
      status,
      images,
      owner,
    }
  } = product;

  const imageUrl = images?.data?.[0]?.attributes?.url;
  const ownerLogo = owner?.data?.attributes?.logo?.data?.attributes?.url;
  const ownerName = owner?.data?.attributes?.shopName;
  const ownerRating = owner?.data?.attributes?.rating;

  return (
    <Box
      bg={isDark ? 'whiteAlpha.100' : 'whiteAlpha.500'}
      backdropFilter="blur(10px)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="xl"
      borderWidth="1px"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
      position="relative"
    >
      <Box position="relative" h="200px">
        <Image
          src={imageUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}` : '/placeholder-product.jpg'}
          alt={name}
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
          onClick={() => onFavorite(id)}
          aria-label="Favorite"
        />
      </Box>

      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {name}
            </Text>
            <Badge colorScheme={status === 'available' ? 'green' : 'red'}>
              {status === 'available' ? t('in_stock') : t('out_of_stock')}
            </Badge>
          </HStack>

          <HStack spacing={2}>
            <Avatar
              size="sm"
              src={ownerLogo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${ownerLogo}` : undefined}
              name={ownerName}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">
                {ownerName}
              </Text>
              {ownerRating && (
                <HStack spacing={1}>
                  <Icon as={Star} color="yellow.400" boxSize={3} />
                  <Text fontSize="xs" color="gray.500">
                    {ownerRating.toFixed(1)}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          <HStack justify="space-between" pt={2}>
            <Text fontWeight="bold" fontSize="xl" color="brand.bitshop.500">
              {price.toFixed(2)} LYD
            </Text>
            {rating && (
              <HStack spacing={1}>
                <Icon as={Star} color="yellow.400" />
                <Text>{rating.toFixed(1)}</Text>
              </HStack>
            )}
          </HStack>

          <Button
            leftIcon={<ShoppingBag />}
            variant="bitshop-solid"
            size="sm"
            isDisabled={status !== 'available' || stock <= 0}
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
  const { t } = useTranslation('common');
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating:desc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, sortBy, page],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          'pagination[page]': page.toString(),
          'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
          'populate[images]': '*',
          'populate[owner][populate][logo]': '*',
          'filters[status][$eq]': 'available',
        });

        if (searchTerm) {
          params.append('filters[$or][0][name][$containsi]', searchTerm);
          params.append('filters[$or][1][description][$containsi]', searchTerm);
        }

        if (sortBy) {
          const [field, order] = sortBy.split(':');
          params.append('sort', field);
          params.append('order', order);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('API Error:', error);
        return { data: [], meta: { pagination: { page: 1, pageCount: 1, total: 0 } } };
      }
    },
    keepPreviousData: true,
  });

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
              bg={isDark ? 'whiteAlpha.50' : 'whiteAlpha.500'}
              backdropFilter="blur(10px)"
              borderWidth="1px"
              borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
            />
          </InputGroup>
          <Select
            size="lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            w="200px"
            bg={isDark ? 'whiteAlpha.50' : 'whiteAlpha.500'}
            backdropFilter="blur(10px)"
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

      {isLoading ? (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} h="400px" borderRadius="xl" />
          ))}
        </Grid>
      ) : error ? (
        <Box
          p={8}
          bg={isDark ? 'red.900' : 'red.50'}
          color={isDark ? 'red.200' : 'red.600'}
          borderRadius="xl"
          textAlign="center"
        >
          <Text>{t('error_loading_products')}</Text>
        </Box>
      ) : (
        <>
          <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
            {Array.isArray(data?.data) && data.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={handleFavoriteToggle}
                isFavorited={favorites.has(product.id)}
              />
            ))}
          </Grid>

          {data?.meta?.pagination && (
            <Flex justify="center" mt={8}>
              <HStack>
                <Button
                  variant="bitshop-solid"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  isDisabled={page === 1}
                >
                  {t('previous')}
                </Button>
                <Text>
                  {t('page_x_of_y', { 
                    x: page, 
                    y: Math.ceil((data.meta.pagination.total || 0) / ITEMS_PER_PAGE) 
                  })}
                </Text>
                <Button
                  variant="bitshop-solid"
                  onClick={() => setPage(p => p + 1)}
                  isDisabled={page >= (data.meta.pagination.pageCount || 1)}
                >
                  {t('next')}
                </Button>
              </HStack>
            </Flex>
          )}
        </>
      )}
    </Container>
  );
};

export default MarketplacePreview;