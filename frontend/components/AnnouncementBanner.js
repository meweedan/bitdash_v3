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

const AnnouncementBanner = ({ platform = 'bitshop' }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?` +
        'filters[status][$eq]=active&' +
        `filters[target][$in][0]=all&filters[target][$in][1]=${platform === 'bitshop' ? 'owner' : 'customer'}&` +
        'sort[priority]=desc'
      );

      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
    staleTime: 60000 // 1 minute
  });

  if (!announcements?.data?.length) return null;

  return (
    <Box
      position="sticky"
      top="72px" // Adjust based on your header height
      left={0}
      right={0}
      zIndex={998}
      bg={isDark ? `brand.${platform}.900` : `brand.${platform}.500`}
      backdropFilter="blur(8px)"
      boxShadow="lg"
      overflow="hidden"
      borderBottom="1px solid"
      borderColor={isDark ? `brand.${platform}.800` : `brand.${platform}.400`}
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
        {[...Array(2)].map((_, repeatIndex) => (
          <HStack key={repeatIndex} spacing={8}>
            {announcements.data.map((announcement, index) => (
              <HStack
                key={`${repeatIndex}-${index}`}
                spacing={3}
                px={4}
                py={2}
                bg={isDark ? 'whiteAlpha.100' : 'whiteAlpha.200'}
                borderRadius="full"
                cursor={announcement.attributes.link ? 'pointer' : 'default'}
                onClick={() => {
                  if (announcement.attributes.link) {
                    window.open(announcement.attributes.link, '_blank');
                  }
                }}
                _hover={{
                  bg: isDark ? 'whiteAlpha.200' : 'whiteAlpha.300',
                  transform: 'translateY(-1px)',
                }}
                transition="all 0.2s"
              >
                <Text fontSize="xl">
                  {iconMap[announcement.attributes.icon]}
                </Text>
                <Text
                  color={isDark ? 'white' : 'white'}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {announcement.attributes.text}
                </Text>
                <Box
                  w="2px"
                  h="2px"
                  borderRadius="full"
                  bg={isDark ? 'whiteAlpha.400' : 'whiteAlpha.600'}
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