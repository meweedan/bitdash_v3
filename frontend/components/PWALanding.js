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

export const AdfalyPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'Adfaly',
    description: 'Reimagining Libyan Finances',
    image: '/Adfaly.png',
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

export const UtlubhaPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'Utlubha',
    description: 'Your trusted forex broker',
    image: '/utlubha.png',
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

  if (hostname.includes('Adfaly')) return <AdfalyPWALanding />;
  if (hostname.includes('utlubha')) return <UtlubhaPWALanding />;

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