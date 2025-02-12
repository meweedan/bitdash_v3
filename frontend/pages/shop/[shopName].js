// pages/shop/[shopName].js
import React, { useState } from 'react';
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
  useColorModeValue,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiStar, FiShoppingBag, FiShoppingCart, FiMapPin } from 'react-icons/fi';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useShopCart } from '@/contexts/ShopCartContext';
import CartDrawer from '@/components/shop/owner/CartDrawer';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import { useAuth } from '@/hooks/useAuth';

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
  const { cart, addToCart } = useShopCart();
  const { user } = useAuth();
  const toast = useToast();
  const [addingToCart, setAddingToCart] = useState({});
  const { 
    isOpen: isCartOpen, 
    onOpen: onOpenCart, 
    onClose: onCloseCart 
  } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { 
    isOpen: isProductDetailOpen, 
    onOpen: onOpenProductDetail, 
    onClose: onCloseProductDetail 
  } = useDisclosure();

  // Add click handler for product cards
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    onOpenProductDetail();
  };

  // Fetch shop data
  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
      if (!shopName) return null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate[logo][fields][0]=url` +
        `&populate[coverImage][fields][0]=url` +
        `&populate[shop_items][populate][images]=*` +
        `&populate[shop_items][fields]=*` +
        `&populate[wallet][fields]=*` +  // Important for BitCash payments
        `&populate[owner][fields]=*` +   // Add owner details
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
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  // Handle error or no shop found
  if (error || !shopData?.data?.[0]) {
    return (
      <Layout>
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
      </Layout>
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

  const handleAddToCart = async (product) => {
  setAddingToCart(prev => ({ ...prev, [product.id]: true }));
  try {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add items to cart',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    // Check if item is already in cart
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
      ownerId: shopData.data[0].id  // Add owner ID for order creation
    };
    
    addToCart(productData);
    toast({
      title: 'Added to cart',
      description: `${product.attributes.name} added to cart`,
      status: 'success',
      duration: 2000
    });

    } finally {
        setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      }
    };

  return (
    <>
      <Head>
        <title>{shop.shopName || 'Shop'}</title>
        <meta name="description" content={shop.description || `Shop on BitDash`} />
        <meta property="og:title" content={shop.shopName} />
        <meta property="og:description" content={shop.description} />
        {shop.logo?.data?.attributes?.url && (
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.data.attributes.url}`} />
        )}
        {theme.customCss && (
          <style>{theme.customCss}</style>
        )}
      </Head>
      <Layout>
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
            <VStack align="start" spacing={4} w="full">
              <Flex 
                justify="space-between" 
                w="full" 
                align="center"
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
                  <Heading size="2xl">{shop.shopName}</Heading>
                  <Text color="gray.600" fontSize="lg" textAlign={{ base: 'center', md: 'left' }}>
                    {shop.description || 'No description available'}
                  </Text>
                  <HStack spacing={4} flexWrap="wrap" justify={{ base: 'center', md: 'start' }}>
                    <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                      {shop.verificationStatus || 'Pending'}
                    </Badge>
                    
                    {/* Location */}
                    {theme.showLocation && location.showOnPublicPage && location.address && (
                      <HStack spacing={1}>
                        <Icon as={FiMapPin} color="gray.500" />
                        <Text color="gray.600">
                          {location.address} {location.city ? `, ${location.city}` : ''}
                        </Text>
                      </HStack>
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

                <IconButton
                  icon={<FiShoppingCart />}
                  onClick={onOpenCart}
                  colorScheme="blue"
                  size="lg"
                  position="relative"
                  aria-label="Shopping Cart"
                >
                  {cart.items.length > 0 && (
                    <Badge
                      position="absolute"
                      top="-2"
                      right="-2"
                      colorScheme="red"
                      borderRadius="full"
                      boxSize="6"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {cart.items.length}
                    </Badge>
                  )}
                </IconButton>
              </Flex>

              {/* Products Grid/List */}
              {theme.layout === 'grid' ? (
                <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6} w="full">
                  {shopItems.map((product) => (
                    <Card 
                      onClick={() => handleProductClick(product)}
                      cursor="pointer"
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
                        {product.attributes.status !== 'available' && (
                          <Flex
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="blackAlpha.60"
                            justify="center"
                            align="center"
                          >
                            <Badge 
                              colorScheme="red" 
                              fontSize="lg" 
                              p={2}
                              borderRadius="md"
                            >
                              Not Available
                            </Badge>
                          </Flex>
                        )}
                      </Box>
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Heading size="md">
                            {product.attributes.name}
                          </Heading>
                          <Text color="gray.600" noOfLines={2}>
                            {product.attributes.description}
                          </Text>
                          <HStack justify="space-between" w="full">
                            <Text 
                              color={theme.colors?.primary || 'blue.500'}
                              fontWeight="bold" 
                              fontSize="xl"
                            >
                              {product.attributes.price} LYD
                            </Text>
                            {product.attributes.stock <= 10 && product.attributes.stock > 0 && (
                              <Badge colorScheme="yellow">
                                Only {product.attributes.stock} left
                              </Badge>
                            )}
                          </HStack>
                          <Button
                            leftIcon={<FiShoppingBag />}
                            colorScheme="blue"
                            w="full"
                            isDisabled={
                              product.attributes.stock <= 0 || 
                              product.attributes.status !== 'available'
                            }
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleAddToCart(product);
                            }}
                          >
                            {product.attributes.stock > 0 && product.attributes.status === 'available' 
                              ? 'Add to Cart' 
                              : 'Out of Stock'
                            }
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
                      onClick={() => handleProductClick(product)}
                      cursor="pointer"
                      key={product.id}
                      w="full"
                      overflow="hidden"
                      transition="transform 0.2s"
                      _hover={{ transform: 'translateY(-4px)' }}
                      borderWidth="1px"
                      borderColor="gray.200"
                      direction={{ base: 'column', md: 'row' }}
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
                        {product.attributes.status !== 'available' && (
                          <Flex
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="blackAlpha.60"
                            justify="center"
                            align="center"
                          >
                            <Badge 
                              colorScheme="red" 
                              fontSize="lg" 
                              p={2}
                              borderRadius="md"
                            >
                              Not Available
                            </Badge>
                          </Flex>
                        )}
                      </Box>
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Heading size="md">
                            {product.attributes.name}
                          </Heading>
                          <Text color="gray.600" noOfLines={2}>
                            {product.attributes.description}
                          </Text>
                          <HStack justify="space-between" w="full">
                            <Text 
                              color={theme.colors?.primary || 'blue.500'}
                              fontWeight="bold" 
                              fontSize="xl"
                            >
                              {product.attributes.price} LYD
                            </Text>
                            {product.attributes.stock <= 10 && product.attributes.stock > 0 && (
                              <Badge colorScheme="yellow">
                                Only {product.attributes.stock} left
                              </Badge>
                            )}
                          </HStack>
                          <Button
                            isLoading={addingToCart[product.id]}
                            leftIcon={<FiShoppingBag />}
                            colorScheme="blue"
                            w="full"
                            isDisabled={
                              product.attributes.stock <= 0 || 
                              product.attributes.status !== 'available'
                            }
                            onClick={() => handleAddToCart(product)}
                          >
                            {product.attributes.stock > 0 && product.attributes.status === 'available' 
                              ? 'Add to Cart' 
                              : 'Out of Stock'
                            }
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

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={onCloseCart}
            shopData={shopData}
          />
        </Box>
        {selectedProduct && (
          <ProductDetailModal
            isOpen={isProductDetailOpen}
            onClose={onCloseProductDetail}
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            shopName={shopName}
          />
        )}
      </Layout>
    </>
  );
};

export default ShopPage;