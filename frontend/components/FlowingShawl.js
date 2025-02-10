import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from './FlowingShawl.module.css';

const FlowingShawl = () => {
  const mountRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [platform, setPlatform] = useState('bitdash');

  useEffect(() => {
    setIsClient(true);
    // Detect platform from subdomain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('cash')) setPlatform('bitcash');
      else if (hostname.includes('food')) setPlatform('bitfood');
      else if (hostname.includes('shop')) setPlatform('bitshop');
      else if (hostname.includes('ride')) setPlatform('bitride');
      else if (hostname.includes('work')) setPlatform('bitwork');
    }
  }, []);

  const themeColors = {
    bitdash: [
      new THREE.Color('#67bdfd'), // 400
      new THREE.Color('#8C8C8C'), // 500
      new THREE.Color('#edb26d'), // 600
      new THREE.Color('#525252')  // 700
    ],
    bitcash: [
      new THREE.Color('#7bcfbd'), // 400
      new THREE.Color('#56bba5'), // 500
      new THREE.Color('#1eb495'), // 600
      new THREE.Color('#2d7b6a')  // 700
    ],
    bitfood: [
      new THREE.Color('#ffd7ba'), // 400
      new THREE.Color('#ffa78a'), // 500
      new THREE.Color('#ffc8b6'), // 600
      new THREE.Color('#ff8963')  // 700
    ],
    bitshop: [
      new THREE.Color('#77a2e4'), // 400
      new THREE.Color('#8bcdfd'), // 500
      new THREE.Color('#74baed'), // 600
      new THREE.Color('#5f94e6')  // 700
    ],
    bitride: [
      new THREE.Color('#ebcdab'), // 400
      new THREE.Color('#e6c093'), // 500
      new THREE.Color('#c6a783'), // 600
      new THREE.Color('#edb26d')  // 700
    ],
    bitwork: [
      new THREE.Color('#8C8C8C'), // 400
      new THREE.Color('#525252'), // 500
      new THREE.Color('#424242'), // 600
      new THREE.Color('#333333')  // 700
    ]
  };

  useEffect(() => {
    if (!isClient) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create flowing curves
    const createCurve = (startY, color) => {
      const points = [];
      const numPoints = 50;
      const width = 80;
      const height = 40;

      for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints * width) - width / 2;
        const y = startY + Math.sin(i / numPoints * Math.PI * 2) * 5;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 200, 0.3, 8, false);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 30
      });

      return new THREE.Mesh(geometry, material);
    };

    const colors = themeColors[platform];
    const curves = [];
    const numCurves = 8;
    const spacing = 5;

    for (let i = 0; i < numCurves; i++) {
      const curve = createCurve(
        -10 + i * spacing, 
        colors[i % colors.length]
      );
      curves.push(curve);
      scene.add(curve);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 50;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.003;

      curves.forEach((curve, index) => {
        // Flowing wave motion
        const vertices = curve.geometry.attributes.position;
        const originalY = -10 + index * spacing;

        for (let i = 0; i < vertices.count; i++) {
          const x = vertices.getX(i);
          
          // Complex wave pattern
          const wave1 = Math.sin(x * 0.1 + time) * 2;
          const wave2 = Math.cos(x * 0.2 + time * 1.5) * 1.5;
          const wave3 = Math.sin(x * 0.05 + time * 0.7) * 3;
          
          // Combine waves with original position
          const y = originalY + wave1 + wave2 + wave3;
          
          vertices.setY(i, y);
        }
        vertices.needsUpdate = true;

        // Fade out animation
        const elapsedTime = time * 333; // Adjust timing
        if (elapsedTime <= 8000) {
          let opacity;
          if (elapsedTime <= 4000) {
            opacity = 1 - (elapsedTime / 4000) * 0.5;
          } else {
            opacity = 0.5 - ((elapsedTime - 4000) / 4000) * 0.35;
          }
          curve.material.opacity = opacity;
        }

        // Subtle shine effect
        curve.material.emissiveIntensity = 0.1 + Math.sin(time * 2) * 0.05;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isClient, platform]);

  if (!isClient) return null;

  return <div className={styles.shawlContainer} ref={mountRef} />;
};

export default FlowingShawl;