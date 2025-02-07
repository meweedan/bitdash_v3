import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      500: '#3182ce', // Blue for light mode buttons
      600: '#000000', // Darker shade for hover in light mode
      700: '#2267cf', // Accent color for light mode
      darkBlue: '#0a60a3', // Dark mode button color
      lightBlue: '#1179be', // Darker blue for hover in dark mode
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'black' : 'white', // Body background
        color: props.colorMode === 'dark' ? 'white' : 'black', // Text color
      },
      a: {
        color: props.colorMode === 'dark' ? 'white' : 'brand.500', // Link color based on mode
        _hover: {
          color: props.colorMode === 'dark' ? 'brand.lightBlue' : 'brand.700', // Hover color
        },
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full', // Rounded buttons
        color: 'white', // Default text color
        backdropFilter: 'blur(10px)', // Apply blur universally to all buttons
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.darkBlue' : 'brand.500', // Button background based on mode
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.lightBlue' : 'brand.700', // Hover state
            color: props.colorMode === 'dark' ? 'white' : 'black', // Hover text color
          },
        }),
        outline: (props) => ({
          border: '2px solid',
          borderColor: props.colorMode === 'dark' ? 'brand.lightBlue' : 'brand.700',
          color: props.colorMode === 'dark' ? 'brand.lightBlue' : 'brand.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.darkBlue' : 'brand.500',
            color: 'white',
          },
        }),
      },
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'black', // Heading color
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'black', // Text color
      }),
    },
    Link: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'brand.500', // Link color
      }),
    },
  },
  config: {
    initialColorMode: 'light', // Default to light mode
    useSystemColorMode: false, // Don’t change based on system preferences
  },
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
  },
});

export default theme;
