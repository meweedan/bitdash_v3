// utils/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  // Basic phone validation (can be adjusted based on your needs)
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};