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
  SkeletonText
} from '@chakra-ui/react';
import { 
  ShoppingCart, 
  Heart, 
  Headphones, 
  Watch, 
  Smartphone, 
  Laptop, 
  Book, 
  Camera, 
  Mic 
} from 'lucide-react';

// Fallback icons
const fallbackIcons = [
  Headphones,
  Watch,
  Smartphone,
  Laptop,
  Book,
  Camera,
  Mic
];

// Fallback product names
const fallbackNames = [
  'Pro Wireless Earbuds',
  'Smart Fitness Tracker',
  'Noise Cancelling Headphones',
  'Ultrabook Laptop',
  'Portable Bluetooth Speaker',
  'Professional Camera',
  'Gaming Microphone',
  'Ergonomic Mouse',
  'Mechanical Keyboard',
  'Tablet Pro'
];

const MarketplacePreview = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shop-items`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch shop items');
        }
        
        const data = await response.json();
        setItems(data.slice(0, 3));
        setIsLoading(false);
      } catch (err) {
        console.warn('Error fetching shop items, using fallback:', err);
        
        // Generate fallback items
        const fallbackItems = [1, 2, 3].map(() => ({
          name: fallbackNames[Math.floor(Math.random() * fallbackNames.length)],
          price: Number((Math.random() * 200 + 50).toFixed(2)),
          category: ['Electronics', 'Gadgets', 'Accessories'][Math.floor(Math.random() * 3)],
          icon: fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)]
        }));

        setItems(fallbackItems);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <Box 
      w="full" 
      h="full" 
      bg={isDark ? 'gray.800' : 'white'}
      borderRadius="2xl"
      p={4}
      overflow="hidden"
    >
      <VStack spacing={4} w="full">
        {isLoading 
          ? [1, 2, 3].map((_, index) => (
              <HStack
                key={index}
                w="full"
                bg={isDark ? 'gray.700' : 'gray.100'}
                p={3}
                borderRadius="xl"
                spacing={4}
              >
                <Skeleton 
                  w="80px" 
                  h="80px" 
                  borderRadius="md" 
                />
                <VStack align="start" flex={1} spacing={2}>
                  <SkeletonText noOfLines={2} spacing={2} w="full" />
                </VStack>
              </HStack>
            ))
          : items.map((item, index) => (
              <HStack
                key={index}
                w="full"
                bg={isDark ? 'gray.700' : 'gray.100'}
                p={3}
                borderRadius="xl"
                spacing={4}
                position="relative"
              >
                {/* Wishlist Icon */}
                <Box 
                  position="absolute" 
                  top={2} 
                  right={2} 
                  color={isDark ? 'gray.400' : 'gray.500'}
                  _hover={{ color: 'red.500' }}
                >
                  <Icon as={Heart} />
                </Box>

                {/* Product Icon */}
                <Box 
                  w="80px" 
                  h="80px" 
                  bg={isDark ? 'gray.600' : 'gray.200'} 
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon 
                    as={item.icon || fallbackIcons[index]} 
                    boxSize={10} 
                    color={isDark ? 'white' : 'gray.700'} 
                  />
                </Box>

                {/* Product Details */}
                <VStack align="start" flex={1} spacing={2}>
                  <Text 
                    fontWeight="bold" 
                    color={isDark ? 'white' : 'black'}
                  >
                    {item.name}
                  </Text>
                  <HStack>
                    <Text 
                      fontWeight="bold" 
                      color="brand.bitshop.500"
                    >
                      ${item.price.toFixed(2)}
                    </Text>
                    <Badge 
                      colorScheme={isDark ? 'green' : 'brand.bitshop'}
                    >
                      {item.category}
                    </Badge>
                  </HStack>
                </VStack>

                {/* Add to Cart */}
                <Box 
                  bg={isDark ? 'gray.600' : 'brand.bitshop.100'} 
                  p={2} 
                  borderRadius="full"
                  color={isDark ? 'white' : 'brand.bitshop.500'}
                >
                  <Icon as={ShoppingCart} />
                </Box>
              </HStack>
            ))}
      </VStack>
    </Box>
  );
};

export default MarketplacePreview;