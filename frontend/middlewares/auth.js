// middleware/auth.js
export function withDealerAuth(gssp) {
  return async (context) => {
    const { req, resolvedUrl } = context;
    const token = req.cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: `/login?redirect=${encodeURIComponent(resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    try {
      // Get the operator profile for the user
      const operatorRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/operators?filters[users_permissions_user][id][$eq]=${user.id}&filters[businessType][$eq]=dealer&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!operatorRes.ok) throw new Error('Failed to fetch operator');
      const operatorData = await operatorRes.json();

      // Verify dealer operator exists
      if (!operatorData.data || operatorData.data.length === 0) {
        throw new Error('Not authorized as dealer');
      }

      const operator = operatorData.data[0];

      // Call the page's getServerSideProps and extend props
      const pageProps = await gssp?.(context);
      return {
        props: {
          ...pageProps?.props,
          operator,
        },
      };
    } catch (error) {
      console.error('Auth error:', error);
      // Clear invalid token
      context.res.setHeader(
        'Set-Cookie',
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      );
      
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
}