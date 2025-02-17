import { motion } from 'framer-motion';
import { SimpleGrid, Box, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const currencies = [
  // Cryptocurrencies with high-res SVG icons
  // {
  //   symbol: 'btc',
  //   name: 'Bitcoin',
  //   icon: (
  //     <svg viewBox="0 0 32 32" width="32" height="32">
  //       <path
  //         fill="#F7931A"
  //         d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
  //       />
  //       <path
  //         fill="white"
  //         d="M23.189 14.2205C23.5927 12.0369 21.9166 10.9382 19.6381 10.1818L20.3484 7.81483L18.8724 7.45844L18.1842 9.76606C17.7804 9.66885 17.3645 9.57812 16.9506 9.48739L17.6448 7.16328L16.1688 6.80689L15.4585 9.17386C15.1239 9.10062 14.7953 9.02737 14.4747 8.95062V8.94412L12.4375 8.46067L12.0577 10.0339C12.0577 10.0339 13.1564 10.2789 13.1304 10.2919C13.7397 10.4278 13.8496 10.8157 13.8346 11.1264L13.0273 13.8337C13.0793 13.8467 13.1454 13.8662 13.2179 13.8987C13.1584 13.8857 13.0948 13.8727 13.0293 13.8597L11.9046 17.6486C11.8321 17.8236 11.6441 18.0967 11.2192 18.004C11.2387 18.0235 10.1465 17.7395 10.1465 17.7395L9.44531 19.4156L11.3672 19.8665C11.7385 19.9572 12.1018 20.0544 12.4596 20.1451L11.7428 22.5381L13.2168 22.8945L13.9291 20.5211C14.3504 20.6313 14.7582 20.7349 15.158 20.8321L14.4487 23.1925L15.9247 23.5489L16.6415 21.1624C19.7415 21.704 22.0674 21.4915 23.0155 18.6877C23.7813 16.4482 22.8787 15.1733 21.2611 14.3754C22.4473 14.0842 23.3369 13.3639 23.1889 14.2205ZM19.6001 17.6031C19.0558 19.8426 15.4305 18.7764 14.3187 18.5039L15.2669 15.3547C16.3787 15.6292 20.1704 15.2721 19.6001 17.6031ZM20.1444 14.1945C19.6456 16.2489 16.6155 15.3287 15.6998 15.1017L16.5635 12.2335C17.4792 12.4605 20.6672 12.0486 20.1444 14.1945Z"
  //       />
  //     </svg>
  //   )
  // },
  // {
  //   symbol: 'eth',
  //   name: 'Ethereum',
  //   icon: (
  //     <svg viewBox="0 0 32 32" width="32" height="32">
  //       <path
  //         fill="#627EEA"
  //         d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
  //       />
  //       <path
  //         fill="white"
  //         fillOpacity="0.602"
  //         d="M16.498 4V12.87L23.995 16.22L16.498 4Z"
  //       />
  //       <path
  //         fill="white"
  //         d="M16.498 4L9 16.22L16.498 12.87V4Z"
  //       />
  //       <path
  //         fill="white"
  //         fillOpacity="0.602"
  //         d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z"
  //       />
  //       <path
  //         fill="white"
  //         d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z"
  //       />
  //       <path
  //         fill="white"
  //         fillOpacity="0.2"
  //         d="M16.498 20.573L23.995 16.22L16.498 12.872V20.573Z"
  //       />
  //       <path
  //         fill="white"
  //         fillOpacity="0.602"
  //         d="M9 16.22L16.498 20.573V12.872L9 16.22Z"
  //       />
  //     </svg>
  //   )
  // },
  {
    symbol: 'usdt',
    name: 'Tether',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <path
          fill="#26A17B"
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        />
        <path
          fill="white"
          d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"
        />
      </svg>
    )
  },
  {
    symbol: 'lyd',
    name: 'Libyan Dinar',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <circle cx="16" cy="16" r="16" fill="#239659"/>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          LYD
        </text>
      </svg>
    )
  },
  {
    symbol: 'usd',
    name: 'US Dollar',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <circle cx="16" cy="16" r="16" fill="#22803D"/>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          $
        </text>
      </svg>
    )
  },
  {
    symbol: 'eur',
    name: 'Euro',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <circle cx="16" cy="16" r="16" fill="#0F47AF"/>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          €
        </text>
      </svg>
    )
  },
  {
    symbol: 'gbp',
    name: 'British Pound',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <circle cx="16" cy="16" r="16" fill="#003D7D"/>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          £
        </text>
      </svg>
    )
  },
  {
    symbol: 'egp',
    name: 'Egyptian Pound',
    icon: (
      <svg viewBox="0 0 32 32" width="64" height="64">
        <circle cx="16" cy="16" r="16" fill="#C8102E"/>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          EGP
        </text>
      </svg>
    )
  }
];

const CryptoMatrix = ({ 
  columns = { base: 3, md: 4, lg: 6 }, 
  spacing = { base: 2, md: 2 },
  duration = 4 
}) => {
  const boxBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.50');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const glowColor = useColorModeValue('green.200', 'green.600');

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {currencies.map(({ symbol, name, icon }, index) => (
        <motion.div
          key={symbol}
          animate={{
            y: [20, -5, 20],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: duration,
            delay: index * 0.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Box
            w="full"
            aspectRatio={1}
            p={3}
            bg={boxBg}
            borderRadius="3xl"
            boxShadow={boxShadow}
            _hover={{
              transform: 'scale(1.5)',
              boxShadow: `0 0 20px ${glowColor}`,
            }}
            transition="all 0.3s ease"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Box>
        </motion.div>
      ))}
    </SimpleGrid>
  );
};

export default CryptoMatrix;