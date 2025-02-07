import React, { useEffect } from 'react';  // Add React import
import { useRouter } from 'next/router';
import { Box, Spinner } from '@chakra-ui/react';
import Layout from '@/components/Layout';

const SignupRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Get query parameters on client side only
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const role = queryParams.get('role');

      if (role === 'operator') {
        router.replace('/signup/operator');
      } else if (role === 'customer') {
        router.replace('/signup/customer');
      } else {
        router.replace('/signup/choice');
      }
    }
  }, [router]);

  return (
    <Layout>
      <Box
      >
        <Spinner size="xl" />
      </Box>
    </Layout>
  );
};

export default SignupRedirect;