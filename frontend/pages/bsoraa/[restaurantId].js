// pages/eats/[restaurantId].js
import React from 'react';
import { useRouter } from 'next/router';

const RestaurantPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  return (
    <div>Restaurant {restaurantId} Page</div>
  );
};

export default RestaurantPage;