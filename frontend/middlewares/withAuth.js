// middlewares/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSubdomain from '@/hooks/useSubdomain';

export function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const router = useRouter();
    const { platform } = useSubdomain();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          if (!token || !user?.id) {
            throw new Error('No auth token');
          }

          // Fetch operator data with all relations
          const operatorRes = await fetch(
            `${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${user.id}&populate[auto_dealer][populate]=*&populate[stock_trader][populate]=*&populate[restaurant][populate]=*`,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            }
          );

          if (!operatorRes.ok) {
            console.error('Operator fetch error:', await operatorRes.json());
            throw new Error('Failed to fetch operator data');
          }

          const { data: operatorData } = await operatorRes.json();
          
          if (!operatorData?.[0]) {
            throw new Error('No operator profile found');
          }

          const operator = operatorData[0];
          
          // Verify correct platform access
          const businessTypeMap = {
            restaurant: 'food',
            dealer: 'auto',
            trader: 'stock',
            merchant: 'cash',
            agent: 'cash'
          };

          const correctPlatform = businessTypeMap[operator.attributes.businessType];
          
          if (correctPlatform !== platform) {
            window.location.href = `https://${correctPlatform}.bitdash.app${PLATFORM_CONFIG[correctPlatform].route}`;
            return;
          }

        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      };

      checkAuth();
    }, [router, platform]);

    return <WrappedComponent {...props} />;
  };
}