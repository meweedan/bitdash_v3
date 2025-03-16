import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      bitdash: {
       400: '#387fc2',
        500: '#387fc2',    // Base
        600: '#387fc2',    // Hover
        700: '#387fc2',    // Emphasis
      },
      tazdani: {
        400: '#00bf63',
        500: '#00bf63',    // Base
        600: '#00bf63',    // Hover
        700: '#00bf63',    // Emphasis
      },
      utlubha: {
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
        // tazdani variants
        'tazdani-solid': {
          bg: 'brand.tazdani.500',
          color: 'white',
          _hover: { bg: 'brand.tazdani.600' }
        },
        'tazdani-outline': {
          border: '2px solid',
          borderColor: 'brand.tazdani.500',
          color: 'brand.tazdani.500',
          _hover: { bg: 'brand.tazdani.500', color: 'white' }
        },
        // utlubha variants
        'utlubha-solid': {
          bg: 'brand.utlubha.700',
          color: 'white',
          _hover: { bg: 'brand.utlubha.400' }
        },
        'utlubha-outline': {
          border: '2px solid',
          borderColor: 'brand.utlubha.500',
          color: 'brand.utlubha.500',
          _hover: { bg: 'brand.utlubha.500', color: 'white' }
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
        tazdani: {
          borderColor: 'brand.tazdani.500',
        },
        utlubha: {
          borderColor: 'brand.utlubha.500',
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
