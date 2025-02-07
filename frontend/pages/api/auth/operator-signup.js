// pages/api/auth/operator-signup.js
import strapiAxios from '../../../lib/axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract data from request
    const { userData, operatorData, restaurantData } = req.body;

    // 1. Check if Strapi is accessible using an existing endpoint
    try {
      await strapiAxios.get('/api/users-permissions');
    } catch (error) {
      console.error('Strapi connection check failed:', error);
      return res.status(503).json({ 
        error: 'Unable to connect to Strapi. Please ensure the backend service is running.' 
      });
    }

    // 2. Register user
    let registerResponse;
    try {
      registerResponse = await strapiAxios.post('/api/auth/local/register', {
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      if (error.response?.status === 400) {
        return res.status(400).json({
          error: error.response.data?.error?.message || 'Invalid registration data'
        });
      }
      return res.status(500).json({
        error: 'User registration failed'
      });
    }

    const { jwt, user } = registerResponse.data;

    // 3. Create operator profile
    let operatorResponse;
    try {
      operatorResponse = await strapiAxios.post('/api/operators', 
        {
          data: {
            ...operatorData,
            users_permissions_user: user.id,
            status: 'pending',
            dateJoined: new Date().toISOString(),
            verificationStatus: false
          }
        },
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );
    } catch (error) {
      console.error('Operator creation failed:', error.response?.data);
      return res.status(400).json({
        error: 'Failed to create operator profile. Please check your data and try again.'
      });
    }

    // 4. Create restaurant
    let restaurantResponse;
    try {
      restaurantResponse = await strapiAxios.post('/api/restaurants',
        {
          data: {
            ...restaurantData,
            operator: operatorResponse.data.id,
            status: 'active'
          }
        },
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );
    } catch (error) {
      console.error('Restaurant creation failed:', error.response?.data);
      return res.status(400).json({
        error: 'Failed to create restaurant. Please check your data and try again.'
      });
    }

    // 5. Update operator with restaurant reference
    try {
      await strapiAxios.put(
        `/api/operators/${operatorResponse.data.id}`,
        {
          data: {
            restaurant: restaurantResponse.data.id
          }
        },
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );
    } catch (error) {
      console.error('Warning: Failed to update operator with restaurant reference:', error);
      // Continue despite error as this is not critical
    }

    // Return success response
    return res.status(200).json({
      jwt,
      user,
      operator: operatorResponse.data,
      restaurant: restaurantResponse.data
    });

  } catch (error) {
    console.error('Signup process failed:', error);
    return res.status(500).json({
      error: 'Registration process failed. Please try again later.'
    });
  }
}