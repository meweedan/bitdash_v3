// hooks/useLocations.js
import { useState, useEffect } from 'react';

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both agents and merchants locations
      const [agentResponse, merchantResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents/map/locations`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/map/locations`)
      ]);

      if (!agentResponse.ok || !merchantResponse.ok) {
        throw new Error('Failed to fetch locations');
      }

      const agentResult = await agentResponse.json();
      const merchantResult = await merchantResponse.json();
      
      // Combine locations
      const combinedLocations = [
        ...(agentResult.data || []),
        ...(merchantResult.data || [])
      ];

      // Add distance calculation if user location is available
      const locationsWithDistance = combinedLocations.map(location => ({
        ...location,
        distance: userLocation ? 
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            location.latitude,
            location.longitude
          ) : null
      }));

      setLocations(locationsWithDistance);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    fetchLocations();
  }, [userLocation]);

  return {
    locations,
    isLoading,
    error,
    userLocation,
    refetch: fetchLocations
  };
};