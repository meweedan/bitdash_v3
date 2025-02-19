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
  FiChevronDown,
  FiCheck,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiGlobe,
} from 'react-icons/fi';
import Head from 'next/head';
import Layout from '@/components/Layout';

// Reusable
import { useShopCart } from '@/contexts/ShopCartContext';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';

// The Cart Drawer, Product Detail, Payment Confirmation
import CartDrawer from '@/components/shop/CartDrawer';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import PaymentConfirmationModal from '@/components/shop/PaymentConfirmationModal';

/**
 * Main ShopPage. 
 * Gathers data from 
 *   - GET /api/owners?filters[shopName][$eq]=...
 *   - Then GET /api/owners/:id/public-shop
 *   - Applies searching, sorting, filtering 
 *   - Offers grid/list view 
 *   - Uses modals for detail and cart
 */
export default function ShopPage() {
  const router = useRouter();
  const { shopName } = router.query;
  const { cart, addToCart } = useShopCart();
  const { user } = useAuth();
  const toast = useToast();
  const { data: walletData } = useWallet();

  // local states
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // disclosures
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();

  const {
    isOpen: isProductDetailOpen,
    onOpen: onOpenProductDetail,
    onClose: onCloseProductDetail,
  } = useDisclosure();

  const {
    isOpen: isPaymentOpen,
    onOpen: onOpenPayment,
    onClose: onClosePayment,
  } = useDisclosure();

  const {
    isOpen: isFilterOpen,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  // 1) Fetch the Shop Data
  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
      if (!shopName) return null;
      // Step 1: find the owner ID
      const ownerRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?filters[shopName][$eq]=${encodeURIComponent(shopName)}`
      );
      if (!ownerRes.ok) {
        throw new Error('Owner lookup failed');
      }
      const ownerJson = await ownerRes.json();
      const ownerId = ownerJson.data?.[0]?.id;
      if (!ownerId) {
        throw new Error('Shop not found');
      }
      // Step 2: fetch public-shop
      const publicRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners/${ownerId}/public-shop`
      );
      if (!publicRes.ok) {
        throw new Error('Failed to fetch public shop');
      }
      const publicJson = await publicRes.json();
      return publicJson;
    },
    enabled: !!shopName,
  });

  // 2) If loading or error
  if (isLoading) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }
  if (error || !shopData?.data) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <VStack spacing={4}>
            <Text fontSize="2xl" color="red.500">
              Shop Not Found
            </Text>
            <Button onClick={() => router.push('/')} colorScheme="blue">
              Return Home
            </Button>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  // 3) Destructure shop data
  const shop = shopData.data;
  const shopItems = shop.shop_items || [];
  const theme = shop.theme || {};
  const location = shop.location || {};
  const socialLinks = shop.social_links || {};

  // color palette from theme
  const colors = theme.colors || {
    primary: '#3182CE',
    secondary: '#F7FAFC',
    accent: '#48BB78',
    text: '#2D3748',
  };

  // 4) Filter & sort logic
  const filtered = shopItems.filter((prod) => {
    const matchSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'all' || prod.category === filterCategory;
    const price = parseFloat(prod.price);
    let matchPrice = true;
    if (priceRange === 'under50') matchPrice = price < 50;
    else if (priceRange === '50to100') matchPrice = price >= 50 && price <= 100;
    else if (priceRange === 'over100') matchPrice = price > 100;
    return matchSearch && matchCat && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priceLow') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'priceHigh') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'newest')
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'popular')
      return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
    // 'featured'
    return 0;
  });

  // 5) On product click => open product detail
  function handleProductClick(p) {
    setSelectedProduct(p);
    onOpenProductDetail();
  }

  // 6) Add to cart
  async function handleAddToCart(product, quantity = 1) {
    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      if (!user) {
        toast({
          title: 'Please log in',
          description: 'You need to be logged in to add items to cart',
          status: 'warning',
          duration: 3000,
        });
        return;
      }
      const existing = cart.items.find((i) => i.id === product.id);
      if (existing && existing.quantity + quantity > product.stock) {
        toast({
          title: 'Stock limit reached',
          description: 'Cannot add more of this item',
          status: 'error',
          duration: 2000,
        });
        return;
      }
      const productData = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        image:
          product.images?.[0]?.url
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].url}`
            : '/placeholder-product.jpg',
        ownerId: shop.id,
        quantity,
      };
      addToCart(productData);
      toast({
        title: 'Added to cart',
        description: `${product.name} added to cart`,
        status: 'success',
        duration: 2000,
      });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  }

  // Payment confirm
  function handlePaymentConfirm(pin) {
    try {
      // Payment logic
      toast({
        title: 'Payment successful',
        status: 'success',
        duration: 2000,
      });
      onClosePayment();
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  }

  return (
    <>
      <Head>
        <title>{shop.shopName} - BitShop</title>
        <meta
          name="description"
          content={shop.description || 'Shop on BitDash'}
        />
        <meta property="og:title" content={shop.shopName} />
        <meta property="og:description" content={shop.description} />
        {shop.logo?.url && (
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.url}`}
          />
        )}
        {theme.customCss && <style>{theme.customCss}</style>}
      </Head>

      <Layout>
        <Box bg={colors.secondary} color={colors.text}>
          {/* Cover + Logo */}
          <Box position="relative" h={theme.coverHeight || '315px'}>
            <Image
              src={
                shop.coverImage?.url
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.coverImage.url}`
                  : '/default-shop-cover.jpg'
              }
              alt={shop.shopName}
              objectFit="cover"
              w="full"
              h="full"
              style={{ filter: 'brightness(0.9)' }}
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
                src={
                  shop.logo?.url
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
                <VStack align="stretch" spacing={6}>
                  {/* Example categories card */}
                  <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Categories</Heading>
                        <VStack align="stretch">
                          {['Electronics', 'Fashion', 'Home', 'Beauty'].map((cat) => (
                            <Button
                              key={cat}
                              variant="ghost"
                              justifyContent="flex-start"
                              leftIcon={filterCategory === cat ? <FiCheck /> : undefined}
                              onClick={() => setFilterCategory(cat)}
                              color={filterCategory === cat ? colors.primary : undefined}
                            >
                              {cat}
                            </Button>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Price Range */}
                  <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">Price Range</Heading>
                        <VStack align="stretch">
                          {[
                            { value: 'all', label: 'All Prices' },
                            { value: 'under50', label: 'Under 50 LYD' },
                            { value: '50to100', label: '50 - 100 LYD' },
                            { value: 'over100', label: 'Over 100 LYD' },
                          ].map((range) => (
                            <Button
                              key={range.value}
                              variant="ghost"
                              justifyContent="flex-start"
                              leftIcon={priceRange === range.value ? <FiCheck /> : undefined}
                              onClick={() => setPriceRange(range.value)}
                              color={priceRange === range.value ? colors.primary : undefined}
                            >
                              {range.label}
                            </Button>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {theme.showLocation && location.showOnPublicPage && (
                    <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <Heading size="md">Location</Heading>
                          <HStack>
                            <Icon as={FiMapPin} />
                            <Text>
                              {location.address}, {location.city}
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {theme.showSocialLinks && (
                    <Card bg={colors.secondary} borderColor={colors.accent} borderWidth="1px">
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

              {/* Main */}
              <GridItem>
                <VStack align="stretch" spacing={6}>
                  {/* Shop header + cart */}
                  <Flex
                    justify="space-between"
                    align="center"
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                  >
                    <VStack align={{ base: 'center', md: 'start' }} spacing={1} w="full">
                      <Heading size="2xl" color={colors.primary}>
                        {shop.shopName}
                      </Heading>
                      <Text color="gray.600" fontSize="lg">
                        {shop.description}
                      </Text>
                      <HStack spacing={4}>
                        <Badge bg={colors.accent} color="white">
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

                    {/* Cart icon */}
                    <IconButton
                      icon={<FiShoppingCart />}
                      onClick={onOpenCart}
                      size="lg"
                      aria-label="Shopping Cart"
                      bg={colors.primary}
                      color="white"
                      _hover={{ bg: colors.accent }}
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
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {cart.items.length}
                        </Badge>
                      )}
                    </IconButton>
                  </Flex>

                  {/* Filters, search, etc. */}
                  <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      flex={{ md: 1 }}
                      bgColor="white"
                      borderColor="gray.300"
                      _focus={{ borderColor: colors.accent }}
                    />
                    <HStack display={{ base: 'none', md: 'flex' }}>
                      <IconButton
                        icon={<FiGrid />}
                        aria-label="Grid view"
                        variant={viewType === 'grid' ? 'solid' : 'ghost'}
                        onClick={() => setViewType('grid')}
                        colorScheme={viewType === 'grid' ? 'blue' : 'gray'}
                      />
                      <IconButton
                        icon={<FiList />}
                        aria-label="List view"
                        variant={viewType === 'list' ? 'solid' : 'ghost'}
                        onClick={() => setViewType('list')}
                        colorScheme={viewType === 'list' ? 'blue' : 'gray'}
                      />
                    </HStack>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<FiChevronDown />}
                        bg={colors.primary}
                        color="white"
                        _hover={{ bg: colors.accent }}
                      >
                        Sort by: {sortBy}
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => setSortBy('featured')}>
                          Featured
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('priceLow')}>
                          Price: Low to High
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('priceHigh')}>
                          Price: High to Low
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('newest')}>
                          Newest
                        </MenuItem>
                        <MenuItem onClick={() => setSortBy('popular')}>
                          Most Popular
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <IconButton
                      icon={<FiFilter />}
                      display={{ base: 'flex', lg: 'none' }}
                      onClick={onOpenFilter}
                      aria-label="Filters"
                      bg={colors.primary}
                      color="white"
                      _hover={{ bg: colors.accent }}
                    />
                  </Flex>

                  {/* Items list */}
                  {viewType === 'grid' ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                      {sorted.map((p) => (
                        <Card
                          key={p.id}
                          onClick={() => handleProductClick(p)}
                          cursor="pointer"
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                          overflow="hidden"
                          bg="white"
                          borderColor="gray.200"
                          borderWidth="1px"
                        >
                          <Box position="relative" h="200px">
                            <Image
                              src={
                                p.images?.[0]?.url
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${p.images[0].url}`
                                  : '/placeholder-product.jpg'
                              }
                              alt={p.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                          </Box>
                          <CardBody>
                            <VStack align="start" spacing={2}>
                              <Heading size="md" color={colors.text}>
                                {p.name}
                              </Heading>
                              <Text noOfLines={2} color="gray.600">
                                {p.description}
                              </Text>
                              <Text fontWeight="bold" fontSize="xl">
                                {p.price} LYD
                              </Text>
                              <Button
                                leftIcon={<FiShoppingBag />}
                                bg={colors.accent}
                                color="white"
                                w="full"
                                isLoading={addingToCart[p.id]}
                                _hover={{ bg: colors.primary }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(p);
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
                      {sorted.map((p) => (
                        <Card
                          key={p.id}
                          onClick={() => handleProductClick(p)}
                          cursor="pointer"
                          _hover={{ transform: 'translateY(-4px)' }}
                          transition="transform 0.2s"
                          overflow="hidden"
                          direction={{ base: 'column', md: 'row' }}
                          bg="white"
                          borderColor="gray.200"
                          borderWidth="1px"
                          w="full"
                        >
                          <Box w={{ base: 'full', md: '200px' }} h={{ base: '200px' }}>
                            <Image
                              src={
                                p.images?.[0]?.url
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${p.images[0].url}`
                                  : '/placeholder-product.jpg'
                              }
                              alt={p.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                          </Box>
                          <CardBody>
                            <Grid templateColumns={{ md: '1fr auto' }} gap={4}>
                              <VStack align="start" spacing={2}>
                                <Heading size="md" color={colors.text}>
                                  {p.name}
                                </Heading>
                                <Text color="gray.600">{p.description}</Text>
                                <Text fontWeight="bold" fontSize="xl">
                                  {p.price} LYD
                                </Text>
                              </VStack>
                              <Button
                                leftIcon={<FiShoppingBag />}
                                bg={colors.accent}
                                color="white"
                                isLoading={addingToCart[p.id]}
                                _hover={{ bg: colors.primary }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(p);
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

          {/* Overlays */}
          <CartDrawer isOpen={isCartOpen} onClose={onCloseCart} shopData={shopData} />

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

          {/* Mobile Filter Drawer */}
          <Drawer isOpen={isFilterOpen} placement="right" onClose={onCloseFilter}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Filters</DrawerHeader>
              <DrawerBody>
                {/* Mobile-friendly filter UI if needed */}
                <VStack align="stretch" spacing={4}>
                  {/* Category, Price Range, etc. */}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Layout>
    </>
  );
}