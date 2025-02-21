// pages/shop/[shopName]/index.js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
  Badge,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  IconButton,
  Card,
  CardBody,
  Divider
} from '@chakra-ui/react';
import { Search, ShoppingBag, Heart, Star, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';

const ShopItem = ({ item, shopName }) => {
  const router = useRouter();
  const imageUrl = item.images?.[0]?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.images[0].url}` 
    : '/placeholder-product.jpg';

  return (
    <Card overflow="hidden">
      <CardBody p={0}>
        <Box position="relative" h="260px">
          <Image
            src={imageUrl}
            alt={item.name}
            objectFit="cover"
            w="full"
            h="full"
          />
          <IconButton
            aria-label="Add to favorites"
            icon={<Heart />}
            position="absolute"
            top={4}
            right={4}
            rounded="full"
            variant="solid"
            bg="white"
          />
        </Box>

        <VStack p={4} spacing={3} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" noOfLines={1}>{item.name}</Heading>
            <Badge colorScheme={item.status === 'available' ? 'green' : 'red'}>
              {item.status === 'available' ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </HStack>

          <Text noOfLines={2} color="gray.600">{item.description}</Text>

          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="xl" color="blue.500">
              {item.price} LYD
            </Text>
            <HStack>
              <Star size={16} fill="#F6E05E" />
              <Text>{item.rating?.toFixed(1) || '0.0'}</Text>
            </HStack>
          </HStack>

          <Button
            colorScheme="blue"
            leftIcon={<ShoppingBag size={18} />}
            onClick={() => router.push(`/shop/${shopName}/${item.name}`)}
            isDisabled={item.status !== 'available'}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default function ShopHomepage() {
  const router = useRouter();
  const { shopName } = router.query;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');

  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate[shop_items][populate]=images` +
        `&populate[logo]=*` +
        `&populate[coverImage]=*` +
        `&filters[shopName][$eq]=${shopName}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch shop data');
      }

      const data = await response.json();
      if (!data.data?.results?.[0]) {
        throw new Error('Shop not found');
      }

      return data.data.results[0];
    },
    enabled: !!shopName
  });

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <VStack spacing={6}>
            <Skeleton height="300px" w="full" />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              <Skeleton height="400px" />
              <Skeleton height="400px" />
              <Skeleton height="400px" />
            </SimpleGrid>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (error || !shopData) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            {error?.message || 'Shop not found'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const shopItems = shopData.shop_items || [];
  const filteredItems = shopItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(shopItems.map(item => item.category))];
  const coverImageUrl = shopData.coverImage?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shopData.coverImage.url}`
    : null;
  const logoUrl = shopData.logo?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shopData.logo.url}`
    : null;

  return (
    <Layout>
      <Head>
        <title>{shopData.shopName} - Shop</title>
        <meta name="description" content={shopData.description} />
      </Head>

      <Box>
        {/* Cover Image */}
        <Box position="relative" h="300px">
          <Image
            src={coverImageUrl || '/default-cover.jpg'}
            alt={shopData.shopName}
            objectFit="cover"
            w="full"
            h="full"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="blackAlpha.600"
            p={6}
            color="white"
          >
            <Container maxW="7xl">
              <HStack spacing={6}>
                <Avatar size="xl" src={logoUrl} name={shopData.shopName} />
                <VStack align="start" spacing={1}>
                  <Heading size="lg">{shopData.shopName}</Heading>
                  <Badge colorScheme={shopData.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                    {shopData.verificationStatus.toUpperCase()}
                  </Badge>
                </VStack>
              </HStack>
            </Container>
          </Box>
        </Box>

        <Container maxW="7xl" py={8}>
          <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={8}>
            {/* Sidebar */}
            <VStack align="stretch" spacing={6}>
              {/* Shop Info */}
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">About the Shop</Text>
                  <Text>{shopData.description}</Text>
                  
                  <Divider />
                  
                  {shopData.location?.address && (
                    <HStack>
                      <MapPin size={18} />
                      <Text>{shopData.location.address}</Text>
                    </HStack>
                  )}

                  {/* Social Links */}
                  {Object.entries(shopData.social_links || {}).map(([platform, link]) => {
                    if (!link) return null;
                    return (
                      <Button
                        key={platform}
                        as="a"
                        href={link}
                        target="_blank"
                        leftIcon={platform === 'website' ? <Globe /> : null}
                        variant="outline"
                        size="sm"
                        justifyContent="start"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    );
                  })}
                </VStack>
              </Box>

              {/* Categories */}
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" mb={4}>Categories</Text>
                <VStack align="stretch">
                  <Button
                    variant={selectedCategory === '' ? 'solid' : 'ghost'}
                    onClick={() => setSelectedCategory('')}
                    justifyContent="start"
                  >
                    All Categories
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'solid' : 'ghost'}
                      onClick={() => setSelectedCategory(cat)}
                      justifyContent="start"
                    >
                      {cat}
                    </Button>
                  ))}
                </VStack>
              </Box>
            </VStack>

            {/* Products Grid */}
            <Box gridColumn={{ lg: 'span 3' }}>
              {/* Search Bar */}
              <HStack mb={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search size={18} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </HStack>

              {/* Products */}
              {filteredItems.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No products found
                </Alert>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredItems.map((item) => (
                    <ShopItem key={item.id} item={item} shopName={shopName} />
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Layout>
  );
}