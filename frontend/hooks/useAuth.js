import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = (userData) => {
    // Check if user has admin role
    return userData?.role?.type === 'admin' || userData?.role === 'admin';
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(checkAdminStatus(parsedUser));

        // Verify admin status with Strapi
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const currentUser = await response.json();
            setIsAdmin(checkAdminStatus(currentUser));
            // Update stored user data with latest from server
            localStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Error verifying admin status:', error);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(checkAdminStatus(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
};