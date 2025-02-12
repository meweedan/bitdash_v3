import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid JSON
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login method
  const login = async (userData, token, redirectPath = '/') => {
    try {
      // Validate user data and token
      if (!userData || !token) {
        throw new Error('Invalid login credentials');
      }

      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update auth state
      setUser(userData);
      setIsAuthenticated(true);

      // Show success toast
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.username || 'User'}!`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      // Redirect to specified path or home
      router.push(redirectPath);
    } catch (error) {
      // Handle login errors
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      logout();
    }
  };

  // Logout method
  const logout = (redirectPath = '/login') => {
    // Remove user data and token
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Reset auth state
    setUser(null);
    setIsAuthenticated(false);

    // Show logout toast
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true
    });

    // Redirect to login page
    router.push(redirectPath);
  };

  // Update user method
  const updateUser = (updatedUserData) => {
    if (!isAuthenticated) return;

    // Merge existing user data with updated data
    const mergedUserData = { ...user, ...updatedUserData };
    
    // Update local storage
    localStorage.setItem('user', JSON.stringify(mergedUserData));
    
    // Update state
    setUser(mergedUserData);
  };

  // Token refresh method
  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return null;

      // Implement token refresh logic
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token } = await response.json();
      
      // Update token in local storage
      localStorage.setItem('token', token);

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return null;
    }
  };

  // Prepare context value
  const authContextValue = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshToken
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;