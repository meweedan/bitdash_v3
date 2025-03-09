import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  HStack,
  VStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Spinner,
  Icon,
  Divider,
  Input,
  InputGroup,
  useToast,
  useBreakpointValue,
  Flex,
  InputLeftElement,
  useColorMode,
  Image,
  Link,
  Alert,
  AlertIcon,
  Select,
  Skeleton
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  ExternalLinkIcon,
  TimeIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import {
  FaNewspaper,
  FaChartLine,
  FaFilter,
  FaMoneyBillWave,
  FaRss,
  FaTwitter,
  FaArrowUp,
  FaArrowDown,
  FaRegNewspaper
} from 'react-icons/fa';
import { format, subDays } from 'date-fns';
import Head from 'next/head';
import NextLink from 'next/link';
import Layout from '@/components/Layout';
import axios from 'axios';
import Parser from 'rss-parser';

// RSS feed URLs for forex news
const RSS_FEEDS = [
  {
    url: 'https://www.forexlive.com/feed/',
    source: 'Forexlive'
  },
  {
    url: 'https://www.actionforex.com/feed/',
    source: 'ActionForex'
  },
];

// A helper function to extract an image URL from HTML content
function extractImageFromContent(content) {
  if (!content) return 'https://via.placeholder.com/800x450?text=Forex+News';
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...content.matchAll(imgRegex)];
  if (matches.length > 0) {
    // Return the first image URL that doesn't seem like an icon
    for (const match of matches) {
      const imgUrl = match[1];
      if (!imgUrl.includes('icon') && !imgUrl.includes('logo') && !imgUrl.includes('avatar')) {
        return imgUrl;
      }
    }
    return matches[0][1];
  }
  return 'https://via.placeholder.com/800x450?text=Forex+News';
}

// Fetch RSS feed data on the server side
export async function getServerSideProps({ locale }) {
  try {
    const parser = new Parser();
    const allArticles = [];
    // Use a reliable proxy to bypass any CORS issues
    const proxyUrl = "https://api.allorigins.hexocode.repl.co/get?disableCache=true&url=";
    
    // Create an array of promises for each feed
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        // Fetch via the proxy
        const response = await axios.get(proxyUrl + encodeURIComponent(feed.url));
        const feedContent = await parser.parseString(response.data);
        
        // Map feed items to our article format
        const articles = feedContent.items.map(item => ({
          id: item.guid || item.id || item.link,
          title: item.title,
          description: item.contentSnippet || item.summary || 
            (item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 200) : ''),
          url: item.link,
          published_at: item.pubDate || item.isoDate,
          image_url: extractImageFromContent(item.content || item['content:encoded'] || ''),
          source: feed.source,
          // We'll determine tickers, sentiment, and category on the client
          tickers: [],
          sentiment: null,
          categories: []
        }));
        return articles;
      } catch (error) {
        console.error(`Error fetching RSS feed from ${feed.source}:`, error);
        return [];
      }
    });
    
    const results = await Promise.all(feedPromises);
    results.forEach(feedItems => {
      allArticles.push(...feedItems);
    });
    
    // Sort articles by publication date (newest first)
    allArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'forex'])),
        initialNewsData: allArticles || []
      },
    };
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'forex'])),
        initialNewsData: []
      },
    };
  }
}

// Currency pairs and news categories (for filtering)
const forexPairs = [
  { value: 'all', label: 'All Pairs', primary: null },
  { value: 'eurusd', label: 'EUR/USD', primary: 'EUR', secondary: 'USD' },
  { value: 'gbpusd', label: 'GBP/USD', primary: 'GBP', secondary: 'USD' },
  { value: 'usdjpy', label: 'USD/JPY', primary: 'USD', secondary: 'JPY' },
  { value: 'audusd', label: 'AUD/USD', primary: 'AUD', secondary: 'USD' },
  { value: 'usdcad', label: 'USD/CAD', primary: 'USD', secondary: 'CAD' },
  { value: 'usdchf', label: 'USD/CHF', primary: 'USD', secondary: 'CHF' },
  { value: 'nzdusd', label: 'NZD/USD', primary: 'NZD', secondary: 'USD' },
  { value: 'eurgbp', label: 'EUR/GBP', primary: 'EUR', secondary: 'GBP' },
  { value: 'eurjpy', label: 'EUR/JPY', primary: 'EUR', secondary: 'JPY' },
  { value: 'gbpjpy', label: 'GBP/JPY', primary: 'GBP', secondary: 'JPY' }
];

