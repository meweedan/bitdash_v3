import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Image, 
  Heading, 
  Spinner, 
  useToast,
  Flex,
  Badge
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';

const RestaurantBrowsePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/api/restaurants?populate=*`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        setRestaurants(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchRestaurants();
  }, []);

  const handleOrderClick = (restaurantId) => {
    router.push(`/${restaurantId}`);
  };

  if (isLoading) {
    return (
      <Flex 
        height="100vh" 
        width="full" 
        justifyContent="center" 
        alignItems="center"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex 
        height="100vh" 
        width="full" 
        justifyContent="center" 
        alignItems="center"
        flexDirection="column"
      >
        <Text color="red.500" fontSize="xl">
          {error}
        </Text>
        <Button mt={4} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Flex>
    );
  }

  return (
    <Box p={4} maxWidth="1200px" mx="auto">
      <Heading mb={6} textAlign="center">
        Restaurants Near You
      </Heading>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
      >
        {restaurants.map((restaurant) => (
          <SwiperSlide key={restaurant.id}>
            <Box 
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              textAlign="center"
              transition="all 0.3s"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg'
              }}
            >
              <Box 
                height="250px" 
                width="full" 
                position="relative"
              >
                <Image
                  src={
                    restaurant.attributes.logo?.data?.attributes?.url 
                      ? `${BASE_URL}${restaurant.attributes.logo.data.attributes.url}` 
                      : '/default-restaurant.png'
                  }
                  alt={restaurant.attributes.name}
                  objectFit="cover"
                  width="full"
                  height="full"
                />
                {restaurant.attributes.subscription?.data?.attributes?.tier && (
                  <Badge 
                    position="absolute" 
                    top={2} 
                    right={2} 
                    colorScheme="green"
                  >
                    {restaurant.attributes.subscription.data.attributes.tier}
                  </Badge>
                )}
              </Box>
              
              <VStack p={4} spacing={3}>
                <Heading size="md">
                  {restaurant.attributes.name}
                </Heading>
                
                <Text 
                  color="gray.500" 
                  noOfLines={2}
                  textAlign="center"
                >
                  {restaurant.attributes.description || 'No description available'}
                </Text>
                
                <Button
                  colorScheme="blue"
                  onClick={() => handleOrderClick(restaurant.id)}
                  width="full"
                >
                  Order Now
                </Button>
              </VStack>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default RestaurantBrowsePage;