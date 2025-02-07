import { Text, useColorMode } from '@chakra-ui/react';

export const GradientText = ({ children, ...props }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <Text
      as="span"
      bgGradient={isDark ? 
        "linear(to-r, gray.100, gray.300)" : 
        "linear(to-r, gray.700, gray.900)"}
      bgClip="text"
      {...props}
    >
      {children}
    </Text>
  );
};