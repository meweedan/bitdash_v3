// frontend/components/landing/LocationsPreview.js
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  IconButton,
  Button, 
  Stack,
  HStack,
  Badge,
  Skeleton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  List,
  ListItem,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import { 
  MapPin, 
  ArrowRight, 
  Search, 
  Filter, 
  Navigation, 
  ChevronRight 
} from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import Link from 'next/link';

const MapComponent = dynamic(() => import('@/components/common/MapComponent'), {
  ssr: false,
  loading: () => <Skeleton height="100%" width="100%" />
});

export const LocationsPreview = () => {
  const { locations } = useLocations();
  const [mapCenter, setMapCenter] = useState([32.8597, 13.1870]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Theme values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const searchBg = useColorModeValue('white', 'gray.700');

  return (
    <Box 
      h="100%" 
      w="100%" 
      position="relative"
    >
      <Box 
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={2}
        p={4}
      >
        <HStack 
          bg={searchBg} 
          p={2} 
          borderRadius="md"
          boxShadow="md"
        >
          <InputGroup size="md" flex={1}>
            <InputLeftElement>
              <Search size={16} color={useColorModeValue('gray.500', 'gray.400')} />
            </InputLeftElement>
            <Input
              placeholder="Search locations..."
              bg={cardBg}
              _placeholder={{ color: textColor }}
              isReadOnly
            />
          </InputGroup>
          <Link href="/cash/map">
            <Button 
              size="sm" 
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
            >
              View Full Map
            </Button>
          </Link>
        </HStack>
      </Box>

      <Box 
        h="100%" 
        w="100%"
        pt="80px" // Space for search bar
      >
        <MapComponent 
          locations={locations} 
          center={mapCenter}
        />
      </Box>

      <Box 
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        borderTopWidth={1}
        borderTopColor={borderColor}
      >
        <HStack justify="center" spacing={8}>
          <HStack>
            <Icon as={MapPin} color="blue.500" />
            <Text fontWeight="medium">
              {locations.filter(l => l.type === 'agent').length} Agents
            </Text>
          </HStack>
          <HStack>
            <Icon as={MapPin} color="gray.500" />
            <Text fontWeight="medium">
              {locations.filter(l => l.type === 'merchant').length} Merchants
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default LocationsPreview;