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
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiShoppingBag,
  FiShoppingCart,
  FiMapPin,
  FiFilter,
  FiGrid,
  FiList,
  FiSliders,
  FiChevronDown,
  FiCheck,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiGlobe,
} from 'react-icons/fi';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useShopCart } from '@/contexts/ShopCartContext';
import { useAuth } from '@/hooks/useAuth';
import CartDrawer from '@/components/shop/CartDrawer';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import PaymentConfirmationModal from '@/components/shop/PaymentConfirmationModal';
import { useWallet } from '@/hooks/useWallet';

const ShopPage = () => {
  const router = useRouter();
  const { shopName } = router.query;
  const { cart, addToCart } = useShopCart();
  const { user } = useAuth();
  const toast = useToast();

  // State management
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  // Modal/drawer controls
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart
  } = useDisclosure();

  const {
    isOpen: isProductDetailOpen,
    onOpen: onOpenProductDetail,
    onClose: onCloseProductDetail
  } = useDisclosure();

  const {
    isOpen: isPaymentOpen,
    onOpen: onOpenPayment,
    onClose: onClosePayment
  } = useDisclosure();

  const {
    isOpen: isFilterOpen,
    onOpen: onOpenFilter,
    onClose: onCloseFilter
  } = useDisclosure();

  // Fetch shop data
  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
      if (!shopName) return null;

      const ownerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/owners?filters[shopName][$eq]=${shopName}`
      );

      if (!ownerResponse.ok) {
        throw new Error('Shop not found');
      }

      const ownerData = await ownerResponse.json();
      const ownerId = ownerData.data?.[0]?.id;

      if (!ownerId) {
        throw new Error('Shop not found');
      }

      const shopResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/owners/${ownerId}/public-shop`
      );

      if (!shopResponse.ok) {
        throw new Error('Failed to fetch shop data');
      }

      return await shopResponse.json();
    },
    enabled: Boolean(shopName)
  });

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  // Error state
  if (error || !shopData?.data) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <VStack spacing={4}>
            <Text fontSize="2xl" color="red.500">Shop Not Found</Text>
            <Button onClick={() => router.push('/')} colorScheme="blue">
              Return to Home
            </Button>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  const shop = shopData.data;
  const shopItems = shop.shop_items || [];
  const theme = shop.theme || {};
  const colors = theme.colors || {
    primary: '#3182CE',
    secondary: '#F7FAFC',
    accent: '#48BB78',
    text: '#2D3748'
  };

  // Filter and sort products
  const filteredProducts = shopItems.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'priceHigh':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = async (product, quantity = 1) => {
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

      const existingItem = cart.items.find(item => item.id === product.id);
      if (existingItem && existingItem.quantity + quantity > product.stock) {
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
        name: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        image: product.images?.[0]?.url 
          ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`
          : '/placeholder-product.jpg',
        ownerId: shop.id,
        quantity
      };

      addToCart(productData);
      toast({
        title: 'Added to cart',
        description: `${product.name} added to cart`,
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
        <title>{shop.shopName} - Shop</title>
        <meta name="description" content={shop.description || 'Welcome to our shop'} />
      </Head>

      <Layout>
        <Box bg={colors.secondary} minH="100vh">
          {/* Shop Header with Cover Image */}
          <Box position="relative" h="315px">
            <Image
              src={shop.coverImage?.url 
                ? `${process.env.NEXT_PUBLIC_API_URL}${shop.coverImage.url}`
                : '/default-cover.jpg'
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
            >
              <Image
                src={shop.logo?.url
                  ? `${process.env.NEXT_PUBLIC_API_URL}${shop.logo.url}`
                  : '/default-logo.jpg'
                }
                alt={`${shop.shopName} logo`}
                boxSize="160px"
                borderRadius="full"
                objectFit="cover"
              />
            </Box>
          </Box>

          <Container maxW="1400px" py={8}>
            <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} gap={8}>
              {/* Sidebar */}
              <GridItem display={{ base: 'none', lg: 'block' }}>
                <VStack align="stretch" spacing={6}>
                  {/* Categories */}
                  <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Categories</Heading>
                        <VStack align="stretch" w="full">
                          {shop.categories?.map(category => (
                            <Button
                              key={category}
                              variant="ghost"
                              justifyContent="flex-start"
                              w="full"
                              leftIcon={filterCategory === category ? <FiCheck /> : undefined}
                              onClick={() => setFilterCategory(category)}
                              color={filterCategory === category ? colors.primary : undefined}
                            >
                              {category}
                            </Button>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Location */}
                  {shop.location?.showOnPublicPage && (
                    <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <Heading size="md">Location</Heading>
                          <HStack>
                            <Icon as={FiMapPin} />
                            <Text>
                              {shop.location.address}, {shop.location.city}
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Social Links */}
                  <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Follow Us</Heading>
                        <HStack spacing={4}>
                          {shop.social_links?.website && (
                            <IconButton
                              icon={<FiGlobe />}
                              aria-label="Website"
                              onClick={() => window.open(shop.social_links.website, '_blank')}
                            />
                          )}
                          {shop.social_links?.facebook && (
                            <IconButton
                              icon={<FiFacebook />}
                              aria-label="Facebook"
                              onClick={() => window.open(shop.social_links.facebook, '_blank')}
                            />
                          )}
                          {shop.social_links?.instagram && (
                            <IconButton
                              icon={<FiInstagram />}
                              aria-label="Instagram"
                              onClick={() => window.open(shop.social_links.instagram, '_blank')}
                            />
                          )}
                          {shop.social_links?.x && (
                            <IconButton
                              icon={<FiTwitter />}
                              aria-label="Twitter"
                              onClick={() => window.open(shop.social_links.x, '_blank')}
                            />
                          )}
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </GridItem>

              {/* Main Content */}
              <GridItem>
                <VStack align="stretch" spacing={6}>
                  {/* Shop Info */}
                  <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={2}>
                      <Heading size="2xl" color={colors.primary}>
                        {shop.shopName}
                      </Heading>
                      <Text color="gray.600">{shop.description}</Text>
                      <HStack>
                        <Badge colorScheme="green">{shop.verificationStatus}</Badge>
                        <HStack>
                          <Icon as={FiStar} color="yellow.400" />
                          <Text>{shop.rating?.toFixed(1) || '0.0'}</Text>
                        </HStack>
                      </HStack>
                    </VStack>

                    <IconButton
                      icon={<FiShoppingCart />}
                      onClick={onOpenCart}
                      size="lg"
                      colorScheme="blue"
                      position="relative"
                    >
                      {cart.items.length > 0 && (
                        <Badge
                          position="absolute"
                          top="-2"
                          right="-2"
                          colorScheme="red"
                          borderRadius="full"
                          boxSize="6"
                        >
                          {cart.items.length}
                        </Badge>
                      )}
                    </IconButton>
                  </Flex>

                  {/* Search and Filters */}
                  <Flex gap={4} align="center">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      flex={1}
                    />

                    <HStack>
                      <IconButton
                        icon={<FiGrid />}
                        variant={viewType === 'grid' ? 'solid' : 'ghost'}
                        onClick={() => setViewType('grid')}
                        aria-label="Grid view"
                      />
                      <IconButton
                        icon={<FiList />}
                        variant={viewType === 'list' ? 'solid' : 'ghost'}
                        onClick={() => setViewType('list')}
                        aria-label="List view"
                      />
                    </HStack>

                    <Menu>
                      <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                        Sort by: {sortBy}
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => setSortBy('featured')}>Featured</MenuItem>
                        <MenuItem onClick={() => setSortBy('priceLow')}>Price: Low to High</MenuItem>
                        <MenuItem onClick={() => setSortBy('priceHigh')}>Price: High to Low</MenuItem>
                        <MenuItem onClick={() => setSortBy('newest')}>Newest</MenuItem>
                        <MenuItem onClick={() => setSortBy('rating')}>Most Popular</MenuItem>
                      </MenuList>
                    </Menu>

                    <IconButton
                      icon={<FiFilter />}
                      onClick={onOpenFilter}
                      display={{ base: 'flex', lg: 'none' }}
                      aria-label="Filters"
                    />
                  </Flex>

                  {/* Products Display */}
                  {viewType === 'grid' ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                      {sortedProducts.map((product) => (
                        <Card
                          key={product.id}
                          cursor="pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            onOpenProductDetail();
                          }}
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                        >
                          <Box position="relative" h="200px">
                            <Image
                              src={product.images?.[0]?.url
                                ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`
                                : '/placeholder-product.jpg'
                              }
                              alt={product.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                            {product.status === 'out_of_stock' && (
                              <Badge
                                position="absolute"
                                top={2}
                                right={2}
                                colorScheme="red"
                              >
                                Out of Stock
                              </Badge>
                            )}
                          </Box>
                          <CardBody>
                            <VStack align="start" spacing={2}>
                              <Heading size="md">{product.name}</Heading>
                              <Text noOfLines={2} color="gray.600">
                                {product.description}
                              </Text>
                              <Text fontWeight="bold" fontSize="xl">
                                {product.price} LYD
                              </Text>
                              <Button
                                leftIcon={<FiShoppingBag />}
                                colorScheme="blue"
                                w="full"
                                isLoading={addingToCart[product.id]}
                                isDisabled={product.status === 'out_of_stock'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                Add to Cart
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <VStack spacing={4}>
                      {sortedProducts.map((product) => (
                        <Card
                          key={product.id}
                          direction={{ base: 'column', md: 'row' }}
                          overflow="hidden"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            onOpenProductDetail();
                          }}
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                        >
                          <Box w={{ base: 'full', md: '200px' }} h={{ base: '200px', md: 'auto' }}>
                            <Image
                              src={product.images?.[0]?.url
                                ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0].url}`
                                : '/placeholder-product.jpg'
                              }
                              alt={product.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                          </Box>
                          <CardBody>
                            <Grid templateColumns={{ md: '1fr auto' }} gap={4}>
                              <VStack align="start" spacing={2}>
                                <Heading size="md">{product.name}</Heading>
                                <Text color="gray.600">{product.description}</Text>
                                <Text fontWeight="bold" fontSize="xl">
                                  {product.price} LYD
                                </Text>
                              </VStack>
                              <Button
                                leftIcon={<FiShoppingBag />}
                                colorScheme="blue"
                                isLoading={addingToCart[product.id]}
                                isDisabled={product.status === 'out_of_stock'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Grid>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </GridItem>
            </Grid>
          </Container>

          {/* Modals and Drawers */}
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={onCloseCart} 
            shopData={shopData} 
          />

          {selectedProduct && (
            <ProductDetailModal
              isOpen={isProductDetailOpen}
              onClose={onCloseProductDetail}
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              theme={theme}
            />
          )}

          <PaymentConfirmationModal
            isOpen={isPaymentOpen}
            onClose={onClosePayment}
            onConfirm={handleAddToCart}
            totalAmount={cart.total}
            shopName={shop.shopName}
          />

          {/* Mobile Filters Drawer */}
          <Drawer isOpen={isFilterOpen} placement="right" onClose={onCloseFilter}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Filters</DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>Categories</Text>
                    <VStack align="stretch">
                      {shop.categories?.map(category => (
                        <Button
                          key={category}
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            setFilterCategory(category);
                            onCloseFilter();
                          }}
                          leftIcon={filterCategory === category ? <FiCheck /> : undefined}
                          color={filterCategory === category ? colors.primary : undefined}
                        >
                          {category}
                        </Button>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Layout>
    </>
  );
};

export default ShopPage;