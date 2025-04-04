import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import styles from './FlowingShawl.module.css';

const FlowingShawl = () => {
  const mountRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [platform, setPlatform] = useState('bitdash');

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('tazdani')) setPlatform('tazdani');
      else if (hostname.includes('utlubha')) setPlatform('utlubha');
    }
  }, []);

  const themeColors = {
    tazdani: [
      new THREE.Color('#00bf63'),
      new THREE.Color('#00bf63'),
      new THREE.Color('#00bf63'),
      new THREE.Color('#00bf63')
    ],
    utlubha: [
      new THREE.Color('#ff914d'),
      new THREE.Color('#ff914d'),
      new THREE.Color('#ff914d'),
      new THREE.Color('#ff914d')
    ],
    bitdash: [
      new THREE.Color('#387fc2'),
      new THREE.Color('#387fc2'),
      new THREE.Color('#387fc2'),
      new THREE.Color('#387fc2')
    ]
  };

  useEffect(() => {
    if (!isClient) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

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

    const pointLight = new THREE.PointLight(0x404040, 5, 360, 360, 560);
    pointLight.position.set(9, 9, 9);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 80, 129, 400);
    scene.add(ambientLight);

    camera.position.z = 50;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.003;

      curves.forEach((curve, index) => {
        const vertices = curve.geometry.attributes.position;
        const originalY = -10 + index * spacing;

        for (let i = 0; i < vertices.count; i++) {
          const x = vertices.getX(i);
          
          // More fluid-like wave pattern but keeping original structure
          const wave1 = Math.sin(x * 0.05 + time) * 3;
          const wave2 = Math.cos(x * 0.03 + time * 1.5) * 2;
          const wave3 = Math.sin(x * 0.08 + time * 0.7) * 2;
          
          const y = originalY + wave1 + wave2 + wave3;
          
          vertices.setY(i, y);
        }
        vertices.needsUpdate = true;

        const elapsedTime = time * 333;
        if (elapsedTime <= 8000) {
          let opacity;
          if (elapsedTime <= 4000) {
            opacity = 1 - (elapsedTime / 4000) * 0.5;
          } else {
            opacity = 0.5 - ((elapsedTime - 4000) / 4000) * 0.35;
          }
          curve.material.opacity = opacity;
        }

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