// pages/privacy.js
import { Container, VStack, Heading, Text, Box, List, ListItem, UnorderedList } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function Privacy() {
  return (
    <>
    <Head>
      <title>Privacy Policy</title>
    </Head>
    <Layout>
      <Container maxW="4xl" py={12}>
        <VStack spacing={8} align="start">
          <Heading size="2xl">Privacy Policy</Heading>
          <Text>Last updated: December 2024</Text>

          <Box>
            <Heading size="lg" mb={4}>1. Data Collection</Heading>
            <UnorderedList spacing={3}>
              <ListItem>
                <Text fontWeight="medium">Personal Information</Text>
                <Text>Name, email, phone number, and business details when you register or use our services.</Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="medium">Usage Data</Text>
                <Text>Information about how you interact with our platforms, including order history, browsing patterns, and feature usage.</Text>
              </ListItem>
              <ListItem>
                <Text fontWeight="medium">Device Information</Text>
                <Text>Device type, operating system, browser type, and IP address for security and optimization.</Text>
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>2. Data Usage</Heading>
            <Text mb={4}>We use collected data to:</Text>
            <UnorderedList spacing={3}>
              <ListItem>Provide and improve our services</ListItem>
              <ListItem>Process transactions and orders</ListItem>
              <ListItem>Send important notifications and updates</ListItem>
              <ListItem>Analyze platform performance and user behavior</ListItem>
              <ListItem>Prevent fraud and ensure security</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>3. Data Protection</Heading>
            <Text>We implement industry-standard security measures to protect your data, including:</Text>
            <UnorderedList spacing={3}>
              <ListItem>SSL/TLS encryption for all data transfers</ListItem>
              <ListItem>Regular security audits and updates</ListItem>
              <ListItem>Strict access controls and authentication</ListItem>
              <ListItem>Data backups and disaster recovery plans</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>4. Your Rights</Heading>
            <Text>You have the right to:</Text>
            <UnorderedList spacing={3}>
              <ListItem>Access your personal data</ListItem>
              <ListItem>Request data correction or deletion</ListItem>
              <ListItem>Opt-out of marketing communications</ListItem>
              <ListItem>Export your data</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>5. Contact Us</Heading>
            <Text>For privacy-related inquiries, contact us at:</Text>
            <Text mt={2} fontWeight="medium">privacy@bitdash.app</Text>
          </Box>
        </VStack>
      </Container>
    </Layout>
    </>
  );
}