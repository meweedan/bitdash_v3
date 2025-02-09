import { useState } from 'react';
import { 
  Input, 
  Box, 
  VStack, 
  Text, 
  Button, 
  Spinner, 
  useToast,
  HStack,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  Grid, 
  Image, 
  Center, 
  IconButton, 
  Heading, 
  Avatar,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FiSearch, FiInfo, FiClock, FiMenu } from 'react-icons/fi';

const RestaurantLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation('common');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/restaurants?filters[name][$containsi]=${searchTerm}`
      );
      
      if (!res.ok) {
        throw new Error(t('failedToFetchRestaurants'));
      }

      const data = await res.json();
      console.log('Found restaurants:', data);
      setRestaurants(data.data || []);

      if (data.data.length === 0) {
        toast({
          title: t('noResults'),
          description: t('noRestaurantsFound'),
          status: 'info',
          duration: 3000,
        });
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: t('error'),
        description: err.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

const handleOrderClick = (restaurantId) => {
  router.push(`/food/${restaurantId}`);
};

  return (
    <VStack spacing={8} align="stretch" maxWidth="1000%" mx="auto" p={10} backdropFilter="blur(20px)">
      {/* Search Section */}
      <Box>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t('ourpartners')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="filled"
            _focus={{
              borderColor: 'blue.500',
              bg: 'white'
            }}
          />
        </InputGroup>
        <Button 
          colorScheme="blue" 
          onClick={handleSearch}
          isLoading={loading}
          mt={4}
          width="full"
          leftIcon={<FiSearch />}
        >
          {t('search')}
        </Button>
      </Box>

      {error && (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      )}

      {/* Results Section */}
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        restaurants.length > 0 && (
          <VStack spacing={4} align="stretch">
            {restaurants.map((restaurant) => (
              <Box
                key={restaurant.id}
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ 
                  boxShadow: 'md',
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.2s"
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
              >
                <Grid templateColumns="auto 1fr auto" gap={6} alignItems="center">
                  {/* Logo Section */}
                  <Box 
                    width="100px" 
                    height="100px" 
                    borderRadius="md" 
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Image
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      src={restaurant.logo ? `${BASE_URL}${restaurant.logo.url}` : undefined}
                      fallback={
                        <Center w="100%" h="100%" bg="gray.100">
                          <Text fontSize="2xl" fontWeight="bold" color="gray.400">
                            {restaurant.name?.[0]}
                          </Text>
                        </Center>
                      }
                    />
                  </Box>

                  {/* Info Section */}
                  <VStack align="start" spacing={3} width="100%">
                    <Heading size="md">{restaurant.name}</Heading>
                    
                    {restaurant.description && (
                      <Box>
                        <HStack align="start" spacing={2}>
                          <Icon as={FiInfo} mt={1} color="gray.500" />
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {restaurant.description}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </VStack>

                  {/* Action Button */}
                  <IconButton
                    aria-label="View menu"
                    icon={<FiMenu />}
                    onClick={() => handleOrderClick(restaurant.id)}
                    variant="ghost"
                    colorScheme="blue"
                    size="lg"
                    _hover={{
                      transform: 'scale(1.1)',
                      bg: 'blue.50'
                    }}
                  />
                </Grid>
              </Box>
            ))}
          </VStack>
        )
      )}

      {/* No Results Message */}
      {!loading && restaurants.length === 0 && searchTerm && (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            {t('noRestaurantsFound')}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default RestaurantLookup;