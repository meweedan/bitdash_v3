import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Spinner,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useColorMode,
  useBreakpointValue,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Image,
  Link,
  Alert,
  AlertIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  useToast
} from '@chakra-ui/react';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  ExternalLinkIcon,
  InfoIcon,
  TimeIcon,
  StarIcon
} from '@chakra-ui/icons';
import {
  FaNewspaper,
  FaRegNewspaper,
  FaChartLine,
  FaGlobeAmericas,
  FaFilter,
  FaCalendarAlt,
  FaStar,
  FaDollarSign,
  FaEuroSign,
  FaPoundSign,
  FaYenSign,
  FaMoneyBillWave
} from 'react-icons/fa';
import { format, parseISO, startOfToday, endOfDay, addDays, isAfter, isBefore, isToday } from 'date-fns';
import Head from 'next/head';
import NextLink from 'next/link';
import Layout from '@/components/Layout';
import ForexRates from '@/components/ForexRates';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'forex'])),
    },
  };
}

// Currency icons mapping
const currencyIcons = {
  USD: FaDollarSign,
  EUR: FaEuroSign,
  GBP: FaPoundSign,
  JPY: FaYenSign,
  DEFAULT: FaMoneyBillWave
};

// Impact level colors
const impactColors = {
  high: "red",
  medium: "orange",
  low: "green"
};

