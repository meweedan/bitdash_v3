import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      bitdash: {
       400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      cash: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      crypto: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      ldn: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      stocks: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      }
    },
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: 'bold',
      },
      variants: {
        // BitDash variants
        'bitdash-solid': {
          bg: 'brand.bitdash.500',
          color: 'white',
          _hover: { bg: 'brand.bitdash.600' }
        },
        'bitdash-outline': {
          border: '2px solid',
          borderColor: 'brand.bitdash.500',
          color: 'brand.bitdash.500',
          _hover: { bg: 'brand.bitdash.500', color: 'white' }
        },
        // Cash variants
        'cash-solid': {
          bg: 'brand.cash.500',
          color: 'white',
          _hover: { bg: 'brand.cash.600' }
        },
        'cash-outline': {
          border: '2px solid',
          borderColor: 'brand.cash.500',
          color: 'brand.cash.500',
          _hover: { bg: 'brand.cash.500', color: 'white' }
        },
        // Crypto variants
        'crypto-solid': {
          bg: 'brand.crypto.500',
          color: 'white',
          _hover: { bg: 'brand.crypto.600' }
        },
        'crypto-outline': {
          border: '2px solid',
          borderColor: 'brand.crypto.500',
          color: 'brand.crypto.500',
          _hover: { bg: 'brand.crypto.500', color: 'white' }
        },
        // LDN variants
        'ldn-solid': {
          bg: 'brand.ldn.500',
          color: 'white',
          _hover: { bg: 'brand.ldn.600' }
        },
        'ldn-outline': {
          border: '2px solid',
          borderColor: 'brand.ldn.500',
          color: 'brand.ldn.500',
          _hover: { bg: 'brand.ldn.500', color: 'white' }
        },
        // Stocks variants
        'stocks-solid': {
          bg: 'brand.stocks.500',
          color: 'white',
          _hover: { bg: 'brand.stocks.600' }
        },
        'stocks-outline': {
          border: '2px solid',
          borderColor: 'brand.stocks.500',
          color: 'brand.stocks.500',
          _hover: { bg: 'brand.stocks.500', color: 'white' }
        }
      },
    },
    GlassCard: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'whiteAlpha.900',
        backdropFilter: 'blur(10px)',
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
      }),
      variants: {
        bitdash: {
          borderColor: 'brand.bitdash.500',
        },
        cash: {
          borderColor: 'brand.cash.500',
        },
        crypto: {
          borderColor: 'brand.crypto.500',
        },
        ldn: {
          borderColor: 'brand.ldn.500',
        },
        stocks: {
          borderColor: 'brand.stocks.500',
        }
      }
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'black' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }
    }),
  },
});

export default theme;
