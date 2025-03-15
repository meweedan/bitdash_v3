// components/wallet/IntegrationSection.js
import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { FeatureCard } from './FeatureCard';

export const IntegrationSection = ({ features }) => {
  return (
    <Box py={12}>
      <Container maxW="7xl">
        <Heading textAlign="center" mb={12}>Seamless Integration</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};