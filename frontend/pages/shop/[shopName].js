// pages/shop/[shopName].js
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
  useColorModeValue,
  Flex,
  Icon,
  Card,
  CardBody,
  Spinner,
  Select,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FiStar, FiShoppingBag } from 'react-icons/fi';
import Head from 'next/head';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

// Available themes
const themes = {
  default: {
    coverHeight: "315px",
    logoSize: "160px",
    colors: {
      primary: "blue.500",
      secondary: "gray.100",
      text: "gray.800"
    }
  },
  minimal: {
    coverHeight: "200px",
    logoSize: "120px",
    colors: {
      primary: "black",
      secondary: "white",
      text: "black"
    }
  },
  modern: {
    coverHeight: "400px",
    logoSize: "180px",
    colors: {
      primary: "purple.500",
      secondary: "gray.50",
      text: "gray.900"
    }
  }
};

const ShopPage = () => {
  const router = useRouter();
  const { shopName } = router.query;

  // Fetch shop data
  const { data: shopData, isLoading } = useQuery({
    queryKey: ['shop', shopName],
    queryFn: async () => {
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

  if (isLoading) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!shopData?.data?.[0]) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Text>Shop not found</Text>
      </Flex>
    );
  }

const shop = shopData.data[0].attributes;
  const theme = shop.theme;

  // Apply custom theme
  const styles = {
    ...(theme.customCss && { customStyles: theme.customCss }),
    colors: theme.colors,
    layout: theme.layout
  };


   return (
    <>
      <Head>
        <title>{shop.shopName}</title>
        {theme.customCss && (
          <style>{theme.customCss}</style>
        )}
      </Head>

      <Box>
        {/* Cover and Logo Section */}
        <Box 
          bgColor={theme.colors.secondary}
          position="relative"
          h={theme.layout === 'minimal' ? '200px' : '315px'}
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
              boxSize={theme.logoSize}
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
                  {shop.description}
                </Text>
                <HStack spacing={4}>
                  <Badge colorScheme="green">
                    {shop.verificationStatus}
                  </Badge>
                  {/* Location */}
                    {theme.showLocation && shop.location.showOnPublicPage && (
                      <Box mt={8}>
                        <Heading size="md" mb={4}>Location</Heading>
                        <Text>{shop.location.address}</Text>
                        <Text>{shop.location.city}</Text>
                      </Box>
                    )}
                  <HStack color="yellow.500">
                    <Icon as={FiStar} />
                    <Text>{shop.rating?.toFixed(1) || '0.0'}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </Flex>

            {/* Products Grid/List */}
          {theme.layout === 'grid' ? (
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
              {/* Product cards */}
            </SimpleGrid>
          ) : (
            <VStack spacing={4}>
              {shop.shop_items?.data?.map((product) => (
                <Card 
                  key={product.id}
                  overflow="hidden"
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-4px)' }}
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
                      <Text color="gray.600">
                        {product.attributes.description}
                      </Text>
                      <Text 
                        color={theme.colors.primary} 
                        fontWeight="bold" 
                        fontSize="xl"
                      >
                        {product.attributes.price} LYD
                      </Text>
                      <Button
                        leftIcon={<FiShoppingBag />}
                        colorScheme="blue"
                        w="full"
                        isDisabled={product.attributes.stock <= 0}
                      >
                        {product.attributes.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default ShopPage;