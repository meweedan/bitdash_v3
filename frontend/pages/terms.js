import { Container, VStack, Heading, Text, Box, List, ListItem, UnorderedList } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function Terms() {
  return (
    <>
    <Head>
        <title>Terms of Service</title>
    </Head>
    <Layout>
      <Container maxW="4xl" py={12}>
        <VStack spacing={8} align="start">
          <Heading size="2xl">Terms of Service</Heading>
          <Text>Last updated: December 2024</Text>

          <Box>
            <Heading size="lg" mb={4}>1. Service Usage</Heading>
            <UnorderedList spacing={3}>
              <ListItem>
                <Text fontWeight="medium">Account Responsibility</Text>
                <Text>You are responsible for maintaining account security and confidentiality.</Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="medium">Acceptable Use</Text>
                <Text>Services must be used in compliance with applicable laws and our guidelines.</Text>
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>2. Subscription Terms</Heading>
            <UnorderedList spacing={3}>
              <ListItem>
                <Text fontWeight="medium">Billing</Text>
                <Text>Subscription fees are billed according to your selected plan.</Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="medium">Cancellation</Text>
                <Text>You may cancel your subscription at any time with 30 days notice.</Text>
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>3. Service Availability</Heading>
            <Text mb={4}>BitDash strives to maintain:</Text>
            <UnorderedList spacing={3}>
              <ListItem>99.9% uptime for all platforms</ListItem>
              <ListItem>Regular maintenance windows with advance notice</ListItem>
              <ListItem>24/7 technical support for premium subscribers</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>4. Intellectual Property</Heading>
            <UnorderedList spacing={3}>
              <ListItem>All platform content and features are owned by BitDash</ListItem>
              <ListItem>Users retain rights to their uploaded content</ListItem>
              <ListItem>Brand assets may not be used without permission</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>5. Liability</Heading>
            <UnorderedList spacing={3}>
              <ListItem>Services provided "as is" without warranties</ListItem>
              <ListItem>Limited liability for service interruptions</ListItem>
              <ListItem>Users responsible for data backup</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>6. Governing Law</Heading>
            <Text>These terms are governed by Libyan law. Any disputes will be resolved in Libyan courts.</Text>
          </Box>
        </VStack>
      </Container>
    </Layout>
    </>
  );
}