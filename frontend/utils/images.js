export const getImageUrl = (imageData, size = 'medium') => {
  if (!imageData?.data?.attributes) return null;
  
  const { formats, url } = imageData.data.attributes;
  
  // If formats exist and requested size is available, use that
  if (formats && formats[size]) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${formats[size].url}`;
  }
  
  // Fallback to original URL
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
};

export const getAllVehicleImages = (vehicle) => {
  if (!vehicle?.attributes) return [];
  
  const { mainImage, galleryImages, interiorImages, exteriorImages } = vehicle.attributes;
  
  const images = [
    mainImage,
    ...(galleryImages?.data || []),
    ...(interiorImages?.data || []),
    ...(exteriorImages?.data || [])
  ].filter(Boolean);

  return images.map(img => ({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.attributes.url}`,
    formats: img.attributes.formats,
    alt: vehicle.attributes.title || 'Vehicle image'
  }));
};