export default function ForexEconomicCalendar() {
  const { t } = useTranslation(['common', 'forex']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();

  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const cardColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  // State variables
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [filter, setFilter] = useState({
    country: "all",
    currency: "all",
    impact: "all",
    search: "",
    dateRange: "today"
  });
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [timeframe, setTimeframe] = useState("week");

  // Options
  const currencyOptions = [
    { label: t('forex:allCurrencies', 'All Currencies'), value: "all" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "JPY", value: "JPY" },
    { label: "AUD", value: "AUD" },
    { label: "CAD", value: "CAD" },
    { label: "CHF", value: "CHF" },
    { label: "NZD", value: "NZD" }
  ];

  const countryOptions = [
    { label: t('forex:allCountries', 'All Countries'), value: "all" },
    { label: t('forex:unitedStates', 'United States'), value: "US" },
    { label: t('forex:eurozone', 'Eurozone'), value: "EU" },
    { label: t('forex:unitedKingdom', 'United Kingdom'), value: "UK" },
    { label: t('forex:japan', 'Japan'), value: "JP" },
    { label: t('forex:australia', 'Australia'), value: "AU" },
    { label: t('forex:canada', 'Canada'), value: "CA" },
    { label: t('forex:switzerland', 'Switzerland'), value: "CH" },
    { label: t('forex:newZealand', 'New Zealand'), value: "NZ" },
    { label: t('forex:china', 'China'), value: "CN" }
  ];

  const impactOptions = [
    { label: t('forex:allImpacts', 'All Impacts'), value: "all" },
    { label: t('forex:highImpact', 'High Impact'), value: "high" },
    { label: t('forex:mediumImpact', 'Medium Impact'), value: "medium" },
    { label: t('forex:lowImpact', 'Low Impact'), value: "low" }
  ];

  const dateRangeOptions = [
    { label: t('forex:today', 'Today'), value: "today" },
    { label: t('forex:tomorrow', 'Tomorrow'), value: "tomorrow" },
    { label: t('forex:thisWeek', 'This Week'), value: "week" },
    { label: t('forex:nextWeek', 'Next Week'), value: "nextWeek" },
  ];

  // Fetch economic calendar events using TradingEconomics' free API via your API route
  useEffect(() => {
    const fetchEconomicCalendar = async () => {
      try {
        setLoadingEvents(true);
        const res = await fetch('/api/calendar');
        if (!res.ok) {
          throw new Error(`Error fetching economic calendar: ${res.statusText}`);
        }
        const data = await res.json();
        // Map TradingEconomics data to expected structure.
        // Use Importance field to derive impact:
        const mappedData = data.map(item => ({
        id: item.CalendarId || `${item.Event}_${item.Date}`,
        event: item.Event,
        country: item.Country,
        // If Currency is provided (non-empty), use it; otherwise use the country name.
        currency: item.Currency && item.Currency.trim() ? item.Currency : (item.Country || "N/A"),
        impact: item.Importance === 1 ? "high" : item.Importance === 2 ? "medium" : "low",
        actual: item.Actual,
        forecast: item.Forecast,
        previous: item.Previous,
        date: item.Date, // Format: "YYYY-MM-DDT..."
        time: item.Date.split("T")[1] || item.Time
        }));
        setCalendarEvents(mappedData);
        setLoadingEvents(false);
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
        toast({
          title: t('forex:errorFetchingCalendar', 'Error fetching economic calendar'),
          description: error.message || 'Unknown error',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoadingEvents(false);
      }
    };
    fetchEconomicCalendar();
  }, [t, toast]);

  // Fetch forex news using fetch from Finnhub (free tier)
  useEffect(() => {
    const fetchForexNews = async () => {
      try {
        setLoadingNews(true);
        const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!API_KEY) {
          throw new Error("Finnhub API key is missing. Please set NEXT_PUBLIC_FINNHUB_API_KEY in your environment.");
        }
        const res = await fetch(`https://finnhub.io/api/v1/news?category=forex&token=${API_KEY}`);
        if (!res.ok) {
          throw new Error(`Error fetching forex news: ${res.statusText}`);
        }
        const data = await res.json();
        const articles = data.map(article => ({
          id: article.id,
          title: article.headline,
          description: article.summary,
          source: { name: article.source },
          url: article.url,
          urlToImage: article.image,
          publishedAt: new Date(article.datetime * 1000).toISOString()
        }));
        setNews(articles);
        setLoadingNews(false);
      } catch (error) {
        console.error('Error fetching forex news:', error);
        toast({
          title: t('forex:errorFetchingNews', 'Error fetching forex news'),
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoadingNews(false);
      }
    };
    fetchForexNews();
  }, [t, toast]);

  // Filter events based on user selection
  const filteredEvents = useMemo(() => {
    if (!calendarEvents.length) return [];
    
    let filtered = [...calendarEvents];
    const today = startOfToday();
    const tomorrow = addDays(today, 1);
    const endOfWeek = addDays(today, 7);
    const nextWeekStart = addDays(today, 7);
    const nextWeekEnd = addDays(today, 14);
    
    if (filter.dateRange === "today") {
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.date);
        return isToday(eventDate);
      });
    } else if (filter.dateRange === "tomorrow") {
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, endOfDay(today)) && isBefore(eventDate, endOfDay(tomorrow));
      });
    } else if (filter.dateRange === "week") {
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, today) && isBefore(eventDate, endOfWeek);
      });
    } else if (filter.dateRange === "nextWeek") {
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, nextWeekStart) && isBefore(eventDate, nextWeekEnd);
      });
    }
    
    if (filter.currency !== "all") {
      filtered = filtered.filter(event => event.currency === filter.currency);
    }
    
    if (filter.country !== "all") {
      filtered = filtered.filter(event => event.country === filter.country);
    }
    
    if (filter.impact !== "all") {
      filtered = filtered.filter(event => event.impact === filter.impact);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.event.toLowerCase().includes(searchLower) ||
        event.currency.toLowerCase().includes(searchLower) ||
        event.country.toLowerCase().includes(searchLower)
      );
    }
    
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return filtered;
  }, [calendarEvents, filter]);

  // Toggle favorite event
  const toggleFavorite = (eventId) => {
    setFavoriteEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Format event date for display
  const formatEventDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMM d');
    } catch (e) {
      return dateString;
    }
  };

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {};
    filteredEvents.forEach(event => {
      const dateKey = formatEventDate(event.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  return (
    <>
      <Head>
        <title>{t('forex:economicCalendarTitle', 'Economic Calendar | Forex Analysis | BitDash')}</title>
        <meta
          name="description"
          content={t('forex:economicCalendarDescription', 'Stay updated with the latest economic events and forex news that impact currency markets. BitDash economic calendar provides real-time updates and market analysis.')}
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
                  bgGradient={isDark ?
                    "linear(to-r, brand.forex.400, brand.forex.700)" :
                    "linear(to-r, brand.forex.700, brand.forex.400)"
                  }
                  bgClip="text"
                >
                  {t('forex:economicCalendar', 'Economic Calendar')}
                </Heading>
                <Text color="brand.forex.400" maxW="2xl">
                  {t('forex:economicCalendarSubtitle', 'Stay informed with upcoming economic events that impact currency markets')}
                </Text>
              </VStack>
            </HStack>

            {/* Filter Section */}
            <Card mb={6} variant="outline">
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
                  gap={4}
                >
                  <GridItem>
                    <InputGroup>
                      <InputLeftElement>
                        <SearchIcon color="brand.forex.400" />
                      </InputLeftElement>
                      <Input
                        placeholder={t('forex:searchEvents', 'Search events...')}
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                      />
                    </InputGroup>
                  </GridItem>

                  <GridItem>
                    <Select
                      value={filter.dateRange}
                      onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
                      icon={<CalendarIcon />}
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>

                  <GridItem>
                    <Select
                      value={filter.currency}
                      onChange={(e) => setFilter({ ...filter, currency: e.target.value })}
                      icon={<ChevronDownIcon />}
                    >
                      {currencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>

                  <GridItem>
                    <Select
                      value={filter.impact}
                      onChange={(e) => setFilter({ ...filter, impact: e.target.value })}
                      icon={<ChevronDownIcon />}
                    >
                      {impactOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Main Content */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              {/* Economic Calendar Section */}
              <GridItem>
                <Card variant="outline">
                  <CardHeader pb={2}>
                    <HStack justify="space-between">
                      <Heading size="md">
                        <Icon as={FaCalendarAlt} mr={2} color="brand.forex.400" />
                        {t('forex:upcomingEvents', 'Upcoming Economic Events')}
                      </Heading>
                      <HStack>
                        <Text fontSize="sm" color="brand.forex.400">
                          {filteredEvents.length} {t('forex:eventsFound', 'events found')}
                        </Text>
                      </HStack>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    {loadingEvents ? (
                      <Flex justify="center" py={10}>
                        <Spinner size="xl" color="brand.forex.400" />
                      </Flex>
                    ) : filteredEvents.length === 0 ? (
                      <Flex direction="column" align="center" justify="center" py={10}>
                        <Icon as={CalendarIcon} boxSize={10} color="brand.forex.400" mb={4} />
                        <Text color="brand.forex.400">
                          {t('forex:noEventsFound', 'No economic events found for your criteria')}
                        </Text>
                        <Button
                          mt={4}
                          variant="outline"
                          leftIcon={<FaFilter />}
                          onClick={() => setFilter({
                            country: "all",
                            currency: "all",
                            impact: "all",
                            search: "",
                            dateRange: "week"
                          })}
                        >
                          {t('forex:clearFilters', 'Clear Filters')}
                        </Button>
                      </Flex>
                    ) : (
                      <VStack spacing={6} align="stretch">
                        {Object.entries(eventsByDate).map(([date, events]) => (
                          <Box key={date}>
                            <HStack
                              bg={isDark ? "gray.700" : "gray.100"}
                              p={2}
                              borderRadius="md"
                              mb={2}
                            >
                              <Icon as={CalendarIcon} />
                              <Text fontWeight="medium">{date}</Text>
                            </HStack>

                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>{t('forex:time', 'Time')}</Th>
                                  <Th>{t('forex:country', 'Country')}</Th>
                                  <Th>{t('forex:event', 'Event')}</Th>
                                  <Th>{t('forex:impact', 'Impact')}</Th>
                                  <Th>{t('forex:actual', 'Actual')}</Th>
                                  <Th>{t('forex:forecast', 'Forecast')}</Th>
                                  <Th>{t('forex:previous', 'Previous')}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {events.map((event) => {
                                  return (
                                    <Tr key={event.id}>
                                      <Td>
                                        <HStack>
                                          <Icon as={TimeIcon} color="brand.forex.400" />
                                          <Text>{event.time}</Text>
                                        </HStack>
                                      </Td>
                                      <Td>
                                        <Tag
                                          size="md"
                                          colorScheme={
                                            event.currency === "USD" ? "green" :
                                            event.currency === "EUR" ? "blue" :
                                            event.currency === "GBP" ? "purple" :
                                            event.currency === "JPY" ? "red" :
                                            "gray"
                                          }
                                          borderRadius="full"
                                        >
                                          <TagLabel>{event.currency}</TagLabel>
                                        </Tag>
                                      </Td>
                                      <Td>
                                        <HStack>
                                          <Text fontWeight="medium">{event.event}</Text>
                                          <Icon
                                            as={StarIcon}
                                            color={favoriteEvents.includes(event.id) ? "yellow.400" : "gray.300"}
                                            cursor="pointer"
                                            onClick={() => toggleFavorite(event.id)}
                                          />
                                        </HStack>
                                      </Td>
                                      <Td>
                                        <Badge
                                          colorScheme={impactColors[event.impact]}
                                          variant="solid"
                                          px={2}
                                          py={1}
                                          borderRadius="full"
                                        >
                                          {event.impact}
                                        </Badge>
                                      </Td>
                                      <Td>
                                        <Text
                                          fontWeight="bold"
                                          color={
                                            !event.actual ? "gray.400" :
                                            event.previous && parseFloat(event.actual) > parseFloat(event.previous) ? "green.500" :
                                            event.previous && parseFloat(event.actual) < parseFloat(event.previous) ? "red.500" :
                                            "blue.500"
                                          }
                                        >
                                          {event.actual || "-"}
                                        </Text>
                                      </Td>
                                      <Td>{event.forecast || "-"}</Td>
                                      <Td>{event.previous || "-"}</Td>
                                    </Tr>
                                  );
                                })}
                              </Tbody>
                            </Table>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </GridItem>

              {/* Market News Section */}
              <GridItem>
                <Card variant="outline">
                  <CardHeader pb={2}>
                    <HStack justify="space-between">
                      <Heading size="md">
                        <Icon as={FaNewspaper} mr={2} color="brand.forex.400" />
                        {t('forex:latestNews', 'Latest Forex News')}
                      </Heading>
                      <Button
                        as={NextLink}
                        href="/ldn/news"
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronRightIcon />}
                      >
                        {t('forex:viewAll', 'View All')}
                      </Button>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    {loadingNews ? (
                      <Flex justify="center" py={10}>
                        <Spinner size="xl" color="blue.500" />
                      </Flex>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {news.slice(0, 5).map((article) => (
                          <Card
                            key={article.id}
                            variant="outline"
                            direction="row"
                            overflow="hidden"
                            size="sm"
                          >
                            <Image
                              objectFit="cover"
                              maxW={{ base: "100px", sm: "120px" }}
                              src={article.urlToImage}
                              alt={article.title}
                            />
                            <Stack>
                              <CardBody py={2} px={3}>
                                <Heading size="xs" mb={1}>
                                  <Link
                                    href={article.url}
                                    isExternal
                                    color={isDark ? "blue.300" : "blue.600"}
                                  >
                                    {article.title}
                                  </Link>
                                </Heading>
                                <Text fontSize="xs" noOfLines={2}>
                                  {article.description}
                                </Text>
                                <HStack mt={2} spacing={2}>
                                  <Badge fontSize="10px" colorScheme="blue">
                                    {article.source.name}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.500">
                                    {format(new Date(article.publishedAt), 'MMM d, h:mm a')}
                                  </Text>
                                </HStack>
                              </CardBody>
                            </Stack>
                          </Card>
                        ))}
                        <Button
                          as={NextLink}
                          href="/ldn/analysis/news"
                          variant="forex-outline"
                          size="sm"
                          rightIcon={<ChevronRightIcon />}
                        >
                          {t('forex:moreNews', 'More News')}
                        </Button>
                      </VStack>
                    )}
                  </CardBody>
                </Card>

                {/* Analysis Summary */}
                <Card variant="outline" mt={6}>
                  <CardHeader pb={2}>
                    <HStack justify="space-between">
                      <Heading size="md">
                        <Icon as={FaChartLine} mr={2} color="brand.forex.400" />
                        {t('forex:marketSummary', 'Market Summary')}
                      </Heading>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                        <Box>
                          <ForexRates />
                        </Box>
                      <Divider />
                      <Button
                        as={NextLink}
                        href="/ldn/analysis"
                        variant="outline"
                        colorScheme="blue"
                        size="sm"
                        rightIcon={<ChevronRightIcon />}
                      >
                        {t('forex:fullAnalysis', 'Full Market Analysis')}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Disclaimer Section */}
            <Alert status="info" mt={8} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                {t('forex:disclaimer', 'Disclaimer: Economic calendar events and forex news are provided for informational purposes only. Trading foreign exchange carries high risk and may not be suitable for all investors. Past performance is not indicative of future results.')}
              </Text>
            </Alert>
          </Container>
        </Box>
      </Layout>
    </>
  );
}
