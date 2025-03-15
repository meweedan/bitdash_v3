import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Box, 
  Button, 
  HStack,
  Text, 
  Icon,
  useColorModeValue,
  Badge,
  Flex
} from '@chakra-ui/react';
import { MapPin, Navigation, Layers, Map } from 'lucide-react';

const HotspotMap = ({ 
  captainLocation, 
  restaurants = [], 
  hotspots = [], 
  activeOrder = null,
  onLocationUpdate 
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
          paint: {
            'raster-opacity': 0.8
          }
        }],
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
      },
      center: [captainLocation?.lng || 32.8597, captainLocation?.lat || 13.1870],
      zoom: 14
    });

    const map = mapInstance.current;

    map.on('load', () => {
      // Add heatmap source
      map.addSource('orders', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: hotspots.map(hotspot => ({
            type: 'Feature',
            properties: {
              orderCount: hotspot.orderCount
            },
            geometry: {
              type: 'Point',
              coordinates: [hotspot.lng, hotspot.lat]
            }
          }))
        }
      });

      // Add restaurant clusters source
      map.addSource('restaurants', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: restaurants.map(restaurant => ({
            type: 'Feature',
            properties: {
              name: restaurant.name,
              address: restaurant.location?.address
            },
            geometry: {
              type: 'Point',
              coordinates: [restaurant.location?.lng, restaurant.location?.lat]
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add heatmap layer
      map.addLayer({
        id: 'orders-heat',
        type: 'heatmap',
        source: 'orders',
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'orderCount'],
            0, 0,
            10, 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          'heatmap-opacity': 0.8
        }
      });

      // Add cluster layers
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'restaurants',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#51bbd6',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100, 30,
            750, 40
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'restaurants',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
          'text-font': ['Open Sans Regular']
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'restaurants',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#38A169',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Add navigation control
      map.addControl(new maplibregl.NavigationControl());
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);  // Only run on mount

  // Update sources when data changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    map.once('load', () => {
      const orderSource = map.getSource('orders');
      if (orderSource) {
        orderSource.setData({
          type: 'FeatureCollection',
          features: hotspots.map(hotspot => ({
            type: 'Feature',
            properties: {
              orderCount: hotspot.orderCount
            },
            geometry: {
              type: 'Point',
              coordinates: [hotspot.lng, hotspot.lat]
            }
          }))
        });
      }

      const restaurantSource = map.getSource('restaurants');
      if (restaurantSource) {
        restaurantSource.setData({
          type: 'FeatureCollection',
          features: restaurants.map(restaurant => ({
            type: 'Feature',
            properties: {
              name: restaurant.name,
              address: restaurant.location?.address
            },
            geometry: {
              type: 'Point',
              coordinates: [restaurant.location?.lng, restaurant.location?.lat]
            }
          }))
        });
      }
    });
  }, [hotspots, restaurants]);

  // Update markers when active order changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(marker => marker.remove());

    // Add captain marker
    if (captainLocation) {
      new maplibregl.Marker({ color: '#3182CE' })
        .setLngLat([captainLocation.lng, captainLocation.lat])
        .setPopup(new maplibregl.Popup().setHTML('Your location'))
        .addTo(map);
    }

    // Add active order markers
    if (activeOrder) {
      if (activeOrder.restaurant?.location) {
        new maplibregl.Marker({ color: '#E53E3E' })
          .setLngLat([
            activeOrder.restaurant.location.lng,
            activeOrder.restaurant.location.lat
          ])
          .setPopup(new maplibregl.Popup().setHTML(
            `<h3>Pickup: ${activeOrder.restaurant.name}</h3>`
          ))
          .addTo(map);
      }

      if (activeOrder.customer_profile?.location) {
        new maplibregl.Marker({ color: '#805AD5' })
          .setLngLat([
            activeOrder.customer_profile.location.lng,
            activeOrder.customer_profile.location.lat
          ])
          .setPopup(new maplibregl.Popup().setHTML(
            `<h3>Delivery: ${activeOrder.customer_profile.fullName}</h3>`
          ))
          .addTo(map);
      }
    }
  }, [activeOrder, captainLocation]);

  // Watch captain's location
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onLocationUpdate?.(newLocation);

        // Update captain marker position
        const map = mapInstance.current;
        if (map) {
          const existingMarkers = document.getElementsByClassName('captain-marker');
          Array.from(existingMarkers).forEach(marker => marker.remove());

          new maplibregl.Marker({ 
            color: '#3182CE',
            element: createMarkerElement('captain-marker')
          })
            .setLngLat([newLocation.lng, newLocation.lat])
            .addTo(map);
        }
      },
      (error) => console.error('Location error:', error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onLocationUpdate]);

  // Layer visibility toggles
  const toggleHeatmap = () => {
    const map = mapInstance.current;
    if (!map) return;
    
    const visibility = map.getLayoutProperty('orders-heat', 'visibility');
    map.setLayoutProperty(
      'orders-heat',
      'visibility',
      visibility === 'visible' ? 'none' : 'visible'
    );
    setShowHeatmap(!showHeatmap);
  };

  const toggleClusters = () => {
    const map = mapInstance.current;
    if (!map) return;

    ['clusters', 'cluster-count', 'unclustered-point'].forEach(layer => {
      const visibility = map.getLayoutProperty(layer, 'visibility');
      map.setLayoutProperty(
        layer,
        'visibility',
        visibility === 'visible' ? 'none' : 'visible'
      );
    });
    setShowClusters(!showClusters);
  };

  // Create custom marker element
  const createMarkerElement = (className) => {
    const el = document.createElement('div');
    el.className = className;
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#3182CE';
    el.style.border = '2px solid #fff';
    return el;
  };

  return (
    <Box h="100%" position="relative">
      <Box ref={mapContainer} h="100%" w="100%" />

      {/* Map Controls */}
      <Flex 
        position="absolute" 
        top={4} 
        right={4} 
        direction="column"
        gap={2}
      >
        <Button
          leftIcon={<Layers size={16} />}
          size="sm"
          colorScheme={showHeatmap ? 'blue' : 'gray'}
          onClick={toggleHeatmap}
        >
          Heatmap
        </Button>
        <Button
          leftIcon={<Map size={16} />}
          size="sm"
          colorScheme={showClusters ? 'blue' : 'gray'}
          onClick={toggleClusters}
        >
          Clusters
        </Button>
        <Button
          leftIcon={<Navigation size={16} />}
          size="sm"
          colorScheme="blue"
          onClick={() => {
            const map = mapInstance.current;
            if (map && captainLocation) {
              map.flyTo({
                center: [captainLocation.lng, captainLocation.lat],
                zoom: 14
              });
            }
          }}
        >
          Center
        </Button>
      </Flex>

      {/* Stats Panel */}
      <Box 
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg={bgColor}
        borderTopWidth={1}
        borderTopColor={borderColor}
        borderRadius="md"
      >
        <HStack justify="center" spacing={8}>
          <HStack>
            <Icon as={MapPin} color="green.500" />
            <Text fontWeight="medium">
              {restaurants.length} Restaurants
            </Text>
          </HStack>
          <HStack>
            <Icon as={MapPin} color="orange.500" />
            <Text fontWeight="medium">
              {hotspots.length} Hotspots
            </Text>
          </HStack>
          {activeOrder && (
            <Badge colorScheme="purple">
              Active Delivery
            </Badge>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default HotspotMap;