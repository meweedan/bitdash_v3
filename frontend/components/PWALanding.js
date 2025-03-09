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

export const CryptoPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'Crypto by BitDash',
    description: 'Unlock financial freedom via Crypto and DeFi',
    image: '/crypto.png',
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

export const LDNPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'LDN Prime Markets',
    description: 'Your trusted forex broker',
    image: '/ldn.png',
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

export const StocksPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitStocks',
    description: 'Reimagining Libyan Finances',
    image: '/stock.png',
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

  if (hostname.includes('cash')) return <CashPWALanding />;
  if (hostname.includes('crypto')) return <CryptoPWALanding />;
  if (hostname.includes('ldn')) return <LDNPWALanding />;
  if (hostname.includes('stocks')) return <StocksPWALanding />;

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