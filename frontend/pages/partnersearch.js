import React from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import RestaurantLookup from '../components/RestaurantLookup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const PartnerSearch = () => {
  const { t } = useTranslation('common'); // Make sure you use the correct namespace

  return (
    <>
    <Head>
      <title>{t('partnerlookup')}</title>
    </Head>
      <Box p={8} maxW="1000px" mx="auto">
        <VStack spacing={8} align="stretch">
          <RestaurantLookup />
        </VStack>
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default PartnerSearch;

