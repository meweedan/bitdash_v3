// components/ParallaxOrderFlow/index.js
import { useRef, useState, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { Box, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

const riseAnimation = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

export const ParallaxOrderFlow = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const containerRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 0.1 - (rect.top / window.innerHeight)));
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 4;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box position="float" overflow="visible">
      <chakra.svg
        viewBox="0 0 1200 600"
        style={{
          transform: `translateY(${scrollY * 50}px) scale(1.35)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <defs>
          <linearGradient id="menuGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isDark ? "#2d3748" : "#ffffff"}/>
            <stop offset="100%" stopColor={isDark ? "#1a202c" : "#f7fafc"}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(0, ${-scrollY * 100})`}>
          {/* Phone 1 - QR Scanning */}
          <g transform="translate(200, 100)">
            <rect 
              width="200" 
              height="400" 
              rx="30" 
              fill={isDark ? "#2d3748" : "#1179be"}
              filter="url(#glow)"
              opacity={currentStep === 0 ? "1" : "0.5"}
            />
            <rect 
              x="20" 
              y="20" 
              width="160" 
              height="160" 
              rx="12" 
              fill="#0a60a3"
              opacity="0.1"
            />
            <text 
              x="100" 
              y="350" 
              textAnchor="middle" 
              fill={isDark ? "#ffffff" : "#ffffff"}
              fontSize="16"
              fontWeight="bold"
            >
              Scan QR
            </text>
          </g>

          {/* Phone 2 - Menu Browsing */}
          <g transform="translate(500, 100)">
            <rect 
              width="200" 
              height="400" 
              rx="30" 
              fill={isDark ? "#2d3748" : "#1179be"}
              filter="url(#glow)"
              opacity={currentStep === 1 ? "1" : "0.5"}
            />
            <g transform="translate(20, 40)">
              <rect width="160" height="40" rx="8" fill="#0a60a3" opacity="0.8"/>
              <rect y="60" width="160" height="20" rx="4" fill="#0a60a3" opacity="0.1"/>
              <rect y="90" width="160" height="20" rx="4" fill="#0a60a3" opacity="0.1"/>
              <rect y="120" width="160" height="20" rx="4" fill="#0a60a3" opacity="0.1"/>
            </g>
            <text 
              x="100" 
              y="350" 
              textAnchor="middle" 
              fill={isDark ? "#ffffff" : "#ffffff"}
              fontSize="16"
              fontWeight="bold"
            >
              Browse Menu
            </text>
          </g>

          {/* Phone 3 - Order Complete */}
          <g transform="translate(800, 100)">
            <rect 
              width="200" 
              height="400" 
              rx="30" 
              fill={isDark ? "#2d3748" : "#1179be"}
              filter="url(#glow)"
              opacity={currentStep === 2 ? "1" : "0.5"}
            />
            <g transform="translate(20, 40)">
              <rect width="160" height="60" rx="8" fill="#0a60a3" opacity="0.8"/>
              <circle cx="140" cy="30" r="12" fill="#4CAF50"/>
              <path 
                d="M134,30 L138,34 L146,26" 
                stroke="white" 
                strokeWidth="2"
                fill="none"
              />
            </g>
            <text 
              x="100" 
              y="350" 
              textAnchor="middle" 
              fill={isDark ? "#ffffff" : "#ffffff"}
              fontSize="16"
              fontWeight="bold"
            >
              Ordered!
            </text>
          </g>
        </g>

        {/* Connecting Lines */}
        <g stroke="#0a60a3" strokeWidth="2" strokeDasharray="6,6">
          <motion.path
            d="M400,300 C450,300 450,350 500,350"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M700,350 C750,350 750,400 800,400"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
          />
        </g>
      </chakra.svg>
    </Box>
  );
};

export default ParallaxOrderFlow;