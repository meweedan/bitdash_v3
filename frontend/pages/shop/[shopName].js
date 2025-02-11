import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Button,
  Badge,
  Flex,
  Icon,
  Card,
  CardBody,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import { FiStar, FiShoppingBag } from 'react-icons/fi';
import Head from 'next/head';

// Default theme configuration
const DEFAULT_THEME = {
  name: 'default',
  colors: {
    primary: 'blue.500',
    secondary: 'gray.100',
    text: 'gray.800'
  },
  layout: 'grid',
  coverHeight: '315px',
  logoSize: '160px',
  showLocation: true,
  showRatings: true,
  customCss: '',
  location: {
    showOnPublicPage: true
  }
};

const ShopPage = () => {
  const router = useRouter();
  const { shopName } = router.query;

  // Fetch shop data
  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
      if (!shopName) return null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-owners?` +
        `populate[logo][fields][0]=url` +
        `&populate[coverImage][fields][0]=url` +
        `&populate[shop_items][populate][images]=*` +
        `&populate[shop_items][fields]=*` +
        `&filters[shopName][$eq]=${shopName}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error('Shop not found');
      return response.json();
    },
    enabled: !!shopName
  });

  // Handle loading state
  if (isLoading) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Handle error or no shop found
  if (error || !shopData?.data?.[0]) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <VStack spacing={4}>
          <Text fontSize="2xl" color="red.500">
            Shop Not Found
          </Text>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </VStack>
      </Flex>
    );
  }

  // Extract shop data with fallbacks
  const shop = shopData.data[0].attributes;
  const theme = shop.theme || DEFAULT_THEME;

  // Ensure nested objects exist
  const location = shop.location || { 
    address: 'N/A', 
    city: 'N/A', 
    showOnPublicPage: false 
  };
  const shopItems = shop.shop_items?.data || [];

  return (
    <>
      <Head>
        <title>{shop.shopName || 'Shop'}</title>
        {theme.customCss && (
          <style>{theme.customCss}</style>
        )}
      </Head>

      <Box>
        {/* Cover and Logo Section */}
        <Box 
          bgColor={theme.colors?.secondary || 'gray.100'}
          position="relative"
          h={theme.coverHeight || '315px'}
        >
          <Image
            src={shop.coverImage?.data?.attributes?.url ?
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.coverImage.data.attributes.url}` :
              '/default-shop-cover.jpg'
            }
            alt={shop.shopName}
            objectFit="cover"
            w="full"
            h="full"
          />
          <Box
            position="absolute"
            bottom={8}
            left={8}
            bg="white"
            p={2}
            borderRadius="full"
            boxShadow="xl"
            border="4px solid white"
          >
            <Image
              src={shop.logo?.data?.attributes?.url ?
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.data.attributes.url}` :
                '/default-shop-logo.jpg'
              }
              alt={`${shop.shopName} logo`}
              boxSize={theme.logoSize || '160px'}
              borderRadius="full"
              objectFit="cover"
            />
          </Box>
        </Box>

        {/* Shop Info */}
        <Container maxW="1400px" py={8}>
          <VStack align="start" spacing={4}>
            <Flex justify="space-between" w="full" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="2xl">{shop.shopName}</Heading>
                <Text color="gray.600" fontSize="lg">
                  {shop.description || 'No description available'}
                </Text>
                <HStack spacing={4}>
                  <Badge colorScheme="green">
                    {shop.verificationStatus || 'Pending'}
                  </Badge>
                  
                  {/* Location */}
                  {theme.showLocation && location.showOnPublicPage && (
                    <Box>
                      <Text>
                        {location.address} {location.city ? `, ${location.city}` : ''}
                      </Text>
                    </Box>
                  )}
                  
                  {/* Rating */}
                  {theme.showRatings && (
                    <HStack color="yellow.500">
                      <Icon as={FiStar} />
                      <Text>{shop.rating?.toFixed(1) || '0.0'}</Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Flex>

            {/* Products Grid/List */}
            {theme.layout === 'grid' ? (
              <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
                {shopItems.map((product) => (
                  <Card 
                    key={product.id}
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: 'translateY(-4px)' }}
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Box position="relative" h="300px">
                      <Image
                        src={product.attributes.images?.data?.[0]?.attributes?.url ?
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}` :
                          '/placeholder-product.jpg'
                        }
                        alt={product.attributes.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </Box>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <Heading size="md">
                          {product.attributes.name}
                        </Heading>
                        <Text color="gray.600" noOfLines={2}>
                          {product.attributes.description}
                        </Text>
                        <Text 
                          color={theme.colors?.primary || 'blue.500'}
                          fontWeight="bold" 
                          fontSize="xl"
                        >
                          {product.attributes.price} LYD
                        </Text>
                        <Button
                          leftIcon={<FiShoppingBag />}
                          colorScheme="blue"
                          w="full"
                          isDisabled={
                            product.attributes.stock <= 0 || 
                            product.attributes.status === 'out_of_stock'
                          }
                        >
                          {product.attributes.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <VStack spacing={4} w="full">
                {shopItems.map((product) => (
                  <Card 
                    key={product.id}
                    w="full"
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: 'translateY(-4px)' }}
                    borderWidth="1px"
                    borderColor="gray.200"
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    <Box position="relative" h="300px" w={{ base: 'full', md: '300px' }}>
                      <Image
                        src={product.attributes.images?.data?.[0]?.attributes?.url ?
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}` :
                          '/placeholder-product.jpg'
                        }
                        alt={product.attributes.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </Box>
                    <CardBody flex="1">
                      <VStack align="start" spacing={2}>
                        <Heading size="md">
                          {product.attributes.name}
                        </Heading>
                        <Text color="gray.600" noOfLines={3}>
                          {product.attributes.description}
                        </Text>
                        <Text 
                          color={theme.colors?.primary || 'blue.500'}
                          fontWeight="bold" 
                          fontSize="xl"
                        >
                          {product.attributes.price} LYD
                        </Text>
                        <Button
                          leftIcon={<FiShoppingBag />}
                          colorScheme="blue"
                          w="full"
                          isDisabled={
                            product.attributes.stock <= 0 || 
                            product.attributes.status === 'out_of_stock'
                          }
                        >
                          {product.attributes.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}

            {/* No Products Message */}
            {shopItems.length === 0 && (
              <Flex w="full" justify="center" py={10}>
                <VStack spacing={4}>
                  <Text fontSize="xl" color="gray.500">
                    No products available in this shop
                  </Text>
                </VStack>
              </Flex>
            )}
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default ShopPage;