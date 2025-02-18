// components/MarketplacePreview.js
import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Badge, 
  Icon, 
  useColorMode,
  Skeleton,
  SkeletonText,
  Image,
  Avatar,
  Button
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { 
  ShoppingBag, 
  Heart,
  Star
} from 'lucide-react';

const MarketplacePreview = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const isDark = colorMode === 'dark';

  // Fetch shop items and owner stores with correct API response handling
  const { data, isLoading, error } = useQuery({
    queryKey: ['shopItems'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?populate=images,owner,owner.logo,reviews&filters[status][$eq]=available&pagination[limit]=4&sort[0]=rating:desc`,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch shop items');
      const result = await response.json();
      return result?.data ?? [];
    }
  });

  return (
    <Box 
      w="full" 
      h="full" 
      bg={isDark ? 'gray.800' : 'white'}
      borderRadius="2xl"
      p={6}
      overflow="hidden"
      boxShadow="xl"
      border="1px solid"
      borderColor={isDark ? 'gray.700' : 'gray.100'}
    >
      <VStack spacing={6} w="full">
        <HStack w="full" justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            {t('featured_products')}
          </Text>
          <Badge colorScheme="blue" variant="subtle">
            {t('live_preview')}
          </Badge>
        </HStack>

        {isLoading ? (
          [1, 2, 3, 4].map((_, index) => (
            <HStack key={index} w="full" bg={isDark ? 'gray.700' : 'gray.50'} p={4} borderRadius="xl" spacing={4}>
              <Skeleton w="100px" h="100px" borderRadius="md" />
              <VStack align="start" flex={1} spacing={2}>
                <SkeletonText noOfLines={2} spacing={2} w="full" />
                <Skeleton height="20px" w="100px" />
              </VStack>
            </HStack>
          ))
        ) : error ? (
          <Text color="red.500">{t('failed_to_load_products')}</Text>
        ) : data.length === 0 ? (
          <Text>{t('no_products_available')}</Text>
        ) : (
          data.map((item) => (
            <HStack
              key={item.id}
              w="full"
              bg={isDark ? 'gray.700' : 'gray.50'}
              p={4}
              borderRadius="xl"
              spacing={4}
              position="relative"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Box w="100px" h="100px" borderRadius="md" overflow="hidden" position="relative">
                <Image
                  src={item.attributes.images?.data?.[0]?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.images.data[0].attributes.url}`
                    : '/placeholder-product.jpg'}
                  alt={item.attributes.name}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </Box>
              <VStack align="start" flex={1} spacing={2}>
                <HStack w="full" justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={isDark ? 'white' : 'black'} fontSize="md">
                      {item.attributes.name}
                    </Text>
                    <HStack spacing={2}>
                      <Avatar
                        size="xs"
                        src={item.attributes.owner?.data?.attributes?.logo?.data?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.owner.data.attributes.logo.data.attributes.url}`
                          : '/default-shop-logo.jpg'}
                      />
                      <Text fontSize="sm" color="gray.500">
                        {item.attributes.owner?.data?.attributes?.shopName}
                      </Text>
                    </HStack>
                  </VStack>
                  <Icon as={Heart} color="gray.400" _hover={{ color: 'red.500' }} cursor="pointer" />
                </HStack>

                <HStack justify="space-between" w="full">
                  <HStack spacing={4}>
                    <Text fontWeight="bold" color="blue.500" fontSize="lg">
                      {item.attributes.price} LYD
                    </Text>
                    {item.attributes.rating > 0 && (
                      <HStack spacing={1}>
                        <Icon as={Star} color="yellow.400" boxSize={4} />
                        <Text fontSize="sm" color="gray.500">
                          {item.attributes.rating.toFixed(1)}
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                  <Button size="sm" leftIcon={<Icon as={ShoppingBag} />} colorScheme="blue" variant="ghost">
                    {t('view')}
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default MarketplacePreview;