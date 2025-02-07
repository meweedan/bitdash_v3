import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';

const RestaurantSliderSection = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/restaurants?populate=*`);
        const data = await response.json();
        setRestaurants(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box py={12} px={4}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" size="xl">
          Restaurants Near You
        </Heading>
        
        {!isLoading && (
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
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="md"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'xl'
                  }}
                >
                  <Box position="relative" height="250px">
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
                  
                  <VStack p={4} align="stretch" spacing={2}>
                    <Heading size="md" noOfLines={1}>
                      {restaurant.attributes.name}
                    </Heading>
                    <Text 
                      color="gray.500" 
                      fontSize="sm" 
                      noOfLines={2}
                    >
                      {restaurant.attributes.description || 'No description available'}
                    </Text>
                  </VStack>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </VStack>
    </Box>
  );
};

export default RestaurantSliderSection;