import { useRouter } from 'next/router';
import { useColorMode } from '@chakra-ui/react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Badge,
  Heading,
  IconButton,
  Flex,
  Icon
} from '@chakra-ui/react';
import { Heart, Calendar, Clock, Fuel, GitFork } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  if (!vehicle?.attributes) return null;
  const v = vehicle.attributes;

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={isDark ? 'gray.800' : 'white'}
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
      transition="all 0.3s"
    >
      <Box position="relative" h="240px">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${v.mainImage?.data?.attributes?.url}`}
          alt={`${v.make} ${v.model}`}
          objectFit="cover"
          w="full"
          h="full"
          fallback={<Box w="full" h="full" bg="gray.200" />}
        />
        <HStack position="absolute" top={4} right={4} spacing={2}>
          <IconButton
            icon={<Heart size={20} />}
            rounded="full"
            size="sm"
            colorScheme="red"
            variant="solid"
            bg="white"
            color="gray.700"
            _hover={{ bg: 'red.50' }}
            aria-label="Add to favorites"
          />
        </HStack>
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme={v.dealRating === 'excellent' ? 'green' : 
                      v.dealRating === 'good' ? 'blue' : 'yellow'}
          fontSize="sm"
          textTransform="capitalize"
          px={3}
          py={1}
          rounded="full"
        >
          {v.dealRating} deal
        </Badge>
      </Box>

      <VStack p={6} align="stretch" spacing={4}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="md" noOfLines={1}>{v.make} {v.model}</Heading>
            <Text color="gray.500" fontSize="sm">
              {v.year} • {v.bodyType}
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              {new Intl.NumberFormat('en-US').format(v.price)} LYD
            </Text>
            {v.marketPrice > v.price && (
              <Text fontSize="sm" color="green.500">
                Save {new Intl.NumberFormat('en-US').format(v.marketPrice - v.price)} LYD
              </Text>
            )}
          </VStack>
        </Flex>

        <SimpleGrid columns={2} spacing={4}>
          <HStack>
            <Icon as={Clock} color="gray.500" />
            <Text fontSize="sm">{v.mileage?.toLocaleString()} km</Text>
          </HStack>
          <HStack>
            <Icon as={GitFork} color="gray.500" />
            <Text fontSize="sm">{v.transmission}</Text>
          </HStack>
          <HStack>
            <Icon as={Fuel} color="gray.500" />
            <Text fontSize="sm">{v.fuelType}</Text>
          </HStack>
          <HStack>
            <Icon as={Calendar} color="gray.500" />
            <Text fontSize="sm">{v.year}</Text>
          </HStack>
        </SimpleGrid>

        <Button
          colorScheme="blue"
          onClick={() => router.push(`/auto/${vehicle.id}`)}
          w="full"
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

export default VehicleCard;