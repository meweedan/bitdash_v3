// components/pay/agent/LocationPicker.js
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Box,
  Button,
  Text,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { FiSearch, FiMapPin } from 'react-icons/fi';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 32.8872,  // Tripoli, Libya
  lng: 13.1913
};

const LocationPicker = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const toast = useToast();
  const geocoder = useRef(null);

  const onLoad = useCallback((map) => {
    setMap(map);
    geocoder.current = new window.google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    
    // Reverse geocode to get address
    geocoder.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const address = results[0].formatted_address;
            setSearchAddress(address);
            onLocationSelect({
              coordinates: { lat, lng },
              address: address
            });
          }
        }
      }
    );
  };

  const handleSearch = () => {
    if (!searchAddress) return;

    geocoder.current.geocode(
      { address: searchAddress },
      (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          const coordinates = { lat: lat(), lng: lng() };
          setMarker(coordinates);
          map.panTo(coordinates);
          map.setZoom(16);
          onLocationSelect({
            coordinates,
            address: results[0].formatted_address
          });
        } else {
          toast({
            title: 'Location not found',
            status: 'error',
            duration: 3000,
          });
        }
      }
    );
  };

  return (
    <VStack spacing={4} align="stretch">
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Search address or click on map"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleSearch}>
            <FiSearch />
          </Button>
        </InputRightElement>
      </InputGroup>

      <Box borderRadius="lg" overflow="hidden" borderWidth="1px">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={marker || defaultCenter}
            zoom={13}
            onClick={handleMapClick}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {marker && (
              <Marker
                position={marker}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 7,
                  fillColor: '#1a73e8',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff',
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </Box>

      {marker && (
        <Text fontSize="sm" color="gray.600">
          <FiMapPin style={{ display: 'inline', marginRight: '4px' }} />
          Selected location: {searchAddress}
        </Text>
      )}
    </VStack>
  );
};

export default LocationPicker;