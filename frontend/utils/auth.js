// utils/auth.js
export const setAuthToken = (token) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Set expiry to 7 days
  
  localStorage.setItem('jwt', token);
  localStorage.setItem('tokenExpiry', expiryDate.toISOString());
};

export const checkTokenExpiry = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return false;
  
  const expiryDate = new Date(expiry);
  const now = new Date();
  
  if (now > expiryDate) {
    // Token expired, clear auth data
    localStorage.removeItem('jwt');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('customerProfile');
    return false;
  }
  
  return true;
};