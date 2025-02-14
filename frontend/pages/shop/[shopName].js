// pages/[shopName].js
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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Select,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  GridItem,
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
  FiGlobe
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
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch wallet data if user is logged in
  const { data: walletData } = useWallet();

  // Modal and drawer controls
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners/shop/${shopName}`,
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
            <Text fontSize="2xl" color="red.500">
              Shop Not Found
            </Text>
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
  const location = shop.location || {};
  const socialLinks = shop.social_links || {};

  // Filter and sort products
  const filteredProducts = shopItems.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const price = parseFloat(product.price);
    let matchesPrice = true;
    
    if (priceRange === 'under50') matchesPrice = price < 50;
    else if (priceRange === '50to100') matchesPrice = price >= 50 && price <= 100;
    else if (priceRange === 'over100') matchesPrice = price > 100;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceLow') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'priceHigh') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'popular') return b.rating - a.rating;
    return 0; // featured
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    onOpenProductDetail();
  };

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
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].url}`
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

  const handlePaymentConfirm = async (pin) => {
    try {
      // Implementation similar to your DynamicPaymentPage
      // Process payment using useTransfer hook
      toast({
        title: 'Payment successful',
        status: 'success',
        duration: 2000
      });
      onClosePayment();
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <>
      <Head>
        <title>{shop.shopName} - BitShop</title>
        <meta name="description" content={shop.description || 'Shop on BitDash'} />
        <meta property="og:title" content={shop.shopName} />
        <meta property="og:description" content={shop.description} />
        {shop.logo?.url && (
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.url}`} />
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
              src={shop.coverImage?.url
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.coverImage.url}`
                : '/default-shop-cover.jpg'
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
                src={shop.logo?.url
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.url}`
                  : '/default-shop-logo.jpg'
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
            <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} gap={8}>
              {/* Sidebar */}
              <GridItem display={{ base: 'none', lg: 'block' }}>
                <VStack spacing={6} align="stretch">
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Categories</Heading>
                        <VStack align="stretch" w="full">
                          {['Electronics', 'Fashion', 'Home', 'Beauty'].map(cat => (
                            <Button
                              key={cat}
                              variant="ghost"
                              justifyContent="flex-start"
                              w="full"
                              leftIcon={filterCategory === cat ? <FiCheck /> : undefined}
                              onClick={() => setFilterCategory(cat)}
                              color={filterCategory === cat ? 'blue.500' : undefined}
                            >
                              {cat}
                            </Button>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Price Range</Heading>
                        <VStack align="stretch" w="full">
                          {[
                            { value: 'all', label: 'All Prices' },
                            { value: 'under50', label: 'Under 50 LYD' },
                            { value: '50to100', label: '50 - 100 LYD' },
                            { value: 'over100', label: 'Over 100 LYD' }
                          ].map(range => (
                            <Button
                              key={range.value}
                              variant="ghost"
                              justifyContent="flex-start"
                              w="full"
                              leftIcon={priceRange === range.value ? <FiCheck /> : undefined}
                              onClick={() => setPriceRange(range.value)}
                              color={priceRange === range.value ? 'blue.500' : undefined}
                            >
                              {range.label}
                            </Button>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {theme.showLocation && location.showOnPublicPage && (
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <Heading size="md">Location</Heading>
                          <HStack>
                            <Icon as={FiMapPin} color="gray.500" />
                            <Text>
                              {location.address}, {location.city}
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {theme.showSocialLinks && (
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <Heading size="md">Follow Us</Heading>
                          <HStack spacing={4}>
                            {socialLinks.website && (
                              <IconButton
                                icon={<FiGlobe />}
                                aria-label="Website"
                                variant="ghost"
                                onClick={() => window.open(socialLinks.website, '_blank')}
                              />
                            )}
                            {socialLinks.facebook && (
                              <IconButton
                                icon={<FiFacebook />}
                                aria-label="Facebook"
                                variant="ghost"
                                onClick={() => window.open(socialLinks.facebook, '_blank')}
                              />
                            )}
                            {socialLinks.instagram && (
                              <IconButton
                                icon={<FiInstagram />}
                                aria-label="Instagram"
                                variant="ghost"
                                onClick={() => window.open(socialLinks.instagram, '_blank')}
                              />
                            )}
                            {socialLinks.x && (
                              <IconButton
                                icon={<FiTwitter />}
                                aria-label="Twitter"
                                variant="ghost"
                                onClick={() => window.open(socialLinks.x, '_blank')}
                              />
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </GridItem>

              {/* Main Content */}
              <GridItem>
                <VStack align="stretch" spacing={6}>
                  {/* Shop Header */}
                  <Flex 
                    justify="space-between" 
                    align="center" 
                    w="full"
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                  >
                    <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
                      <Heading size="2xl">{shop.shopName}</Heading>
                      <Text color="gray.600" fontSize="lg">
                        {shop.description}
                      </Text>
                      <HStack spacing={4}>
                        <Badge colorScheme="green" px={2} py={1}>
                          {shop.verificationStatus}
                        </Badge>
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

                  {/* Filters and Search */}
                  <Flex 
                    gap={4} 
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'stretch', md: 'center' }}
                  >
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      flex={{ md: 1 }}
                    />
                    
                    <HStack display={{ base: 'none', md: 'flex' }}>
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
                        <MenuItem onClick={() => setSortBy('popular')}>Most Popular</MenuItem>
                      </MenuList>
                    </Menu>

                    <IconButton
                      icon={<FiFilter />}
                      display={{ base: 'flex', lg: 'none' }}
                      onClick={onOpenFilter}
                      aria-label="Filters"
                    />
                  </Flex>

                  {/* Products Grid/List */}
                  {viewType === 'grid' ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                      {sortedProducts.map((product) => (
                        <Card
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          cursor="pointer"
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                          overflow="hidden"
                        >
                          <Box position="relative" h="200px">
                            <Image
                              src={product.images?.[0]?.url
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].url}`
                                : '/placeholder-product.jpg'
                              }
                              alt={product.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
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
                          onClick={() => handleProductClick(product)}
                          cursor="pointer"
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                          overflow="hidden"
                          direction={{ base: 'column', md: 'row' }}
                        >
                          <Box w={{ base: 'full', md: '200px' }} h={{ base: '200px', md: 'auto' }}>
                            <Image
                              src={product.images?.[0]?.url
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].url}`
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
            customerBalance={walletData?.data?.attributes?.balance || 0}
            totalAmount={cart.total}
            shopName={shop.shopName}
            onConfirmPayment={handlePaymentConfirm}
          />

          {/* Mobile Filters Drawer */}
          <Drawer
            isOpen={isFilterOpen}
            placement="right"
            onClose={onCloseFilter}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Filters</DrawerHeader>
              <DrawerBody>
                {/* Mobile filters content */}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Layout>
    </>
  );
};

export default ShopPage;