const newsCategories = [
  { value: 'all', label: 'All News' },
  { value: 'market', label: 'Market News' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'central-banks', label: 'Central Banks' },
  { value: 'economy', label: 'Economy' }
];

// Helper to extract currency pairs from article text
const extractCurrencyPairs = (article) => {
  const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'];
  const text = `${article.title} ${article.description || ''}`;
  const foundPairs = majorPairs.filter(pair => text.includes(pair));
  // If none found, try a fallback: if text mentions "euro", default to EUR/USD, etc.
  if (foundPairs.length === 0) {
    if (text.toLowerCase().includes('euro')) foundPairs.push('EUR/USD');
    else if (text.toLowerCase().includes('pound')) foundPairs.push('GBP/USD');
    else if (text.toLowerCase().includes('yen')) foundPairs.push('USD/JPY');
  }
  return foundPairs;
};

// Helper to determine sentiment based on keywords
const determineSentiment = (article) => {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  const bullishWords = ['rise', 'rises', 'rally', 'soar', 'gain', 'bullish'];
  const bearishWords = ['fall', 'falls', 'decline', 'drop', 'bearish'];
  const bullishCount = bullishWords.filter(word => text.includes(word)).length;
  const bearishCount = bearishWords.filter(word => text.includes(word)).length;
  if (bullishCount > bearishCount) return 'bullish';
  if (bearishCount > bullishCount) return 'bearish';
  return 'neutral';
};

// Helper to determine category based on keywords
const determineCategory = (article) => {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  if (text.includes('central bank') || text.includes('fed') || text.includes('ecb')) return 'central-banks';
  if (text.includes('gdp') || text.includes('inflation') || text.includes('unemployment')) return 'economy';
  if (text.includes('analysis') || text.includes('forecast') || text.includes('trend')) return 'analysis';
  return 'market';
};

