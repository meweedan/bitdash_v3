import { VStack, Box, Text, HStack } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const FeatureHighlight = ({ icon: Icon, title, description, benefits }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  return (
    <VStack 
      align="start" 
      spacing={4}
      p={6}
      rounded="xl"
      borderWidth="1px"
      borderColor={isDark ? 'gray.700' : 'gray.200'}
      _hover={{ 
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      transition="all 0.3s"
      h="full"
      bg={isDark ? 'gray.800' : 'white'}
    >
      <Icon size={32} />
      <Box>
        <Text fontWeight="bold" fontSize="lg" mb={2}>{t(title)}</Text>
        <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm" mb={4}>
          {t(description)}
        </Text>
        {benefits && (
          <VStack align="start" spacing={2}>
            {benefits.map((benefit, index) => (
              <HStack key={index} spacing={2}>
                <CheckCircle size={16} />
                <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                  {t(benefit)}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};