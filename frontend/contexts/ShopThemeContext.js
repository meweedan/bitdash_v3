// contexts/ShopThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import { 
  useColorModeValue, 
  ChakraProvider, 
  extendTheme 
} from '@chakra-ui/react';

const DEFAULT_THEME = {
  name: 'default',
  colors: {
    primary: '#3182CE',    // Blue
    secondary: '#F7FAFC',  // Light gray
    accent: '#48BB78',     // Green
    text: {
      light: '#2D3748',   // Dark gray for light mode
      dark: '#E2E8F0'     // Light gray for dark mode
    },
    background: {
      light: 'white',
      dark: 'gray.800'
    }
  },
  layout: {
    type: 'grid',         // 'grid' or 'list'
    columns: {
      base: 1,            // Mobile
      md: 3,              // Tablet
      lg: 4               // Desktop
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingSize: {
      shop: '2xl',
      product: 'lg'
    }
  },
  features: {
    showLocation: true,
    showRatings: true,
    showSocialLinks: true
  },
  customization: {
    borderRadius: 'md',   // Chakra UI border radius
    boxShadow: 'md',      // Chakra UI box shadow
    spacing: 4            // Chakra UI spacing
  }
};

const ShopThemeContext = createContext(null);
export const ShopThemeProvider = ({ 
  theme = {}, 
  children 
}) => {
  // Deep merge function to combine default and custom theme
  const deepMerge = (target, source) => {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };

  const isObject = (item) => 
    item && typeof item === 'object' && !Array.isArray(item);

  // Merge provided theme with default theme
  const mergedTheme = deepMerge(DEFAULT_THEME, theme);

  // Create Chakra UI theme
  const chakraTheme = extendTheme({
    styles: {
      global: {
        body: {
          bg: useColorModeValue(
            mergedTheme.colors.background.light, 
            mergedTheme.colors.background.dark
          ),
          color: useColorModeValue(
            mergedTheme.colors.text.light, 
            mergedTheme.colors.text.dark
          )
        }
      }
    },
    fonts: {
      heading: mergedTheme.typography.fontFamily,
      body: mergedTheme.typography.fontFamily
    },
    components: {
      Button: {
        baseStyle: {
          borderRadius: mergedTheme.customization.borderRadius
        }
      },
      Card: {
        baseStyle: {
          container: {
            borderRadius: mergedTheme.customization.borderRadius,
            boxShadow: mergedTheme.customization.boxShadow
          }
        }
      }
    }
  });

  // Prepare theme context value
  const themeContextValue = {
    ...mergedTheme,
    colors: {
      primary: useColorModeValue(
        mergedTheme.colors.primary, 
        mergedTheme.colors.primary
      ),
      secondary: useColorModeValue(
        mergedTheme.colors.secondary, 
        mergedTheme.colors.secondary
      ),
      accent: useColorModeValue(
        mergedTheme.colors.accent, 
        mergedTheme.colors.accent
      ),
      text: useColorModeValue(
        mergedTheme.colors.text.light, 
        mergedTheme.colors.text.dark
      ),
      background: useColorModeValue(
        mergedTheme.colors.background.light, 
        mergedTheme.colors.background.dark
      )
    }
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <ShopThemeContext.Provider value={themeContextValue}>
        {children}
      </ShopThemeContext.Provider>
    </ChakraProvider>
  );
};


export const useShopTheme = () => {
  const context = useContext(ShopThemeContext);
  if (!context) {
    throw new Error('useShopTheme must be used within a ShopThemeProvider');
  }
  return context;
};

export default ShopThemeContext;