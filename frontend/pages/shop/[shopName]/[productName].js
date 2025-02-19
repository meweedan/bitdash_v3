// pages/shop/[shopName]/[productName].js
import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Button,
  Badge,
  Flex,
  Spinner,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from '@chakra-ui/react';
import { FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useShopCart } from '@/contexts/ShopCartContext';
import { useAuth } from '@/hooks/useAuth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductPage = () => {
  const router = useRouter();
  const { shopName, productName } = router.query;
  const { cart, addToCart } = useShopCart();
  const { user } = useAuth();
  const toast = useToast();

  // Fetch product data
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', shopName, productName],
    queryFn: async () => {
      if (!shopName || !productName) return null;

      // Clean up the product name by removing hyphens and special characters
      const cleanProductName = decodeURIComponent(productName.replace(/-/g, ' ').trim());

      // Construct the query params properly
      const params = new URLSearchParams({
        'populate[images]': '*',
        'populate[owner]': '*',
        'populate[specifications]': '*',
        'populate[reviews]': '*',
        'filters[name][$eq]': cleanProductName,
        'filters[owner][shopName][$eq]': shopName
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('API Error:', await response.text());
        throw new Error('Product not found');
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!result.data?.[0]) {
        throw new Error('Product not found');
      }

      return result;
    },
    enabled: Boolean(shopName) && Boolean(productName),
    retry: false
  });

  if (isLoading) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  if (!productData?.data?.[0]) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <VStack spacing={4}>
            <Text fontSize="2xl" color="red.500">
              Product Not Found
            </Text>
            <Button onClick={() => router.push(`/${shopName}`)}>
              Return to Shop
            </Button>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  const product = productData.data[0];

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add items to cart',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    const existingItem = cart.items.find(item => item.id === product.id);
    if (existingItem && existingItem.quantity >= product.attributes.stock) {
      toast({
        title: 'Stock limit reached',
        description: 'Cannot add more of this item',
        status: 'error',
        duration: 2000
      });
      return;
    }

    const productData = {
      id: product.id,
      name: product.attributes.name,
      price: parseFloat(product.attributes.price),
      stock: product.attributes.stock,
      image: product.attributes.images?.data?.[0]?.attributes?.url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
        : '/placeholder-product.jpg',
      ownerId: product.attributes.owner.data.id
    };
    
    addToCart(productData);
    toast({
      title: 'Added to cart',
      description: `${product.attributes.name} added to cart`,
      status: 'success',
      duration: 2000
    });
  };

  return (
    <>
      <Head>
        <title>{product.attributes.name} - {shopName}</title>
        <meta name="description" content={product.attributes.description} />
        <meta property="og:title" content={product.attributes.name} />
        <meta property="og:description" content={product.attributes.description} />
        {product.attributes.images?.data?.[0] && (
          <meta 
            property="og:image" 
            content={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`} 
          />
        )}
      </Head>
      <Layout>
        <Container maxW="1400px" py={8}>
          <VStack align="stretch" spacing={8}>
            {/* Breadcrumb */}
            <Breadcrumb 
              spacing="8px" 
              separator={<Icon as={FiChevronRight} color="gray.500" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push(`/${shopName}`)}>
                  {shopName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <Text>{product.attributes.name}</Text>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Product Content */}
            <Flex 
              direction={{ base: 'column', lg: 'row' }} 
              gap={8}
              align="start"
            >
              {/* Image Gallery */}
              <Box flex="1">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  loop={product.attributes.images?.data?.length > 1}
                  style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                  }}
                >
                  {product.attributes.images?.data?.length > 0 ? (
                    product.attributes.images.data.map((image, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          position="relative"
                          height="500px"
                          borderRadius="lg"
                          overflow="hidden"
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                            alt={`${product.attributes.name} - Image ${index + 1}`}
                            objectFit="cover"
                            w="full"
                            h="full"
                          />
                        </Box>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <Box
                        position="relative"
                        height="500px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src="/placeholder-product.jpg"
                          alt={product.attributes.name}
                          objectFit="cover"
                          w="full"
                          h="full"
                        />
                      </Box>
                    </SwiperSlide>
                  )}
                </Swiper>
              </Box>

              {/* Product Info */}
              <VStack flex="1" align="start" spacing={6}>
                <VStack align="start" spacing={2}>
                  <Heading size="2xl">
                    {product.attributes.name}
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                    {product.attributes.price} LYD
                  </Text>
                </VStack>

                <Text color="gray.600" fontSize="lg">
                  {product.attributes.description}
                </Text>

                {product.attributes.specifications && (
                  <VStack align="start" w="full" spacing={4}>
                    <Heading size="md">Specifications</Heading>
                    <Box w="full">
                      {Object.entries(product.attributes.specifications).map(([key, value]) => (
                        <HStack 
                          key={key} 
                          justify="space-between" 
                          py={2} 
                          borderBottomWidth={1} 
                          borderColor="gray.200"
                        >
                          <Text color="gray.600" textTransform="capitalize">
                            {key.replace(/_/g, ' ')}
                          </Text>
                          <Text fontWeight="medium">{value}</Text>
                        </HStack>
                      ))}
                    </Box>
                  </VStack>
                )}

                <HStack spacing={4} w="full">
                  {product.attributes.stock <= 10 && product.attributes.stock > 0 && (
                    <Badge colorScheme="yellow" p={2} borderRadius="md">
                      Only {product.attributes.stock} left
                    </Badge>
                  )}
                  {product.attributes.status !== 'available' && (
                    <Badge colorScheme="red" p={2} borderRadius="md">
                      Not Available
                    </Badge>
                  )}
                </HStack>

                <Button
                  leftIcon={<FiShoppingBag />}
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isDisabled={
                    product.attributes.stock <= 0 || 
                    product.attributes.status !== 'available'
                  }
                  onClick={handleAddToCart}
                >
                  {product.attributes.stock > 0 && product.attributes.status === 'available' 
                    ? 'Add to Cart' 
                    : 'Out of Stock'
                  }
                </Button>

                <VStack align="start" w="full" spacing={2}>
                  <Heading size="sm">Category</Heading>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                      {product.attributes.category}
                    </Badge>
                    {product.attributes.subcategory && (
                      <Badge colorScheme="gray" fontSize="md" px={2} py={1}>
                        {product.attributes.subcategory}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </VStack>
            </Flex>
          </VStack>
        </Container>
      </Layout>
    </>
  );
};

export default ProductPage;