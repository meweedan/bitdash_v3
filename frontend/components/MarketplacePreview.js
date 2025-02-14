import React, { useState, useEffect } from 'react';
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
import { 
  ShoppingBag, 
  Heart,
  Star
} from 'lucide-react';

const MarketplacePreview = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Fetch featured shop items
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items?` +
        `populate[images]=*` +
        `&populate[owner][populate][logo]=*` +
        `&populate[reviews]=*` +
        `&filters[status][$eq]=available` +
        `&pagination[limit]=4` +
        `&sort[0]=rating:desc`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch items');
      return response.json();
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
            Featured Products
          </Text>
          <Badge colorScheme="blue" variant="subtle">
            Live Preview
          </Badge>
        </HStack>

        {isLoading 
          ? [1, 2, 3, 4].map((_, index) => (
              <HStack
                key={index}
                w="full"
                bg={isDark ? 'gray.700' : 'gray.50'}
                p={4}
                borderRadius="xl"
                spacing={4}
              >
                <Skeleton 
                  w="100px" 
                  h="100px" 
                  borderRadius="md" 
                />
                <VStack align="start" flex={1} spacing={2}>
                  <SkeletonText noOfLines={2} spacing={2} w="full" />
                  <Skeleton height="20px" w="100px" />
                </VStack>
              </HStack>
            ))
          : itemsData?.data?.map((item) => (
              <HStack
                key={item.id}
                w="full"
                bg={isDark ? 'gray.700' : 'gray.50'}
                p={4}
                borderRadius="xl"
                spacing={4}
                position="relative"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s"
              >
                {/* Product Image */}
                <Box 
                  w="100px" 
                  h="100px" 
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={item.attributes.images?.data?.[0]?.attributes?.url
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.images.data[0].attributes.url}`
                      : '/placeholder-product.jpg'
                    }
                    alt={item.attributes.name}
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                  {item.attributes.stock <= 10 && (
                    <Badge
                      position="absolute"
                      top={1}
                      left={1}
                      colorScheme="red"
                      fontSize="xs"
                    >
                      Low Stock
                    </Badge>
                  )}
                </Box>

                {/* Product Details */}
                <VStack align="start" flex={1} spacing={2}>
                  <HStack w="full" justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text 
                        fontWeight="bold" 
                        color={isDark ? 'white' : 'black'}
                        fontSize="md"
                      >
                        {item.attributes.name}
                      </Text>
                      <HStack spacing={2}>
                        <Avatar
                          size="xs"
                          src={item.attributes.owner?.data?.attributes?.logo?.data?.attributes?.url
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.owner.data.attributes.logo.data.attributes.url}`
                            : '/default-shop-logo.jpg'
                          }
                        />
                        <Text fontSize="sm" color="gray.500">
                          {item.attributes.owner?.data?.attributes?.shopName}
                        </Text>
                        {item.attributes.owner?.data?.attributes?.verificationStatus === 'verified' && (
                          <Badge colorScheme="green" variant="subtle" fontSize="xs">
                            Verified
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                    <Icon 
                      as={Heart} 
                      color="gray.400"
                      _hover={{ color: 'red.500' }}
                      cursor="pointer"
                    />
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <HStack spacing={4}>
                      <Text 
                        fontWeight="bold" 
                        color="blue.500"
                        fontSize="lg"
                      >
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
                    <Button
                      size="sm"
                      leftIcon={<Icon as={ShoppingBag} />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      View
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            ))}
      </VStack>
    </Box>
  );
};

export default MarketplacePreview;