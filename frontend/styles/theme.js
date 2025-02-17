import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
       bitdash: {
        400: '#67bdfd', 
        500: '#67bdfd',
        600: '#67bdfd',
        700: '#67bdfd',
        800: '#67bdfd'
      },
      bitcash: {
        400: '#7bcfbd',
        500: '#56bba5',    // Base
        600: '#1eb495',    // Hover
        700: '#2d7b6a',    // Emphasis
      },
      bitfood: {
        400: '#ffd7ba',
        500: '#ffa78a',    // Base
        600: '#ffc8b6',    // Hover
        700: '#ff8963',    // Emphasis
      },
      bitshop: {
        400: '#77a2e4',
        500: '#8bcdfd',    // Base
        600: '#74baed',    // Hover
        700: '#5f94e6',    // Emphasis
      },
      bitride: {
        400: '#ebcdab',
        500: '#e6c093',    // Base
        600: '#c6a783',    // Hover
        700: '#edb26d',    // Emphasis
      },
      bitwork: {
        400: '#8C8C8C',    // Lighter grey for subtle highlights
        500: '#525252',    // Base - your specified grey
        600: '#424242',    // Hover - slightly darker
        700: '#333333',    // Emphasis - even darker for contrast
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
          borderImage: 'brand.bitdash.500',
          borderImageSlice: 1,
          color: props => props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: { 
            bg: 'brand.bitdash.500', 
            color: 'white'
          }
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
        
        // BitFood variants
        'bitfood-solid': {
          bg: 'brand.bitfood.500',
          color: 'white',
          _hover: { bg: 'brand.bitfood.600' }
        },
        'bitfood-outline': {
          border: '2px solid',
          borderColor: 'brand.bitfood.500',
          color: 'brand.bitfood.500',
          _hover: { bg: 'brand.bitfood.500', color: 'white' }
        },
        
        // BitShop variants
        'bitshop-solid': {
          bg: 'brand.bitshop.500',
          color: 'white',
          _hover: { bg: 'brand.bitshop.600' }
        },
        'bitshop-outline': {
          border: '2px solid',
          borderColor: 'brand.bitshop.500',
          color: 'brand.bitshop.500',
          _hover: { bg: 'brand.bitshop.500', color: 'white' }
        },
        
        // BitRide variants
        'bitride-solid': {
          bg: 'brand.bitride.500',
          color: 'white',
          _hover: { bg: 'brand.bitride.600' }
        },
        'bitride-outline': {
          border: '2px solid',
          borderColor: 'brand.bitride.500',
          color: 'brand.bitride.500',
          _hover: { bg: 'brand.bitride.500', color: 'white' }
        },

        // BitWork variants
       'bitwork-solid': {
          bg: 'brand.bitwork.500',
          color: 'white', 
          _hover: { bg: 'brand.bitwork.600' }
        },
        'bitwork-outline': {
          border: '2px solid',
          borderColor: 'brand.bitwork.500',
          color: props => props.colorMode === 'dark' ? 'brand.bitwork.400' : 'brand.bitwork.500',
          _hover: { 
            bg: 'brand.bitwork.500', 
            color: 'white'
          }
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
          borderImage: 'brand.bitdash.500',
          borderImageSlice: 1,
        },
        bitcash: {
          borderColor: 'brand.bitcash.500',
        },
        bitfood: {
          borderColor: 'brand.bitfood.500',
        },
        bitshop: {
          borderColor: 'brand.bitshop.500',
        },
        bitride: {
          borderColor: 'brand.bitride.500',
        },
        bitwork: {
          borderColor: 'brand.bitwork.500',
          _hover: {
            borderColor: 'brand.bitwork.400'
          }
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