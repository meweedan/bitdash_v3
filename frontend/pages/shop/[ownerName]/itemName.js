// pages/shop/[ownerName]/[itemName].js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ReviewsList from '@/components/shop/ReviewsList';

export default function ShopItemDetails() {
  const router = useRouter();
  const { ownerName, itemName } = router.query;
  const toast = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const bgColor = useColorModeValue('white', 'gray.800');

  const { data, isLoading, error } = useQuery({
    queryKey: ['shop-item', ownerName, itemName],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?` +
        `populate[images]=*` +
        `&populate[owner][fields][0]=shopName` +
        `&populate[reviews]=*` +
        `&filters[owner][shopName][$eq]=${ownerName}` +
        `&filters[name][$eq]=${itemName}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      if (!data.data?.results?.[0]) {
        throw new Error('Product not found');
      }

      return data.data.results[0];
    },
    enabled: !!ownerName && !!itemName
  });

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            <Skeleton height="500px" />
            <VStack align="stretch" spacing={6}>
              <Skeleton height="40px" />
              <Skeleton height="20px" />
              <Skeleton height="30px" />
              <Skeleton height="100px" />
            </VStack>
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            {error?.message || 'Product not found'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const product = data;
  const images = product.images || [];
  const currentImage = images[currentImageIndex]?.url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[currentImageIndex].url}`
    : '/placeholder-product.jpg';

  return (
    <Layout>
      <Head>
        <title>{product.name} - {ownerName}'s Shop</title>
        <meta name="description" content={product.description} />
      </Head>

      <Container maxW="7xl" py={8}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Image Gallery */}
          <GridItem position="relative">
            <Box position="relative" height="500px">
              <Image
                src={currentImage}
                alt={product.name}
                objectFit="cover"
                w="full"
                h="full"
                borderRadius="lg"
              />
              {images.length > 1 && (
                <>
                  <IconButton
                    icon={<ChevronLeft />}
                    position="absolute"
                    left={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    isRound
                  />
                  <IconButton
                    icon={<ChevronRight />}
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === images.length - 1 ? 0 : prev + 1
                    )}
                    isRound
                  />
                </>
              )}
            </Box>
            
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <HStack mt={4} spacing={2} overflowX="auto" p={2}>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    boxSize="60px"
                    objectFit="cover"
                    cursor="pointer"
                    opacity={currentImageIndex === idx ? 1 : 0.6}
                    onClick={() => setCurrentImageIndex(idx)}
                    borderRadius="md"
                  />
                ))}
              </HStack>
            )}
          </GridItem>

          {/* Product Details */}
          <GridItem>
            <VStack align="stretch" spacing={6}>
              <Box>
                <HStack justify="space-between">
                  <Heading size="lg">{product.name}</Heading>
                  <IconButton
                    aria-label="Add to favorites"
                    icon={<Heart />}
                    variant="ghost"
                    onClick={() => {
                      toast({
                        title: 'Added to favorites',
                        status: 'success',
                        duration: 2000,
                      });
                    }}
                  />
                </HStack>
                <Text color="gray.500" mt={2}>By {ownerName}</Text>
              </Box>

              <HStack>
                <Badge colorScheme={product.status === 'available' ? 'green' : 'red'}>
                  {product.status === 'available' ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <HStack>
                  <Star size={16} fill="#F6E05E" />
                  <Text>{product.rating?.toFixed(1) || '0.0'} ({product.reviews?.length || 0} reviews)</Text>
                </HStack>
              </HStack>

              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {product.price} LYD
              </Text>

              <Text>{product.description}</Text>

              {product.specifications && (
                <Box>
                  <Text fontWeight="bold" mb={2}>Specifications:</Text>
                  <Text>{product.specifications}</Text>
                </Box>
              )}

              <HStack>
                <NumberInput
                  value={quantity}
                  onChange={(_, val) => setQuantity(val)}
                  min={1}
                  max={product.stock}
                  w="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  colorScheme="blue"
                  leftIcon={<ShoppingBag />}
                  isDisabled={product.status !== 'available' || product.stock <= 0}
                  onClick={() => {
                    toast({
                      title: 'Added to cart',
                      status: 'success',
                      duration: 2000,
                    });
                  }}
                  flex={1}
                >
                  Add to Cart
                </Button>
              </HStack>
            </VStack>

            <Tabs mt={8}>
              <TabList>
                <Tab>Details</Tab>
                <Tab>Reviews</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    <HStack>
                      <Text fontWeight="bold">Category:</Text>
                      <Badge colorScheme="purple">{product.category}</Badge>
                      {product.subcategory && (
                        <Badge colorScheme="purple" variant="outline">
                          {product.subcategory}
                        </Badge>
                      )}
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">Stock:</Text>
                      <Text>{product.stock} units</Text>
                    </HStack>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <ReviewsList shopItemId={product.id} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
}