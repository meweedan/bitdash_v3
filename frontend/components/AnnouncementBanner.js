// components/AnnouncementBanner.js
import React from 'react';
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
  
  // Normalize platform string to lowercase for consistency and provide a fallback
  const normalizedPlatform = platform ? platform.toLowerCase() : 'bitdash';
  
  // Fetch platform-specific announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', normalizedPlatform],
    queryFn: async () => {
      try {
        // Build the API URL
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?` +
          'filters[status][$eq]=active&' +
          `filters[platform][$eq]=${normalizedPlatform}&` +
          'sort[priority]=desc';
          
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch announcements: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        // Return a valid structure on error to prevent rendering issues
        return { data: [] };
      }
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 2,         // Retry failed requests twice
    refetchOnWindowFocus: false
  });

  // If we're loading or have no announcements, don't render anything
  if (isLoading || !announcements || !announcements.data || !Array.isArray(announcements.data) || announcements.data.length === 0) {
    return null;
  }

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
            {announcements.data.map((announcement, index) => {
              // Safely access attributes with fallbacks
              const attrs = announcement.attributes || {};
              const text = attrs.text || '';
              const icon = attrs.icon || 'announcement';
              const link = attrs.link || '';
              
              return (
                <HStack
                  key={`${repeatIndex}-${index}`}
                  spacing={3}
                  px={4}
                  py={2}
                  cursor={link ? 'pointer' : 'default'}
                  onClick={() => {
                    if (link) {
                      window.open(link, '_blank');
                    }
                  }}
                  _hover={{
                    transform: 'translateY(-5px)',
                  }}
                  transition="all 0.2s"
                >
                  <Text fontSize="xl">
                    {iconMap[icon] || '📢'} {/* Default icon if not found */}
                  </Text>
                  <Text
                    color={isDark ? 'black' : 'black'}
                    fontWeight="bold"
                    fontSize="xl"
                  >
                    {text}
                  </Text>
                  <Box
                    w="2px"
                    h="2px"
                  />
                </HStack>
              );
            })}
          </HStack>
        ))}
      </MotionBox>
    </Box>
  );
};

export default AnnouncementBanner;