export default function ForexNewsPage({ initialNewsData }) {
  const { t, i18n } = useTranslation(['common', 'forex']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();

  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  // State variables
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [filter, setFilter] = useState({
    pair: 'all',
    category: 'all',
    search: '',
    timeframe: '7d'
  });
  const [featured, setFeatured] = useState(null);

  // Timeframe options
  const timeframeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '3d', label: 'Last 3 Days' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Process incoming news data
  useEffect(() => {
    const processNewsData = () => {
      try {
        setLoadingNews(true);
        if (initialNewsData && initialNewsData.length > 0) {
          const processedNews = initialNewsData.map(article => {
            const tickers = extractCurrencyPairs(article);
            const sentiment = determineSentiment(article);
            const category = determineCategory(article);
            return {
              ...article,
              tickers,
              sentiment,
              categories: [category]
            };
          });
          setNews(processedNews);
          if (processedNews.length > 0) {
            // Choose the first article with a major pair as featured, if possible
            const majorPairArticle = processedNews.find(article =>
              article.tickers && article.tickers.some(ticker =>
                ['EUR/USD', 'GBP/USD', 'USD/JPY'].includes(ticker)
              )
            );
            setFeatured(majorPairArticle || processedNews[0]);
          }
        }
        setLoadingNews(false);
      } catch (error) {
        console.error('Error processing news data:', error);
        toast({
          title: t('forex:errorProcessingNews', 'Error processing forex news'),
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoadingNews(false);
      }
    };
    processNewsData();
  }, [initialNewsData, t, toast]);

  // Filter news articles
  const filteredNews = useMemo(() => {
    if (!news.length) return [];
    let filtered = [...news];

    if (filter.pair !== 'all') {
      const selectedPair = forexPairs.find(p => p.value === filter.pair);
      if (selectedPair && selectedPair.primary && selectedPair.secondary) {
        const pairString = `${selectedPair.primary}/${selectedPair.secondary}`;
        filtered = filtered.filter(article =>
          article.tickers && article.tickers.some(ticker => ticker === pairString)
        );
      }
    }

    if (filter.category !== 'all') {
      filtered = filtered.filter(article =>
        article.categories && article.categories.includes(filter.category)
      );
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        (article.description && article.description.toLowerCase().includes(searchLower))
      );
    }

    const now = new Date();
    let daysToSubtract = 7;
    if (filter.timeframe === '1d') daysToSubtract = 1;
    else if (filter.timeframe === '3d') daysToSubtract = 3;
    else if (filter.timeframe === '7d') daysToSubtract = 7;
    else if (filter.timeframe === '30d') daysToSubtract = 30;
    const cutoffDate = subDays(now, daysToSubtract);
    filtered = filtered.filter(article => new Date(article.published_at) >= cutoffDate);

    filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    return filtered;
  }, [news, filter]);

  return (
    <>
      <Head>
        <title>{t('forex:newsPageTitle', 'Forex News | Currency Market Updates | BitDash')}</title>
        <meta 
          name="description" 
          content={t('forex:newsPageDescription', 'Stay updated with the latest forex news, currency market analysis, and expert opinions. Get real-time updates on major currency pairs including EUR/USD, GBP/USD, and USD/JPY.')}
        />
      </Head>
      <Layout>
        <Box w="full" minH="100vh">
          <Container maxW="container.xl" py={6}>
            {/* Page Header */}
            <HStack mb={6} justify="space-between" wrap="wrap">
              <VStack align="start" spacing={1}>
                <Heading 
                  as="h1" 
                  size={headingSize} 
                  fontWeight="bold"
                  bgGradient={isDark ? "linear(to-r, brand.forex.400, brand.forex.700)" : "linear(to-r, brand.forex.700, brand.forex.400)"}
                  bgClip="text"
                >
                  {t('forex:forexNews', 'Forex News')}
                </Heading>
                <Text color="gray.500" maxW="2xl">
                  {t('forex:forexNewsSubtitle', 'The latest news and analysis from the global currency markets')}
                </Text>
              </VStack>
              <HStack>
                <Button
                  as={NextLink}
                  href="/ldn/analysis/economic-calendar"
                  variant="forex-outline"
                  size="sm"
                  leftIcon={<Icon as={FaRegNewspaper} />}
                >
                  {t('forex:economicCalendar', 'Economic Calendar')}
                </Button>
                <Button
                  as={NextLink}
                  href="/ldn/analysis"
                  variant="forex-outline"
                  size="sm"
                  leftIcon={<Icon as={FaChartLine} />}
                >
                  {t('forex:marketAnalysis', 'Market Analysis')}
                </Button>
              </HStack>
            </HStack>

            {/* Filter Section */}
            <Card mb={6} variant="forex-outline">
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }} gap={4}>
                  <GridItem>
                    <InputGroup>
                      <InputLeftElement>
                        <SearchIcon color="brand.forex.500" />
                      </InputLeftElement>
                      <Input 
                        placeholder={t('forex:searchNews', 'Search news...')}
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                      />
                    </InputGroup>
                  </GridItem>
                  <GridItem>
                    <Select 
                      value={filter.pair}
                      onChange={(e) => setFilter({ ...filter, pair: e.target.value })}
                      icon={<FaMoneyBillWave />}
                    >
                      {forexPairs.map(pair => (
                        <option key={pair.value} value={pair.value}>
                          {pair.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Select 
                      value={filter.category}
                      onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                      {newsCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem>
                    <Select 
                      value={filter.timeframe}
                      onChange={(e) => setFilter({ ...filter, timeframe: e.target.value })}
                    >
                      {timeframeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Featured Article Section */}
            {loadingNews ? (
              <Card mb={6} variant="forex-outline" overflow="hidden">
                <Skeleton height="400px" />
              </Card>
            ) : featured ? (
              <Card mb={6} variant="forex-outline" overflow="hidden" position="relative">
                <Box 
                  bg="linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 80%)"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  zIndex={1}
                />
                <Image 
                  src={featured.image_url}
                  alt={featured.title}
                  w="full"
                  h={{ base: "300px", md: "400px" }}
                  objectFit="cover"
                />
                <Box 
                  position="absolute" 
                  bottom={0} 
                  left={0} 
                  right={0} 
                  p={6}
                  zIndex={2}
                >
                  <HStack mb={2}>
                    <Badge color="brand.forex.400" px={2} py={1} borderRadius="full">
                      {t('forex:featured', 'Featured')}
                    </Badge>
                    {featured.sentiment && (
                      <Badge colorScheme={featured.sentiment === 'bullish' ? 'green' : featured.sentiment === 'bearish' ? 'red' : 'gray'} px={2} py={1} borderRadius="full">
                        <HStack spacing={1}>
                          <Icon as={featured.sentiment === 'bullish' ? FaArrowUp : featured.sentiment === 'bearish' ? FaArrowDown : InfoIcon} boxSize={3} />
                          <Text>{featured.sentiment}</Text>
                        </HStack>
                      </Badge>
                    )}
                    {featured.tickers && featured.tickers.slice(0, 2).map(ticker => (
                      <Badge key={ticker} px={2} py={1} borderRadius="full" variant="forex-outline">
                        {ticker}
                      </Badge>
                    ))}
                  </HStack>
                  <Heading as="h2" size="xl" color="white" mb={2} textShadow="0px 0px 8px rgba(0,0,0,0.5)">
                    {featured.title}
                  </Heading>
                  <Text color="gray.100" mb={4} noOfLines={2} textShadow="0px 0px 8px rgba(0,0,0,0.5)">
                    {featured.description}
                  </Text>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Text color="gray.300">{featured.source}</Text>
                      <Text color="gray.300">{format(new Date(featured.published_at), 'MMM d, yyyy')}</Text>
                    </HStack>
                    <Button 
                      as={Link}
                      href={featured.url}
                      isExternal
                      rightIcon={<ExternalLinkIcon />}
                      variant="forex-outline"
                      size="sm"
                    >
                      {t('forex:readMore', 'Read More')}
                    </Button>
                  </HStack>
                </Box>
              </Card>
            ) : null}

            {/* News Articles Grid */}
            <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={6}>
              {/* Main News Content */}
              <GridItem>
                <Card variant="forex-outline">
                  <CardHeader pb={2}>
                    <HStack justify="space-between">
                      <Heading size="md">
                        <Icon as={FaNewspaper} mr={2} color="brand.forex.400" />
                        {t('forex:latestNews', 'Latest News')}
                      </Heading>
                      <Text fontSize="sm" color="gray.500">
                        {filteredNews.length} {t('forex:articlesFound', 'articles found')}
                      </Text>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    {loadingNews ? (
                      <VStack spacing={4}>
                        {[1, 2, 3, 4].map(item => (
                          <Skeleton key={item} height="150px" width="100%" />
                        ))}
                      </VStack>
                    ) : filteredNews.length === 0 ? (
                      <Flex direction="column" align="center" justify="center" py={10}>
                        <Icon as={FaNewspaper} boxSize={10} color="gray.400" mb={4} />
                        <Text color="gray.500">
                          {t('forex:noNewsFound', 'No news articles found for your criteria')}
                        </Text>
                        <Button 
                          mt={4} 
                          variant="forex-outline" 
                          leftIcon={<FaFilter />}
                          onClick={() => setFilter({ pair: 'all', category: 'all', search: '', timeframe: '7d' })}
                        >
                          {t('forex:clearFilters', 'Clear Filters')}
                        </Button>
                      </Flex>
                    ) : (
                      <VStack spacing={6} align="stretch">
                        {filteredNews.map(article => (
                          <Card key={article.id} variant="forex-outline" direction={{ base: 'column', sm: 'row' }} overflow="hidden">
                            <Image
                              objectFit="cover"
                              maxW={{ base: '100%', sm: '200px' }}
                              maxH={{ base: '200px', sm: 'auto' }}
                              src={article.image_url}
                              alt={article.title}
                              fallbackSrc="https://via.placeholder.com/200x150?text=Forex+News"
                            />
                            <Stack flex={1}>
                              <CardBody>
                                <HStack mb={2} wrap="wrap">
                                  {article.sentiment && (
                                    <Badge 
                                      colorScheme={article.sentiment === 'bullish' ? 'green' : article.sentiment === 'bearish' ? 'red' : 'gray'} 
                                      variant="solid" 
                                      px={2} 
                                      py={1} 
                                      borderRadius="full"
                                    >
                                      <HStack spacing={1}>
                                        <Icon as={article.sentiment === 'bullish' ? FaArrowUp : article.sentiment === 'bearish' ? FaArrowDown : InfoIcon} boxSize={3} />
                                        <Text>{article.sentiment}</Text>
                                      </HStack>
                                    </Badge>
                                  )}
                                  {article.tickers && article.tickers.map(ticker => (
                                    <Badge key={ticker} px={2} py={1} borderRadius="full" variant="forex-outline" colorScheme="blue">
                                      {ticker}
                                    </Badge>
                                  ))}
                                  <Badge px={2} py={1} borderRadius="full" variant="subtle" colorScheme="purple">
                                    {article.categories && article.categories[0]}
                                  </Badge>
                                </HStack>
                                <Heading size="md" mb={2}>
                                  <Link href={article.url} isExternal color={isDark ? "brand.forex.400" : "brand.forex.400"}>
                                    {article.title}
                                  </Link>
                                </Heading>
                                <Text noOfLines={2} mb={2}>
                                  {article.description}
                                </Text>
                                <HStack spacing={4} wrap="wrap">
                                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                    {article.source}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {format(new Date(article.published_at), 'MMM d, yyyy, h:mm a')}
                                  </Text>
                                </HStack>
                              </CardBody>
                              <CardFooter pt={0}>
                                <Button 
                                  as={Link}
                                  href={article.url}
                                  isExternal
                                  rightIcon={<ExternalLinkIcon />}
                                  variant="forex-outline"
                                  colorScheme="blue"
                                  size="sm"
                                >
                                  {t('forex:readFull', 'Read Full Article')}
                                </Button>
                              </CardFooter>
                            </Stack>
                          </Card>
                        ))}
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
              
              {/* Sidebar */}
              <GridItem>
                {/* News Sources */}
                <Card variant="forex-outline" mb={6}>
                  <CardHeader pb={2}>
                    <Heading size="md">
                      <Icon as={FaRss} mr={2} color="brand.forex.500" />
                      {t('forex:newsSources', 'News Sources')}
                    </Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={2} align="stretch">
                      {RSS_FEEDS.map(feed => (
                        <Button 
                          key={feed.source}
                          as={Link}
                          href={feed.url}
                          isExternal
                          variant="ghost"
                          justifyContent="flex-start"
                          rightIcon={<ExternalLinkIcon />}
                          size="sm"
                        >
                          {feed.source}
                        </Button>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Disclaimer Section */}
            <Alert status="info" mt={8} borderRadius="md">
              <AlertIcon color="brand.forex.400" />
              <Text fontSize="sm">
                {t('forex:disclaimer', 'Disclaimer: Forex news and analysis are provided for informational purposes only. Trading foreign exchange carries high risk and may not be suitable for all investors. Past performance is not indicative of future results.')}
              </Text>
            </Alert>

            {/* RSS Attribution */}
            <Box mt={12} textAlign="center">
              <Text fontSize="xs" color="gray.500">
                {t('forex:poweredBy', 'Powered by')} {RSS_FEEDS.map(feed => feed.source).join(', ')}
              </Text>
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
}
