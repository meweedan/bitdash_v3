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
  Image,
  Badge,
  Skeleton,
  useColorMode,
  useColorModeValue,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Heart, Search, Star } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ product, onFavoriteToggle, isFavorited }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  // Correctly handle Strapi media URL
  const imageUrl = product?.attributes?.images?.data?.[0]?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
    : '/placeholder-product.jpg';

  const handleViewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
    >
      <Box position="relative" h="260px">
        <Image
          src={imageUrl}
          alt={product.attributes.name}
          objectFit="cover"
          w="full"
          h="full"
          fallback={<Skeleton h="full" w="full" />}
        />
        <IconButton
          icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
          position="absolute"
          top={4}
          right={4}
          rounded="full"
          colorScheme={isFavorited ? 'red' : 'gray'}
          onClick={() => onFavoriteToggle(product.id)}
          aria-label="Favorite"
        />
        {product.attributes.stock <= 5 && product.attributes.stock > 0 && (
          <Badge
            position="absolute"
            top={4}
            left={4}
            colorScheme="orange"
          >
            Only {product.attributes.stock} left
          </Badge>
        )}
      </Box>

      <VStack p={6} align="stretch" spacing={4}>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Heading size="md" color={textColor} noOfLines={1}>
              {product.attributes.name}
            </Heading>
            <Badge
              colorScheme={product.attributes.status === 'available' ? 'green' : 'red'}
            >
              {product.attributes.status === 'available' ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </HStack>

          <Text color={descriptionColor} noOfLines={2}>
            {product.attributes.description}
          </Text>
        </VStack>

        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="xl" color="blue.500">
            {parseFloat(product.attributes.price).toFixed(2)} LYD
          </Text>
          <HStack>
            <Star size={16} fill="#F6E05E" />
            <Text fontSize="sm">
              {(product.attributes.rating || 0).toFixed(1)}
              <Text as="span" color="gray.500" ml={1}>
                ({product.attributes.reviews?.data?.length || 0})
              </Text>
            </Text>
          </HStack>
        </HStack>

        {product.attributes.category && (
          <Badge alignSelf="start" colorScheme="purple">
            {product.attributes.category}
          </Badge>
        )}

        <Button
          colorScheme="blue"
          leftIcon={<ShoppingBag size={18} />}
          isDisabled={product.attributes.status !== 'available' || product.attributes.stock <= 0}
          onClick={handleViewProduct}
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

export default function MarketplacePreview() {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating:desc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, sortBy, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': ITEMS_PER_PAGE.toString()
      });

      if (searchTerm) {
        params.append('filters[$or][0][name][$containsi]', searchTerm);
        params.append('filters[$or][1][description][$containsi]', searchTerm);
      }

      if (sortBy) {
        const [field, direction] = sortBy.split(':');
        params.append('sort[0]', `${field}:${direction}`);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      // This matches your exact API response structure
      return result;
    },
    keepPreviousData: true
  });

  const handleFavoriteToggle = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: 'Removed from favorites',
          status: 'info',
          duration: 2000,
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: 'Added to favorites',
          status: 'success',
          duration: 2000,
        });
      }
      return newFavorites;
    });
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8}>
          <Heading 
            size="2xl" 
            bgGradient="linear(to-r, blue.400, purple.500)" 
            bgClip="text"
          >
            Marketplace
          </Heading>

          <HStack w="full" spacing={4}>
            <InputGroup>
              <InputLeftElement>
                <Search />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              w="200px"
            >
              <option value="rating:desc">Top Rated</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="createdAt:desc">Newest First</option>
            </Select>
          </HStack>

          {error ? (
            <Text color="red.500">Error: {error.message}</Text>
          ) : isLoading ? (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={6}
            >
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <Skeleton key={i} height="400px" />
              ))}
            </Grid>
          ) : (
            <>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {data?.data?.results?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      attributes: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        status: product.status,
                        stock: product.stock,
                        category: product.category,
                        subcategory: product.subcategory,
                        rating: product.rating,
                        images: { 
                          data: product.images?.map(img => ({
                            attributes: { url: img }
                          })) || []
                        }
                      }
                    }}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={favorites.has(product.id)}
                  />
                ))}
              </Grid>

              {data?.data?.attributes?.pagination && (
                <HStack justify="center" mt={8}>
                  <Button
                    isDisabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {page} of {data.data.attributes.pagination.pageCount}
                  </Text>
                  <Button
                    isDisabled={page >= data.data.attributes.pagination.pageCount}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}