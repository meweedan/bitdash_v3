// frontend/components/PWALanding.js
import React from 'react';
import Image from 'next/image';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import CryptoMatrix from './CryptoMatrix';

const PWAContainer = ({ children }) => (
  <div 
    className="min-h-screen flex flex-col items-center justify-center p-4" 
  >
    {children}
  </div>
);

export const AdfaalyPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'Adfaaly',
    description: 'Reimagining Libyan Finances',
    image: '/adfaaly.png',
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

export const BsoraaPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'Bsoraa',
    description: 'Your trusted forex broker',
    image: '/bsoraa.png',
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


// Default export for backwards compatibility
const PWALanding = () => {
  const router = useRouter();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  if (hostname.includes('adfaaly')) return <AdfaalyPWALanding />;
  if (hostname.includes('bsoraa')) return <BsoraaPWALanding />;

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