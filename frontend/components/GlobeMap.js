import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';

const GlobeMap = () => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update container dimensions for responsiveness
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Set an initial point of view
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
    }
  }, []);

  // Customize globe material: tint to dark navy and set emissive for pulsing
  useEffect(() => {
    if (globeEl.current && globeEl.current.globeMaterial) {
      const material = globeEl.current.globeMaterial;
      // Tint the globe dark navy
      material.color = new THREE.Color("#001f3f");
      // Set emissive color to your hex for pulsing
      material.emissive = new THREE.Color("#c4b2a0");
      material.emissiveIntensity = 0.5;
      // Optional: load a water texture for specular effect
      new THREE.TextureLoader().load(
        '//unpkg.com/three-globe/example/img/earth-water.png',
        texture => {
          material.specularMap = texture;
          material.specular = new THREE.Color('grey');
          material.shininess = 15;
        }
      );
    }
  }, []);

  // Animate the globe's emissive intensity to pulse
  useEffect(() => {
    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      if (globeEl.current && globeEl.current.globeMaterial) {
        const material = globeEl.current.globeMaterial;
        const t = clock.getElapsedTime();
        // Pulse emissive intensity between 0.2 and 0.8
        material.emissiveIntensity = 0.5 + 0.3 * Math.sin(t * 2);
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Globe textures
  const globeImageUrl = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
  const bumpImageUrl = '//unpkg.com/three-globe/example/img/earth-topology.png';

  // Pin color remains your specified hex
  const pinColor = "#c4b2a0";

  // Offices: London, Cairo, Istanbul, New York
  const offices = [
    { id: 'london', name: 'London', coordinates: [51.5049, 0.0255] },
    { id: 'cairo', name: 'Cairo', coordinates: [30.0444, 31.2357] },
    { id: 'istanbul', name: 'Istanbul', coordinates: [41.0082, 28.9784] },
    { id: 'newyork', name: 'New York', coordinates: [40.7048, -74.0051] }
  ];

  // Floating labels: the label altitude pushes them out from the surface so they appear in space.
  const officeLabels = offices.map(o => ({
    ...o,
    lat: o.coordinates[0],
    lng: o.coordinates[1],
    text: o.name,
    altitude: 0.2 // Adjust as needed to have labels float
  }));

  return (
    <Box
      ref={containerRef}
      width="100%"
      height={{ base: "400px", md: "600px", lg: "800px" }}
      mx="auto"
    >
      <Globe
        ref={globeEl}
        globeImageUrl={globeImageUrl}
        bumpImageUrl={bumpImageUrl}
        backgroundColor="rgba(0,0,0,0)"
        width={dimensions.width}
        height={dimensions.height}
        // Render office pins
        pointsData={offices}
        pointLat={d => d.coordinates[0]}
        pointLng={d => d.coordinates[1]}
        pointColor={() => pinColor}
        pointRadius={0.15}
        pointAltitude={0.02}
        // Render floating labels in bold white
        labelsData={officeLabels}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.text}
        labelColor={() => "#c4b2a0"}
        labelDotRadius={0}
        labelSize={3.5}
        labelResolution={2}
        labelAltitude={d => d.altitude}
        autoRotate={true}
        autoRotateSpeed={0.4}
        enableZoom={true}
        onPointClick={d => alert(`Office: ${d.name}`)}
      />
    </Box>
  );
};

export default GlobeMap;
