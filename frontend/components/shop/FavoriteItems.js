// components/shop/FavoriteItems.js
import React from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Button,
  VStack,
  IconButton,
  Skeleton,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Heading,
  Badge
} from '@chakra-ui/react';
import { FiHeart, FiShoppingCart, FiImage } from 'react-icons/fi';
import { useRouter } from 'next/router';

const FavoriteItems = ({ items = [], isLoading, onRemoveFromFavorites, onAddToCart }) => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} height="400px" borderRadius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      {items.map((item) => (
        <Card
          key={item.id}
          bg={cardBg}
          overflow="hidden"
          transition="transform 0.2s"
          _hover={{ transform: 'translateY(-4px)' }}
        >
          <CardBody p={0}>
            <Box position="relative">
              <Box
                h="200px"
                bg="gray.100"
                overflow="hidden"
              >
                {item.attributes.images?.data?.[0]?.attributes?.url ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.images.data[0].attributes.url}`}
                    alt={item.attributes.name}
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                ) : (
                  <Box
                    w="full"
                    h="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FiImage size={40} color="gray.400" />
                  </Box>
                )}
                <IconButton
                  icon={<FiHeart fill="currentColor" />}
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromFavorites?.(item.id);
                    toast({
                      title: "Removed from favorites",
                      status: "success",
                      duration: 2000
                    });
                  }}
                />
              </Box>
              
              <VStack spacing={3} p={4} align="stretch">
                <VStack align="start" spacing={1}>
                  <Heading size="md">{item.attributes.name}</Heading>
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">
                    {item.attributes.price} LYD
                  </Text>
                </VStack>

                {item.attributes.stock <= 0 ? (
                  <Badge colorScheme="red">Out of Stock</Badge>
                ) : (
                  <Badge colorScheme="green">In Stock</Badge>
                )}

                <Button
                  leftIcon={<FiShoppingCart />}
                  colorScheme="blue"
                  isDisabled={item.attributes.stock <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(item.id);
                    toast({
                      title: "Added to cart",
                      status: "success",
                      duration: 2000
                    });
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push(`/products/${item.id}`)}
                >
                  View Details
                </Button>
              </VStack>
            </Box>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default FavoriteItems;