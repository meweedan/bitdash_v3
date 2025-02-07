import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from './Sphere.module.css';

const DisplacementSphere = () => {
  const mountRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the component runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Sphere Geometry with Displacement
    const geometry = new THREE.SphereGeometry(1.5, 65, 75);
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Displace vertices to create irregular surface
    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      const offset = Math.random() / 1.5 - 1.7; // Random displacement factor
      vertex.multiplyScalar(0.75 + offset * Math.sin(vertex.length())); // Apply sine wave for bumps
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();

    // Mesh Material (Shiny, dim sun-like effect)
    const material = new THREE.MeshStandardMaterial({
      color: 0x1179be,
      metalness: 0.05,
      roughness: 500,
      transparent: true,
      opacity: 0.1, // Adjust opacity for a dim effect
      emissive: 0x1179be, // Set emissive color
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lighting Setup
    const pointLight = new THREE.PointLight(0x404040, 5, 360, 360, 560);
    pointLight.position.set(9, 9, 9);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 80, 129, 400);
    scene.add(ambientLight);

    // Camera position (Z-distance)
    camera.position.z = 15;

    // Animate Sphere Rotation and Shine Effect
    const animate = () => {
      requestAnimationFrame(animate);

      // Sphere rotation
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.008;

      // Shine effect (dim sun-like effect with random fluctuations in emissive intensity)
      const shine = Math.random() * 0.05; // Small random fluctuation
      material.emissiveIntensity = 0.05 + shine; // Add a subtle shine effect

      renderer.render(scene, camera);
    };
    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isClient]);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return <div className={styles.sphereContainer} ref={mountRef}></div>;
};

export default DisplacementSphere;
