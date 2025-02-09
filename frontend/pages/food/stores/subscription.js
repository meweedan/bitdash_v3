// frontend/pages/stores/subscription.js
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Container, useToast } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionConfig';
import Head from 'next/head';
import SubscriptionSelector from '@/components/SubscriptionSelector';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePlanSelect = async (planId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Subscriptions</title>
      </Head>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <SubscriptionSelector onSelect={handlePlanSelect} isLoading={loading} />
        </Container>
      </Layout>
    </>
  );
}