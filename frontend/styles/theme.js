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
      adfaaly: {
        400: '#00bf63',
        500: '#00bf63',    // Base
        600: '#00bf63',    // Hover
        700: '#00bf63',    // Emphasis
      },
      bsoraa: {
        400: '#ff914d',
        500: '#E86C00',    // Base
        600: '#ff914d',    // Hover
        700: '#E86C00',    // Emphasis
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
        // adfaaly variants
        'adfaaly-solid': {
          bg: 'brand.adfaaly.500',
          color: 'white',
          _hover: { bg: 'brand.adfaaly.600' }
        },
        'adfaaly-outline': {
          border: '2px solid',
          borderColor: 'brand.adfaaly.500',
          color: 'brand.adfaaly.500',
          _hover: { bg: 'brand.adfaaly.500', color: 'white' }
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
        // bsoraa variants
        'bsoraa-solid': {
          bg: 'brand.bsoraa.700',
          color: 'white',
          _hover: { bg: 'brand.bsoraa.400' }
        },
        'bsoraa-outline': {
          border: '2px solid',
          borderColor: 'brand.bsoraa.500',
          color: 'brand.bsoraa.500',
          _hover: { bg: 'brand.bsoraa.500', color: 'white' }
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
        adfaaly: {
          borderColor: 'brand.adfaaly.500',
        },
        bsoraa: {
          borderColor: 'brand.bsoraa.500',
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
