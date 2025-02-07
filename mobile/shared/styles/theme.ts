// shared/styles/theme.ts
export const bitdashTheme = {
  colors: {
    primary: {
      bitcash: '#4CAF50',   // Green
      bitfood: '#FF5722',   // Deep Orange
      bitride: '#2196F3',   // Blue
      bitshop: '#9C27B0'    // Purple
    },
    background: {
      light: '#FFFFFF',
      dark: '#121212'
    },
    text: {
      light: '#333333',
      dark: '#FFFFFF'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontFamily: {
      regular: 'System',
      bold: 'System-Bold'
    },
    sizes: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24
    }
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16
  }
};

export const getAppTheme = (appName: 'bitcash' | 'bitfood' | 'bitride' | 'bitshop') => {
  return {
    ...bitdashTheme,
    colors: {
      ...bitdashTheme.colors,
      primary: bitdashTheme.colors.primary[appName]
    }
  };
};