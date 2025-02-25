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

const AnnouncementBanner = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [platform, setPlatform] = useState('bitdash');

  // Get current platform based on URL/hostname
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('invest')) setPlatform('bitinvest');
    else if (hostname.includes('cash')) setPlatform('bitcash');
    else if (hostname.includes('trade')) setPlatform('bittrade');
    else if (hostname.includes('fund')) setPlatform('bitfund');
    
    // For local development
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/invest')) setPlatform('bitinvest');
      if (path.includes('/cash')) setPlatform('bitcash');
      if (path.includes('/fund')) setPlatform('bitfund');
      if (path.includes('/trade')) setPlatform('bittrade');
    }
  }, []);

  // Fetch platform-specific announcements
  const { data: announcements } = useQuery({
    queryKey: ['announcements', platform],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?` +
          'filters[status][$eq]=active&' +
          `filters[platform][$eq]=${platform}&` +
          'sort[priority]=desc'
        );

        if (!response.ok) throw new Error('Failed to fetch announcements');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        return { data: [] };
      }
    },
    staleTime: 60000 // Cache for 1 minute
  });

  if (!announcements?.data?.length) return null;

  return (
    <Box
      position="sticky"
      top="100px"
      left={0}
      right={0}
      zIndex={998}
      bg={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
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
                  {iconMap[announcement.attributes.icon]}
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