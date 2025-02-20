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

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ product }) => {
  const router = useRouter();
  const toast = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');

  // Build image URL from Strapi data or fallback to a placeholder.
  const imageUrl = product?.attributes?.images?.data?.[0]?.attributes?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
    : '/placeholder-product.jpg';

  return (
    <Card bg={cardBg} overflow="hidden" boxShadow="md" borderRadius="md">
      <CardBody p={0}>
        <Box position="relative" h="260px">
          <Image
            src={imageUrl}
            alt={product.attributes.name}
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
        <VStack p={4} spacing={3} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" noOfLines={1}>
              {product.attributes.name}
            </Heading>
            <Badge colorScheme={product.attributes.status === 'available' ? 'green' : 'red'}>
              {product.attributes.status === 'available' ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </HStack>
          <Text noOfLines={2} color="gray.600">
            {product.attributes.description}
          </Text>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="xl" color="blue.500">
              {product.attributes.price} LYD
            </Text>
            <HStack>
              <Star size={16} fill="#F6E05E" />
              <Text>
                {product.attributes.rating?.toFixed(1) || '0.0'}
                <Text as="span" color="gray.500" ml={1}>
                  ({product.attributes.reviews?.data?.length || 0})
                </Text>
              </Text>
            </HStack>
          </HStack>
          {product.attributes.category && (
            <HStack spacing={2}>
              <Badge colorScheme="purple">
                {product.attributes.category}
              </Badge>
              {product.attributes.subcategory && (
                <Badge colorScheme="purple" variant="outline">
                  {product.attributes.subcategory}
                </Badge>
              )}
            </HStack>
          )}
          <Button
            colorScheme="blue"
            leftIcon={<ShoppingBag size={18} />}
            onClick={() => router.push(`/shop-items/${product.id}/public`)}
            isDisabled={product.attributes.status !== 'available' || product.attributes.stock <= 0}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

const MarketplacePreview = () => {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Debounce search input to reduce API calls.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on new search.
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', debouncedSearchTerm, selectedCategory, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': ITEMS_PER_PAGE.toString()
      });

      // Populate necessary relations.
      params.append('populate[images]', '*');
      params.append('populate[owner]', '*');
      params.append('populate[reviews]', '*');

      // Apply search filters if provided.
      if (debouncedSearchTerm) {
        params.append('filters[$or][0][name][$containsi]', debouncedSearchTerm);
        params.append('filters[$or][1][description][$containsi]', debouncedSearchTerm);
      }
      if (selectedCategory) {
        params.append('filters[category]', selectedCategory);
      }
      // Only fetch available items.
      params.append('filters[status][$eq]', 'available');

      const requestUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`;
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    keepPreviousData: true,
    staleTime: 60000 // Cache for 1 minute.
  });

  // Robustly handle different API response shapes.
  let products = [];
  let pagination = null;
  if (data) {
    if (Array.isArray(data.data)) {
      // If the API returns an array directly.
      products = data.data;
    } else if (data.data?.results) {
      // If the API returns an object with a "results" key.
      products = data.data.results;
      pagination = data.data.attributes?.pagination;
    } else {
      // Fallback: if data.data is an object but not an array.
      products = [];
    }
  }

  // Compute unique categories from the fetched products.
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    products.forEach(product => {
      if (product.attributes.category) {
        uniqueCategories.add(product.attributes.category);
      }
    });
    return Array.from(uniqueCategories);
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
                setPage(1); // Reset page when changing category.
              }}
              w="200px"
              bg="white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </HStack>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <Skeleton key={i} height="400px" borderRadius="md" />
              ))}
            </SimpleGrid>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>
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
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, pagination.pageCount))
                    }
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