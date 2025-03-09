// components/CryptoNews.js

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Link,
  Image,
  Skeleton,
  Badge,
  useColorModeValue,
  Icon,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  FaExternalLinkAlt, 
  FaNewspaper, 
  FaReddit, 
  FaTwitter, 
  FaGlobe,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const CryptoNews = ({ coinId, coinSymbol }) => {
  const { t } = useTranslation('common');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
  if (!coinSymbol) return;
  
  async function fetchCryptoNews() {
    setLoading(true);
    try {
      // First, try your own API route
      let response = await fetch(`/api/crypto-news?coin=${coinSymbol}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.results);
      } else {
        // If the API route fails, optionally try a fallback (e.g., CryptoCompare)
        console.warn("Primary API failed, trying fallback...");
        response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
        if (!response.ok) throw new Error("Fallback API failed");
        const fallbackData = await response.json();
        const transformed = fallbackData.Data.map(item => ({
          id: item.id || item.uuid || item.published_on,
          title: item.title,
          source: item.source,
          created_at: new Date(item.published_on * 1000).toISOString(),
          url: item.url,
          image: item.imageurl,
          domain: item.source,
          votes: { positive: 0, negative: 0 },
          categories: []
        }));
        setNews(transformed);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  }
  
  fetchCryptoNews();
}, [coinSymbol]);

  // Filter news by category if needed
  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.categories.includes(activeCategory));

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Return an appropriate icon based on the domain
  const getSourceIcon = (domain) => {
    if (domain.includes('reddit')) return FaReddit;
    if (domain.includes('twitter')) return FaTwitter;
    return FaGlobe;
  };

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Heading size="md" color="brand.crypto.600">
          {t('latest_news', 'Latest News')}
        </Heading>
        <Button
          rightIcon={<FaExternalLinkAlt />}
          size="xs"
          variant="ghost"
          colorScheme="crypto-outline"
          as={Link}
          href={`https://cryptopanic.com/news/${coinSymbol ? coinSymbol.toLowerCase() : 'bitcoin'}/`}
          isExternal
        >
          {t('view_all', 'View All')}
        </Button>
      </HStack>
      
      {loading ? (
        <VStack spacing={4} align="stretch">
          {[1, 2, 3].map(i => (
            <HStack key={i} spacing={3}>
              <Skeleton height="70px" width="70px"/>
              <Box flex="1">
                <Skeleton height="20px" mb={2} />
                <Skeleton height="15px" width="60%" />
                <Skeleton height="15px" width="40%" mt={1} />
              </Box>
            </HStack>
          ))}
        </VStack>
      ) : filteredNews.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {filteredNews.map(item => (
            <Link key={item.id} href={item.url} isExternal _hover={{ textDecoration: 'none' }}>
              <Box
                p={3}
                boxShadow="sm"
                _hover={{ borderColor: 'brand.crypto.400', boxShadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s ease-in-out' }}
                transition="all 0.2s ease-in-out"
              >
                <HStack spacing={3} align="start">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    boxSize="70px" 
                    borderRadius="md" 
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/70?text=News" 
                  />
                  <Box flex="1">
                    <Text fontWeight="semibold" fontSize="sm" noOfLines={2} color={textColor}>
                      {item.title}
                    </Text>
                    <HStack fontSize="xs" color={subtitleColor} mt={1}>
                      <Icon as={getSourceIcon(item.domain)} />
                      <Text>{item.source}</Text>
                      <Text>•</Text>
                      <Text>{formatRelativeTime(item.created_at)}</Text>
                    </HStack>
                    <HStack mt={1} spacing={2}>
                      {item.categories.map(category => (
                        <Badge key={category} colorScheme="crypto-solid" variant="subtle" fontSize="2xs">
                          {category}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </Link>
          ))}
        </VStack>
      ) : (
        <Box textAlign="center" py={8}>
          <Icon as={FaNewspaper} boxSize={10} color="gray.300" mb={4} />
          <Text>{t('no_news_found', 'No news found')}</Text>
          <Text fontSize="sm" color="gray.500">
            {t('check_back_later', 'Check back later for updates on')} {coinSymbol || 'crypto'}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CryptoNews;
