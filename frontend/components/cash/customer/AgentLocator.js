import React, { useState, useEffect } from 'react';
import { 
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  HStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  List,
  ListItem,
  Button
} from '@chakra-ui/react';
import { Search, MapPin, Filter, Navigation, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLocations } from '@/hooks/useLocations';

const MapComponent = dynamic(() => import('@/components/common/MapComponent'), {
  ssr: false,
  loading: () => <Box h="full" />
});

export const AgentLocator = () => {
  const { locations, isLoading, userLocation } = useLocations();
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([32.8597, 13.1870]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    distance: 'all'
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const searchBg = useColorModeValue('white', 'gray.700');
  const listItemHoverBg = useColorModeValue('gray.50', 'gray.700');

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Apply filters to locations
  useEffect(() => {
    let filtered = [...locations];

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(location => ({
        ...location,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        )
      }));
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(searchLower) ||
        location.address.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(location => location.type === filters.type);
    }

    // Apply distance filter if user location is available
    if (userLocation && filters.distance !== 'all') {
      const maxDistance = parseInt(filters.distance);
      filtered = filtered.filter(location => location.distance <= maxDistance);
    }

    // Sort by distance if available
    if (userLocation) {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredLocations(filtered);
  }, [locations, filters, userLocation]);

  return (
    <Box position="relative" h="100%" w="100%">
      {/* Search Bar */}
      <Box 
        position="absolute" 
        bg={searchBg}
        top={{ base: 2, md: "4%" }} 
        left={{ base: 10, md: "10%" }} 
        right={{ base: 10, md: "10%" }}
        borderWidth="4px"
        borderColor={borderColor}
        borderRadius="8px"
        zIndex={2}
      >
        <Box
          p={2}
          boxShadow="lg"
          borderRadius="8px"
          bg={cardBg}
        >
          <HStack spacing={2}>
            <InputGroup size={{ base: "sm", md: "md" }}>
              <InputLeftElement>
                <Search size={16} color={useColorModeValue('gray.500', 'gray.400')} />
              </InputLeftElement>
              <Input
                placeholder="Search locations..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  search: e.target.value
                }))}
                bg={searchBg}
                _placeholder={{ color: textColor }}
              />
            </InputGroup>
            <IconButton
              size={{ base: "sm", md: "md" }}
              icon={<Filter size={16} />}
              onClick={onOpen}
              aria-label="Filter locations"
              bg={cardBg}
            />
            {userLocation && (
              <IconButton
                size={{ base: "sm", md: "md" }}
                icon={<Navigation size={16} />}
                onClick={() => setMapCenter([userLocation.latitude, userLocation.longitude])}
                aria-label="Go to my location"
                bg={cardBg}
              />
            )}
          </HStack>
        </Box>
      </Box>

      {/* Map Container */}
      <Box h="100%">
        <MapComponent 
          locations={filteredLocations}
          center={mapCenter}
          selectedLocation={selectedLocation}
          onMarkerClick={setSelectedLocation}
        />
      </Box>

      {/* Filter Drawer */}
      <Drawer 
        isOpen={isOpen} 
        placement={{ base: "bottom", md: "right" }}
        onClose={onClose}
        size={{ base: "full", md: "md" }}
      >
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={1} borderBottomColor={borderColor}>
            Filter Locations
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Location Type</Text>
                <Select
                  size={{ base: "sm", md: "md" }}
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                >
                  <option value="all">All Types</option>
                  <option value="agent">Agents</option>
                  <option value="merchant">Merchants</option>
                </Select>
              </Box>

              {userLocation && (
                <Box>
                  <Text mb={2} fontWeight="medium">Distance</Text>
                  <Select
                    size={{ base: "sm", md: "md" }}
                    value={filters.distance}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      distance: e.target.value
                    }))}
                  >
                    <option value="all">Any Distance</option>
                    <option value="1">Within 1 km</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                  </Select>
                </Box>
              )}

              <Button 
                colorScheme="blue"
                size={{ base: "sm", md: "md" }}
                onClick={onClose}
              >
                Apply Filters
              </Button>

              {/* Results List */}
              <Box mt={6}>
                <Text fontWeight="medium" mb={2} color={textColor}>
                  {locations.length} total locations
                </Text>
                <List spacing={2} maxHeight="400px" overflowY="auto">
                  {locations.map(location => (
                    <ListItem 
                      key={location.id}
                      p={3}
                      borderWidth={1}
                      borderColor={borderColor}
                      borderRadius="md"
                      cursor="pointer"
                      bg={cardBg}
                      _hover={{ bg: listItemHoverBg }}
                      onClick={() => {
                        setSelectedLocation(location);
                        onClose();
                      }}
                    >
                      <HStack justify="space-between">
                        <Box>
                          <HStack mb={1}>
                            <Text fontWeight="medium">{location.name}</Text>
                            <Badge 
                              colorScheme={location.type === 'agent' ? 'blue' : 'gray'}
                              variant="subtle"
                            >
                              {location.type}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" noOfLines={1}>
                            {location.address}
                          </Text>
                          {location.distance && (
                            <Text fontSize="xs" mt={1}>
                              {location.distance.toFixed(1)} km away
                            </Text>
                          )}
                        </Box>
                        <ChevronRight size={16} />
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Selected Location Card */}
      {selectedLocation && (
        <Box
          position="absolute"
          bottom={{ base: 2, md: 4 }}
          left={{ base: 2, md: 4 }}
          right={{ base: 2, md: 4 }}
          p={{ base: 3, md: 4 }}
          borderRadius="lg"
          bg={cardBg}
          borderColor={borderColor}
          borderWidth={1}
          boxShadow="lg"
          zIndex={2}
          maxW={{ base: "100%", md: "400px" }}
        >
          <Stack spacing={2}>
            <HStack justify="space-between" align="start">
              <Box>
                <HStack mb={1}>
                  <Text 
                    fontSize={{ base: "md", md: "lg" }} 
                    fontWeight="bold" 
                    color={textColor}
                  >
                    {selectedLocation.name}
                  </Text>
                  <Badge 
                    colorScheme={selectedLocation.type === 'agent' ? 'blue' : 'gray'}
                    variant="subtle"
                  >
                    {selectedLocation.type}
                  </Badge>
                </HStack>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  color={textColor}
                >
                  {selectedLocation.address}
                </Text>
              </Box>
            </HStack>
            
            <HStack justify="space-between" align="center">
              {selectedLocation.distance && (
                <Text fontSize="sm" color={textColor}>
                  {selectedLocation.distance.toFixed(1)} km away
                </Text>
              )}
              <Button
                as="a"
                href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`}
                target="_blank"
                size={{ base: "sm", md: "md" }}
                leftIcon={<MapPin size={16} />}
                colorScheme="blue"
              >
                Open in Maps
              </Button>
            </HStack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AgentLocator;