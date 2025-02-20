import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  Input,
  Spinner,
  useToast,
  Badge,
  HStack,
  Select
} from '@chakra-ui/react';

const MarketplacePreview = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/owners?populate=shop_items,logo,theme`);
        if (!response.ok) {
          throw new Error('Failed to fetch marketplace data');
        }
        const data = await response.json();
        setShops(data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load marketplace.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.attributes.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading textAlign="center" mb={6}>BitShop Marketplace</Heading>

      {/* Search & Filter Bar */}
      <HStack spacing={4} mb={6} justify="center">
        <Input
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
        />
        <Select placeholder="Filter by Category">
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Living</option>
        </Select>
      </HStack>

      {/* Shop Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredShops.map(shop => {
          const { attributes } = shop;
          const shopItems = attributes.shop_items?.data?.slice(0, 3) || [];
          const theme = attributes.theme?.colors || {
            primary: "#3182CE",
            secondary: "#F7FAFC",
            accent: "#48BB78",
            text: "#2D3748"
          };

          return (
            <Box
              key={shop.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              backgroundColor={theme.secondary}
              color={theme.text}
              _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
            >
              {attributes.logo?.data && (
                <Image
                  src={`${BASE_URL}${attributes.logo.data.attributes.url}`}
                  alt={attributes.shopName}
                  mb={4}
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h="150px"
                />
              )}
              <VStack align="stretch" spacing={3}>
                <Heading size="md" color={theme.primary}>{attributes.shopName}</Heading>
                <Text color="gray.600" noOfLines={2}>{attributes.description}</Text>

                {/* Preview of Products */}
                <SimpleGrid columns={3} spacing={2} mt={4}>
                  {shopItems.map(item => (
                    <Box key={item.id} textAlign="center">
                      {item.attributes.images?.data?.[0] && (
                        <Image
                          src={`${BASE_URL}${item.attributes.images.data[0].attributes.url}`}
                          alt={item.attributes.name}
                          borderRadius="md"
                          objectFit="cover"
                          w="60px"
                          h="60px"
                        />
                      )}
                      <Text fontSize="xs" noOfLines={1}>{item.attributes.name}</Text>
                      <Badge colorScheme="green">${item.attributes.price}</Badge>
                    </Box>
                  ))}
                </SimpleGrid>

                <Button colorScheme="blue" onClick={() => router.push(`/shop/${shop.id}`)}>
                  Visit Shop
                </Button>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default MarketplacePreview;
