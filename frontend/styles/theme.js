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
      bitcash: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      bitfund: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      bittrade: {
        400: '#8b7966',
        500: '#b8a28b',    // Base
        600: '#9c7c63',    // Hover
        700: '#c4b2a0',    // Emphasis
      },
      bitstock: {
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
        // BitCash variants
        'bitcash-solid': {
          bg: 'brand.bitcash.500',
          color: 'white',
          _hover: { bg: 'brand.bitcash.600' }
        },
        'bitcash-outline': {
          border: '2px solid',
          borderColor: 'brand.bitcash.500',
          color: 'brand.bitcash.500',
          _hover: { bg: 'brand.bitcash.500', color: 'white' }
        },
        // BitFund variants
        'bitfund-solid': {
          bg: 'brand.bitfund.500',
          color: 'white',
          _hover: { bg: 'brand.bitfund.600' }
        },
        'bitfund-outline': {
          border: '2px solid',
          borderColor: 'brand.bitfund.500',
          color: 'brand.bitfund.500',
          _hover: { bg: 'brand.bitfund.500', color: 'white' }
        },
        // BitTrade variants
        'bittrade-solid': {
          bg: 'brand.bittrade.500',
          color: 'white',
          _hover: { bg: 'brand.bittrade.600' }
        },
        'bittrade-outline': {
          border: '2px solid',
          borderColor: 'brand.bittrade.500',
          color: 'brand.bittrade.500',
          _hover: { bg: 'brand.bittrade.500', color: 'white' }
        },
        // BitStock variants
        'bitstock-solid': {
          bg: 'brand.bitstock.500',
          color: 'white',
          _hover: { bg: 'brand.bitstock.600' }
        },
        'bitstock-outline': {
          border: '2px solid',
          borderColor: 'brand.bitstock.500',
          color: 'brand.bitstock.500',
          _hover: { bg: 'brand.bitstock.500', color: 'white' }
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
        bitcash: {
          borderColor: 'brand.bitcash.500',
        },
        bitfund: {
          borderColor: 'brand.bitfund.500',
        },
        bittrade: {
          borderColor: 'brand.bittrade.500',
        },
        bitstock: {
          borderColor: 'brand.bitstock.500',
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
