// components/AnnouncementBanner.js
import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const MotionBox = motion(Box);

const iconMap = {
  fire: "🔥",
  lightning: "⚡",
  gift: "🎁",
  sparkle: "✨",
  star: "⭐",
  announcement: "📢",
  tag: "🏷️",
  diamond: "💎",
  rocket: "🚀"
};

const AnnouncementBanner = ({ platform }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  console.log(`AnnouncementBanner received platform: ${platform}`);

  // Normalize platform string to lowercase for consistency
  const normalizedPlatform = platform ? platform.toLowerCase() : '';
  
  // Fetch platform-specific announcements
  const { data: announcements, isError, error, isLoading } = useQuery({
    queryKey: ['announcements', normalizedPlatform],
    queryFn: async () => {
      try {
        console.log(`Fetching announcements for platform: ${normalizedPlatform}`);
        
        // Build the API URL
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?` +
          'filters[status][$eq]=active&' +
          `filters[platform][$eq]=${normalizedPlatform}&` +
          'sort[priority]=desc';
          
        console.log(`API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response from announcements API:', errorText);
          throw new Error(`Failed to fetch announcements: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Announcements data received:', data);
        return data;
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        return { data: [] };
      }
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 2,         // Retry failed requests twice
    refetchOnWindowFocus: false
  });

  // Handle loading and error states
  useEffect(() => {
    if (isLoading) {
      console.log('Loading announcements...');
    }
    
    if (isError) {
      console.error('Error fetching announcements:', error);
    }
  }, [isLoading, isError, error]);

  // Check if we have valid announcements data
  if (!announcements?.data?.length) {
    console.log(`No announcements found for platform: ${normalizedPlatform}`);
    return null;
  }

  console.log(`Rendering ${announcements.data.length} announcements for platform: ${normalizedPlatform}`);

  return (
    <Box
      position="sticky"
      top="100px"
      left={0}
      right={0}
      zIndex={998}
      bg={isDark ? `brand.${normalizedPlatform}.400` : `brand.${normalizedPlatform}.700`}
      backdropFilter="blur(10px)"
      boxShadow="lg"
      overflow="hidden"
    >
      <MotionBox
        display="flex"
        whiteSpace="nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          },
        }}
        style={{ gap: "2rem" }}
      >
        {[...Array(10)].map((_, repeatIndex) => (
          <HStack key={repeatIndex} spacing={8}>
            {announcements.data.map((announcement, index) => (
              <HStack
                key={`${repeatIndex}-${index}`}
                spacing={3}
                px={4}
                py={2}
                cursor={announcement.attributes.link ? 'pointer' : 'default'}
                onClick={() => {
                  if (announcement.attributes.link) {
                    window.open(announcement.attributes.link, '_blank');
                  }
                }}
                _hover={{
                  transform: 'translateY(-5px)',
                }}
                transition="all 0.2s"
              >
                <Text fontSize="xl">
                  {iconMap[announcement.attributes.icon] || '📢'} {/* Default icon if not found */}
                </Text>
                <Text
                  color={isDark ? 'black' : 'black'}
                  fontWeight="large"
                  fontSize="lg"
                >
                  {announcement.attributes.text}
                </Text>
                <Box
                  w="2px"
                  h="2px"
                />
              </HStack>
            ))}
          </HStack>
        ))}
      </MotionBox>
    </Box>
  );
};

export default AnnouncementBanner;