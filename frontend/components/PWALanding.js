// frontend/components/PWALanding.js
import React from 'react';
import Image from 'next/image';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ParallaxOrderFlow } from './ParallaxOrderFlow';
import CryptoMatrix from './CryptoMatrix';

const PWAContainer = ({ children }) => (
  <div 
    className="min-h-screen flex flex-col items-center justify-center p-4" 
  >
    {children}
  </div>
);

export const FoodPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitFund',
    description: 'Online menus + ordering system for restaurants',
    image: '/food.png',
    color: '#4CAF50'
  };

  return (
    <PWAContainer>
      <Container config={config} router={router}>
        <div className="mt-8 w-full h-64 relative overflow-hidden rounded-lg">
          <ParallaxOrderFlow />
        </div>
      </Container>
    </PWAContainer>
  );
};

export const CashPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitCash',
    description: 'Reimagining Libyan Finances',
    image: '/cash.png',
    color: '#4CAF50'
  };

  return (
    <PWAContainer>
      <Container config={config} router={router}>
        <div className="mt-8 w-full h-64 relative overflow-hidden rounded-lg">
          <CryptoMatrix />
        </div>
      </Container>
    </PWAContainer>
  );
};

export const ShopPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitShop',
    description: 'Shopping never felt so easy',
    image: '/shop.png',
    color: '#4CAF50'
  };

  return (
    <PWAContainer>
      <Container config={config} router={router}>
        <div className="mt-8 w-full h-64 relative overflow-hidden rounded-lg">
          <ParallaxOrderFlow />
        </div>
      </Container>
    </PWAContainer>
  );
};

// Default export for backwards compatibility
const PWALanding = () => {
  const router = useRouter();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  if (hostname.includes('cash')) return <CashPWALanding />;
  if (hostname.includes('food')) return <FoodPWALanding />;
  if (hostname.includes('shop')) return <ShopPWALanding />;

  const config = {
    title: 'BitDash',
    description: 'Growing together, bit by bit.',
    image: '/app-logo.png',
    color: '#111111'
  };

  return (
    <PWAContainer>
      <Container config={config} router={router} />
    </PWAContainer>
  );
};

export default PWALanding;