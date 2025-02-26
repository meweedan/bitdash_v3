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

export const FundPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitFund',
    description: 'Reimagining Libyan Finances',
    image: '/fund.png',
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

export const TradePWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitTrade',
    description: 'Reimagining Libyan Finances',
    image: '/trade.png',
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

export const InvestPWALanding = () => {
  const router = useRouter();
  const config = {
    title: 'BitInvest',
    description: 'Reimagining Libyan Finances',
    image: '/invest.png',
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
  if (hostname.includes('fund')) return <FundPWALanding />;
  if (hostname.includes('trade')) return <TradePWALanding />;
  if (hostname.includes('invest')) return <InvestPWALanding />;

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