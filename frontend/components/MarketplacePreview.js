import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
  Badge,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
  SimpleGrid
} from '@chakra-ui/react';
import { Search, ShoppingBag, Heart, Star } from 'lucide-react';

// Display a single product
const ProductCard = ({ product }) => {
  const router = useRouter();
  const toast = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');

  // If your real API eventually includes `images`, adapt here:
  const imageUrl = '/placeholder-product.jpg';

  return (
    <Card bg={cardBg} overflow="hidden" boxShadow="md" borderRadius="md">
      <CardBody p={0}>
        {/* Image Section */}
        <Box position="relative" h="260px">
          <Image
            src={imageUrl}
            alt={product.name}
            objectFit="cover"
            w="full"
            h="full"
          />
          <IconButton
            aria-label="Favorite product"
            icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
            position="absolute"
            top={4}
            right={4}
            rounded="full"
            variant="ghost"
            onClick={() => {
              setIsFavorited(!isFavorited);
              toast({
                title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
                status: isFavorited ? 'info' : 'success',
                duration: 2000,
                isClosable: true,
              });
            }}
          />
        </Box>

        {/* Text Content Section */}
        <VStack p={4} spacing={3} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" noOfLines={1}>
              {product.name}
            </Heading>
            <Badge colorScheme={product.status === 'available' ? 'green' : 'red'}>
              {product.status === 'available' ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </HStack>
          <Text noOfLines={2} color="gray.600">
            {product.description}
          </Text>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="xl" color="blue.500">
              {product.price} LYD
            </Text>
            <HStack>
              <Star size={16} fill="#F6E05E" />
              <Text>
                {product.rating?.toFixed(1) || '0.0'}
                <Text as="span" color="gray.500" ml={1}>
                  (0 reviews)
                </Text>
              </Text>
            </HStack>
          </HStack>

          {/* Category & Subcategory */}
          {(product.category || product.subcategory) && (
            <HStack spacing={2}>
              {product.category && (
                <Badge colorScheme="purple">{product.category}</Badge>
              )}
              {product.subcategory && (
                <Badge colorScheme="purple" variant="outline">
                  {product.subcategory}
                </Badge>
              )}
            </HStack>
          )}

          {/* Action Button */}
          <Button
            colorScheme="blue"
            leftIcon={<ShoppingBag size={18} />}
            onClick={() => router.push(`/shop-items/${product.id}/public`)}
            isDisabled={product.status !== 'available' || product.stock <= 0}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

const ITEMS_PER_PAGE = 12;

const MarketplacePreview = () => {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Debounce the searchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query: fetch the shop items
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', debouncedSearchTerm, selectedCategory, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': ITEMS_PER_PAGE.toString()
      });
      // If you do have images in your real data, add more populate fields
      // Otherwise, this example JSON doesn't have images or owner
      // params.append('populate[images]', '*');
      // params.append('populate[owner]', '*');

      // Filter by search
      if (debouncedSearchTerm) {
        params.append('filters[$or][0][name][$containsi]', debouncedSearchTerm);
        params.append('filters[$or][1][description][$containsi]', debouncedSearchTerm);
      }
      // Filter by category
      if (selectedCategory) {
        params.append('filters[category]', selectedCategory);
      }
      // Only available items
      params.append('filters[status][$eq]', 'available');

      const requestUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`;
      console.log('[MarketplacePreview] GET =>', requestUrl);

      const response = await fetch(requestUrl);
      if (!response.ok) {
        const text = await response.text();
        console.error('[MarketplacePreview] Error =>', text);
        throw new Error('Failed to fetch products');
      }
      const json = await response.json();
      console.log('[MarketplacePreview] API response =>', json);
      return json;
    },
    keepPreviousData: true,
    staleTime: 60000
  });

  // According to your final shape:
  // {
  //   "data": {
  //     "attributes": {
  //       "results": [...],
  //       "pagination": {...}
  //     }
  //   },
  //   "meta": {}
  // }
  const products = data?.data?.attributes?.results || [];
  const pagination = data?.data?.attributes?.pagination;

  // Compute categories from the returned items
  const categories = useMemo(() => {
    const setOfCategories = new Set();
    products.forEach((item) => {
      if (item.category) {
        setOfCategories.add(item.category);
      }
    });
    return Array.from(setOfCategories);
  }, [products]);

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading products: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Heading size="2xl">Marketplace</Heading>

          {/* Search + Category Filter */}
          <HStack w="full" spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
              />
            </InputGroup>
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              w="200px"
              bg="white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </HStack>

          {/* Loading Skeleton */}
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <Skeleton key={i} height="400px" borderRadius="md" />
              ))}
            </SimpleGrid>
          ) : (
            <>
              {/* Render the products */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </SimpleGrid>

              {/* Pagination Controls */}
              {pagination && (
                <HStack justify="center" mt={8}>
                  <Button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {page} of {pagination.pageCount}
                  </Text>
                  <Button
                    onClick={() => {
                      const nextPage = Math.min(page + 1, pagination.pageCount);
                      setPage(nextPage);
                    }}
                    isDisabled={page >= pagination.pageCount}
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
};

export default MarketplacePreview;
