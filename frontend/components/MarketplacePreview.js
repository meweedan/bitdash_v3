import React, { useState } from 'react';
import { useRouter } from 'next/router';
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

/** Card for each product item */
const ProductCard = ({ product, onFavorite, isFavorited }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  // Strapi typically returns something like:
  // product = { id, attributes: { name, price, stock, ...owner } }
  const {
    id,
    attributes: {
      name,
      price,
      stock,
      rating,
      status,
      category,
      subcategory,
      description,
      images,
      owner,
    },
  } = product;

  // Build a dynamic route: /shop/[shopName]/[productName]
  const handleViewItem = () => {
    // Slugify the product name (e.g. "My Product" -> "my-product")
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Owner’s shopName
    const shopName = owner?.data?.attributes?.shopName ?? 'unknown-shop';

    // Push to dynamic route
    router.push(`/shop/${shopName}/${slug}`);
  };

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
    >
      {/* Product Image */}
      <Box position="relative" h="200px">
        <Image
          // If there's an uploaded image, display it; else placeholder
          src={
            images?.data?.[0]?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images.data[0].attributes.url}`
              : '/placeholder-product.jpg'
          }
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

      {/* Product Details */}
      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          {/* Title + Stock Badge */}
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {name}
            </Text>
            <Badge colorScheme={status === 'available' ? 'green' : 'red'}>
              {status === 'available' ? t('in_stock') : t('out_of_stock')}
            </Badge>
          </HStack>

          {/* Description */}
          <Text color="gray.500" fontSize="sm" noOfLines={2}>
            {description}
          </Text>

          {/* Price + Category */}
          <HStack justify="space-between" pt={2}>
            <Text fontWeight="bold" fontSize="xl" color="brand.bitshop.500">
              {parseFloat(price).toFixed(2)} LYD
            </Text>
            <HStack>
              <Badge>{category}</Badge>
              {subcategory && <Badge variant="outline">{subcategory}</Badge>}
            </HStack>
          </HStack>

          {/* View / See Item Button */}
          <Button
            leftIcon={<ShoppingBag />}
            variant="bitshop-solid"
            size="sm"
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

const MarketplacePreview = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating:desc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch shop-items from Strapi
  const {
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['shopItems', searchTerm, sortBy, page],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams({
        'filters[status][$eq]': 'available',
        'pagination[page]': page.toString(),
        'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
        'populate[images]': '*',
        'populate[owner][populate][logo]': '*',
      });

      if (searchTerm) {
        params.append('filters[$or][0][name][$containsi]', searchTerm);
        params.append('filters[$or][1][description][$containsi]', searchTerm);
      }

      if (sortBy) {
        // e.g. 'rating:desc'
        params.append('sort', sortBy);
      }

      // Make request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      // Typically returns { data: [...], meta: {...} }
      const json = await res.json();
      return json;
    },
    keepPreviousData: true,
  });

  // Handle favorites
  const handleFavoriteToggle = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: t('removed_from_favorites'),
          status: 'info',
          duration: 2000,
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: t('added_to_favorites'),
          status: 'success',
          duration: 2000,
        });
      }
      return newFavorites;
    });
  };

  // Convert to an array we can .map over
  const items = data?.data ?? [];

  return (
    <Container maxW="7xl" py={8}>
      {/* Filter Row */}
      <VStack spacing={6} w="full" mb={8}>
        <HStack w="full" spacing={4}>
          {/* Search Input */}
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

          {/* Sort Dropdown */}
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

      {/* Main Content */}
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
      ) : items.length === 0 ? (
        <Box textAlign="center">
          <Text>{t('no_products_available')}</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavorite={handleFavoriteToggle}
              isFavorited={favorites.has(product.id)}
            />
          ))}
        </Grid>
      )}
      {/* If you want pagination controls, handle them using data.meta.pagination */}
    </Container>
  );
};

export default MarketplacePreview;