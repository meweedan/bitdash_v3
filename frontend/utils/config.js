export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
};

export const getApiUrl = (path) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${path}`;
};