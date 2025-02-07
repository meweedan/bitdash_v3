// components/common/MapComponent.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

const MapComponent = ({ locations = [], center }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLibrary, setMapLibrary] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      try {
        // Import libraries
        const maplibregl = await import('maplibre-gl');
        await import('maplibre-gl/dist/maplibre-gl.css');

        if (!isMounted) return;
        setMapLibrary(maplibregl);

      } catch (error) {
        console.error('Error loading map libraries:', error);
      }
    };

    loadMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize map once libraries are loaded and container is ready
  useEffect(() => {
    if (!mapLibrary || !mapContainer.current || map.current) return;

    try {
      map.current = new mapLibrary.Map({
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
          }]
        },
        center: [center[1], center[0]],
        zoom: 12
      });

      // Add navigation controls
      map.current.addControl(
        new mapLibrary.NavigationControl({
          showCompass: false,
          showZoom: true
        }),
        'top-right'
      );

      // Cleanup on unmount
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapLibrary, center]);

  // Handle markers
  useEffect(() => {
    if (!map.current || !mapLibrary || !map.current.loaded()) return;

    try {
      // Remove existing markers
      const markers = document.getElementsByClassName('maplibregl-marker');
      while (markers[0]) {
        markers[0].remove();
      }

      // Add new markers
      locations.forEach((location) => {
        const markerColor = location.type === 'agent' ? '#67bdfd' : '#2454b4';
        
        const el = document.createElement('div');
        el.className = 'location-marker';
        el.innerHTML = `
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 20 12 20s12-12.8 12-20c0-6.6-5.4-12-12-12z" 
                  fill="${markerColor}"
            />
            <circle cx="12" cy="12" r="5" fill="white"/>
          </svg>
        `;

        const popup = new mapLibrary.Popup({
          offset: [0, -32],
          closeButton: false,
          maxWidth: '300px',
          className: 'location-popup'
        }).setHTML(`
          <div style="padding: 12px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #67bdfd;">
              ${location.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #666;">
              ${location.address}
            </p>
            ${location.distance ? `
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #888;">
                ${location.distance.toFixed(1)} km away
              </p>
            ` : ''}
            <a href="https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}" 
               target="_blank" rel="noopener noreferrer"
               style="color: #67bdfd; text-decoration: none; font-size: 12px; display: block;"
            >
              Open in Maps →
            </a>
          </div>
        `);

        new mapLibrary.Marker({ element: el })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(popup)
          .addTo(map.current);
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [locations, mapLibrary]);

  return (
    <Box position="relative" height="100%" width="100%">
      <Box 
        ref={mapContainer} 
        height="100%" 
        width="100%"
        id="map"
      />
      <style jsx global>{`
        .location-marker {
          cursor: pointer;
          width: 24px;
          height: 32px;
        }
        .location-popup .maplibregl-popup-content {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: none;
        }
        .maplibregl-ctrl-group {
          background: white;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .maplibregl-ctrl-group button {
          width: 32px;
          height: 32px;
        }
      `}</style>
    </Box>
  );
};

export default MapComponent;