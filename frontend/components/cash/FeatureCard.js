// components/wallet/FeatureCard.js
import { Box, VStack, Icon, Text, useColorModeValue } from '@chakra-ui/react';

export const FeatureCard = ({ icon: IconComponent, title, description, color }) => {
  return (
    <Box
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      shadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
    >
      <VStack spacing={4} align="flex-start">
        <Icon as={IconComponent} w={10} h={10} color={`${color}.500`} />
        <Text fontWeight="bold" fontSize="xl">{title}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
      </VStack>
    </Box>
  );
};
