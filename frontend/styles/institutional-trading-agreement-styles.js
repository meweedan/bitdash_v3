import { extendTheme } from '@chakra-ui/react';

// Custom styles for the Institutional Trading Agreement page
export const agreementStyles = {
  global: {
    '.agreement-container': {
      maxWidth: '4xl',
      mx: 'auto',
      px: { base: 4, md: 8 },
      py: 8,
    },
    '.agreement-header': {
      textAlign: 'center',
      mb: 6,
    },
    '.agreement-heading': {
      fontSize: { base: '2xl', md: '3xl' },
      fontWeight: 'bold',
      mb: 3,
    },
    '.agreement-date': {
      fontSize: 'md',
      color: 'gray.500',
    },
    '.agreement-section': {
      mb: 8,
    },
    '.section-heading': {
      fontSize: { base: 'lg', md: 'xl' },
      fontWeight: 'bold',
      mb: 4,
    },
    '.subsection-heading': {
      fontSize: { base: 'md', md: 'lg' },
      fontWeight: 'semibold',
      mb: 2,
    },
    '.agreement-text': {
      lineHeight: 'tall',
      mb: 4,
    },
    '.agreement-list': {
      pl: 6,
      mb: 4,
      '& li': {
        mb: 2,
      },
    },
    '.agreement-accordion': {
      '& .chakra-accordion__button': {
        py: 3,
        fontWeight: 'medium',
      },
      '& .chakra-accordion__panel': {
        px: 4,
        py: 4,
      },
    },
    '.agreement-card': {
      p: 6,
      borderWidth: '1px',
      borderRadius: 'md',
      mb: 6,
      bg: 'gray.50',
      _dark: {
        bg: 'gray.700',
      },
    },
    '.agreement-alert': {
      borderRadius: 'md',
      mb: 6,
    },
    '.agreement-download-button': {
      alignSelf: 'center',
      mb: 6,
    },
    '.agreement-resources': {
      mt: 8,
      '& button': {
        mr: 2,
        mb: 2,
      },
    },
  },
  components: {
    // Customize Accordion styles for the agreement page
    Accordion: {
      baseStyle: {
        container: {
          borderColor: 'gray.200',
          _dark: {
            borderColor: 'gray.700',
          },
        },
        button: {
          _hover: {
            bg: 'gray.50',
            _dark: {
              bg: 'gray.700',
            },
          },
        },
      },
    },
    // Customize Alert styles
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md',
        },
      },
    },
  },
};

// You can incorporate these styles into your main theme
export const theme = extendTheme({
  styles: {
    global: {
      ...agreementStyles.global,
    },
  },
  components: {
    ...agreementStyles.components,
  },
});

export default agreementStyles;