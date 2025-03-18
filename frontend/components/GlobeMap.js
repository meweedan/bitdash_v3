import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';

const GlobeMap = () => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [arcsData, setArcsData] = useState([]);
  const [nightSide, setNightSide] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);
  const animationFrameIdRef = useRef(null);
  const animationsRef = useRef([]);

  // Update container dimensions for responsiveness - with window check for SSR
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDimensions);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
    
    return () => {};
  }, []);

  // Set an initial point of view centered on Tripoli
  useEffect(() => {
    if (globeEl.current) {
      // Center view on Tripoli
      globeEl.current.pointOfView({ lat: 32.8872, lng: 13.1913, altitude: 2.5 }, 0);
      
      // After a moment, zoom out to show more connections
      setTimeout(() => {
        globeEl.current.pointOfView({ lat: 32.8872, lng: 13.1913, altitude: 1.8 }, 3000);
      }, 2000);
    }
  }, []);

  // Customize globe material: deep space aesthetic with glowing edges
  useEffect(() => {
    if (globeEl.current && globeEl.current.globeMaterial) {
      const material = globeEl.current.globeMaterial;
      
      // Set a dark base color with a subtle blue tint
      material.color = new THREE.Color("#020814");
      
      // Atmospheric glow
      material.emissive = new THREE.Color("#103060");
      material.emissiveIntensity = 0.15;
      
      // Enhance with specular highlights
      material.specular = new THREE.Color('#7af7ff');
      material.shininess = 5;
      
      // Load high-quality textures - check for window to handle SSR
      if (typeof window !== 'undefined') {
        new THREE.TextureLoader().load(
          '//unpkg.com/three-globe/example/img/earth-water.png',
          texture => {
            material.specularMap = texture;
          }
        );
      }
      
      // Make atmosphere more prominent
      if (globeEl.current.atmosphereMaterial) {
        globeEl.current.atmosphereMaterial.opacity = 0.8;
        globeEl.current.atmosphereMaterial.color = new THREE.Color("#5bbbd4");
      }
    }
  }, []);

  // Animate the globe's emissive intensity for a subtle pulsing effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const clock = new THREE.Clock();
    
    const animate = () => {
      if (globeEl.current && globeEl.current.globeMaterial) {
        const material = globeEl.current.globeMaterial;
        const t = clock.getElapsedTime();
        
        // Subtle, slow pulsing effect
        material.emissiveIntensity = 0.15 + 0.1 * Math.sin(t * 0.5);
        
        // Also animate atmosphere opacity
        if (globeEl.current.atmosphereMaterial) {
          globeEl.current.atmosphereMaterial.opacity = 0.6 + 0.2 * Math.sin(t * 0.7);
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Tripoli, Libya as the central hub
  const tripoli = { id: 'tripoli', name: 'Tripoli', lat: 32.8872, lng: 13.1913, size: 2.5, category: 'hub' };

  // Major cities around the world
  const cities = useMemo(() => [
    // Add Tripoli first as the central hub
    tripoli,
    
    // North America
    { id: 'nyc', name: 'New York', lat: 40.7128, lng: -74.0060, size: 1.8, category: 'major' },
    { id: 'lax', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, size: 1.7, category: 'major' },
    { id: 'chi', name: 'Chicago', lat: 41.8781, lng: -87.6298, size: 1.5, category: 'major' },
    { id: 'tor', name: 'Toronto', lat: 43.6532, lng: -79.3832, size: 1.6, category: 'major' },
    { id: 'mex', name: 'Mexico City', lat: 19.4326, lng: -99.1332, size: 1.8, category: 'major' },
    
    // South America
    { id: 'rio', name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, size: 1.7, category: 'major' },
    { id: 'bog', name: 'Bogotá', lat: 4.7110, lng: -74.0721, size: 1.5, category: 'major' },
    { id: 'bue', name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, size: 1.6, category: 'major' },
    
    // Europe
    { id: 'lon', name: 'London', lat: 51.5074, lng: -0.1278, size: 1.8, category: 'major' },
    { id: 'par', name: 'Paris', lat: 48.8566, lng: 2.3522, size: 1.7, category: 'major' },
    { id: 'ber', name: 'Berlin', lat: 52.5200, lng: 13.4050, size: 1.6, category: 'major' },
    { id: 'mad', name: 'Madrid', lat: 40.4168, lng: -3.7038, size: 1.5, category: 'major' },
    { id: 'rom', name: 'Rome', lat: 41.9028, lng: 12.4964, size: 1.5, category: 'major' },
    { id: 'mos', name: 'Moscow', lat: 55.7558, lng: 37.6173, size: 1.7, category: 'major' },
    
    // Asia
    { id: 'tok', name: 'Tokyo', lat: 35.6762, lng: 139.6503, size: 1.9, category: 'major' },
    { id: 'bej', name: 'Beijing', lat: 39.9042, lng: 116.4074, size: 1.8, category: 'major' },
    { id: 'sha', name: 'Shanghai', lat: 31.2304, lng: 121.4737, size: 1.8, category: 'major' },
    { id: 'mum', name: 'Mumbai', lat: 19.0760, lng: 72.8777, size: 1.7, category: 'major' },
    { id: 'ist', name: 'Istanbul', lat: 41.0082, lng: 28.9784, size: 1.7, category: 'major' },
    { id: 'dub', name: 'Dubai', lat: 25.2048, lng: 55.2708, size: 1.8, category: 'major' },
    { id: 'sin', name: 'Singapore', lat: 1.3521, lng: 103.8198, size: 1.6, category: 'major' },
    
    // Africa
    { id: 'cai', name: 'Cairo', lat: 30.0444, lng: 31.2357, size: 1.7, category: 'major' },
    { id: 'lag', name: 'Lagos', lat: 6.5244, lng: 3.3792, size: 1.6, category: 'major' },
    { id: 'joh', name: 'Johannesburg', lat: -26.2041, lng: 28.0473, size: 1.6, category: 'major' },
    
    // Oceania
    { id: 'syd', name: 'Sydney', lat: -33.8688, lng: 151.2093, size: 1.7, category: 'major' },
    { id: 'mel', name: 'Melbourne', lat: -37.8136, lng: 144.9631, size: 1.6, category: 'major' },
    
    // Secondary cities
    { id: 'sea', name: 'Seattle', lat: 47.6062, lng: -122.3321, size: 1.3, category: 'secondary' },
    { id: 'van', name: 'Vancouver', lat: 49.2827, lng: -123.1207, size: 1.2, category: 'secondary' },
    { id: 'mia', name: 'Miami', lat: 25.7617, lng: -80.1918, size: 1.3, category: 'secondary' },
    { id: 'hou', name: 'Houston', lat: 29.7604, lng: -95.3698, size: 1.4, category: 'secondary' },
    { id: 'bar', name: 'Barcelona', lat: 41.3851, lng: 2.1734, size: 1.4, category: 'secondary' },
    { id: 'vie', name: 'Vienna', lat: 48.2082, lng: 16.3738, size: 1.3, category: 'secondary' },
    { id: 'del', name: 'Delhi', lat: 28.7041, lng: 77.1025, size: 1.4, category: 'secondary' },
    { id: 'hkg', name: 'Hong Kong', lat: 22.3193, lng: 114.1694, size: 1.4, category: 'secondary' },
    { id: 'ban', name: 'Bangkok', lat: 13.7563, lng: 100.5018, size: 1.4, category: 'secondary' },
    { id: 'seo', name: 'Seoul', lat: 37.5665, lng: 126.9780, size: 1.4, category: 'secondary' },
    { id: 'cap', name: 'Cape Town', lat: -33.9249, lng: 18.4241, size: 1.3, category: 'secondary' },
    { id: 'nai', name: 'Nairobi', lat: -1.2921, lng: 36.8219, size: 1.3, category: 'secondary' },
    { id: 'auc', name: 'Auckland', lat: -36.8485, lng: 174.7633, size: 1.2, category: 'secondary' },
  ], []);

  // Generate arcs data with Tripoli as the source
  useEffect(() => {
    if (typeof window === 'undefined' || !globeReady) return;

    // Make Tripoli the center of all connections
    const generateArcs = () => {
      const newArcs = [];
      
      // Filter out Tripoli from the list of cities
      const otherCities = cities.filter(city => city.id !== 'tripoli');
      
      // Connect Tripoli to all major cities with orange arcs
      const majorCities = otherCities.filter(city => city.category === 'major');
      majorCities.forEach(targetCity => {
        newArcs.push({
          startLat: tripoli.lat,
          startLng: tripoli.lng,
          endLat: targetCity.lat,
          endLng: targetCity.lng,
          color: '#ff6a00', // Orange for major connections
          alpha: 0.8,
          animationDuration: 2000 + Math.random() * 2000,
          pulseStart: Math.random(),
          altitude: 0.4 + Math.random() * 0.2,
          width: 3
        });
      });
      
      // Connect Tripoli to all secondary cities with green arcs
      const secondaryCities = otherCities.filter(city => city.category === 'secondary');
      secondaryCities.forEach(targetCity => {
        newArcs.push({
          startLat: tripoli.lat,
          startLng: tripoli.lng,
          endLat: targetCity.lat,
          endLng: targetCity.lng,
          color: '#00ff80', // Green for secondary connections
          alpha: 0.6,
          animationDuration: 3000 + Math.random() * 2000,
          pulseStart: Math.random(),
          altitude: 0.3 + Math.random() * 0.1,
          width: 2
        });
      });
      
      return newArcs;
    };
    
    setArcsData(generateArcs());
  }, [cities, globeReady]);

  // Pulse animation for arcs
  useEffect(() => {
    if (typeof window === 'undefined' || arcsData.length === 0) return;
    
    // Clear any existing animations
    animationsRef.current.forEach(timer => clearTimeout(timer));
    animationsRef.current = [];
    
    // Create pulsing effect for each arc
    let timeouts = [];
    
    const updateArcs = () => {
      const newArcs = [...arcsData];
      
      arcsData.forEach((arc, i) => {
        const now = Date.now();
        const cyclePosition = ((now / arc.animationDuration) + arc.pulseStart) % 1;
        const pulseValue = Math.sin(cyclePosition * Math.PI);
        
        newArcs[i] = {
          ...arc,
          alpha: 0.2 + pulseValue * (arc.alpha - 0.2)
        };
      });
      
      setArcsData(newArcs);
      
      // Schedule next update
      const timerId = setTimeout(updateArcs, 50);
      timeouts.push(timerId);
    };
    
    updateArcs();
    animationsRef.current = timeouts;
    
    return () => {
      timeouts.forEach(timer => clearTimeout(timer));
    };
  }, [arcsData]);

  // Toggle between day/night side for dramatic effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      setNightSide(prev => !prev);
    }, 60000); // Switch every minute
    
    return () => clearInterval(interval);
  }, []);

  // Globe textures
  const globeImageUrl = nightSide
    ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
    : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    
  const bumpImageUrl = '//unpkg.com/three-globe/example/img/earth-topology.png';

  return (
    <Box
      ref={containerRef}
      width="100%"
      height={{ base: "400px", md: "600px", lg: "800px" }}
      mx="auto"
      position="relative"
      overflow="hidden"
    >
      <Box 
        position="absolute"
        inset="0"
      />
      {typeof window !== 'undefined' && (
        <Globe
          ref={globeEl}
          width={dimensions.width || 80}
          height={dimensions.height || 600}
          globeImageUrl={globeImageUrl}
          bumpImageUrl={bumpImageUrl}
          disableBackground={true}
          backgroundColor="rgba(0,0,0,0)"
          onGlobeReady={() => setGlobeReady(true)}
          
          // Points representing cities
          pointsData={cities}
          pointColor={d => d.category === 'hub' ? '#ffffff' : d.category === 'major' ? '#ff6a00' : '#00ff80'}
          pointAltitude={d => d.category === 'hub' ? 0.03 : 0.02}
          pointRadius={d => d.category === 'hub' ? 0.5 : d.size * 0.18}
          pointsMerge={true}
          pointLabel=""
          
          // Arcs representing connections
          arcsData={arcsData}
          arcLabel={() => ''} // No labels
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcAltitude="altitude"
          arcStroke="75"
          arcDashLength={() => 1.5}
          arcDashGap={() => 1.2}
          arcDashAnimateTime={d => d.animationDuration}
          
          // Customization
          atmosphereColor="#3a92a3"
          atmosphereAltitude={0.25}
          lineHoverPrecision={0}
          
          // Interactivity
          autoRotate={true}
          autoRotateSpeed={0.25}
          enableZoom={false}
          zoomOnClick={false}
        />
      )}
    </Box>
  );
};

export default GlobeMap;