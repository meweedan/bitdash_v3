import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Icon,
  Text,
  Badge,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  GiOilDrum, 
  GiGoldBar,
  GiSilverBullet, 
  GiWheat,
  GiCoffeeBeans,
  GiGasStove
} from 'react-icons/gi';
import { FaSort, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const CommodityMarketplace = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [commodities, setCommodities] = useState([]);
  const [filteredCommodities, setFilteredCommodities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const positiveColor = useColorModeValue('green.500', 'green.300');
  const negativeColor = useColorModeValue('red.500', 'red.300');

  // Map of commodities to their icons
  const commodityIcons = {
    'GLD': GiGoldBar,
    'XAU': GiGoldBar,
    'SLV': GiSilverBullet,
    'CL': GiOilDrum,
    'BZ': GiOilDrum,
    'NG': GiGasStove,
    'KC': GiCoffeeBeans,
    'CC': GiCoffeeBeans,
    'HG': GiSilverBullet, // Copper
    'ZS': GiWheat, // Soybeans
    'SB': GiWheat // Sugar
  };

  // Map of commodities to their categories
  const commodityCategories = {
    'GLD': 'precious-metals',
    'XAU': 'precious-metals',
    'SLV': 'precious-metals',
    'CL': 'energy',
    'BZ': 'energy',
    'NG': 'energy',
    'KC': 'agriculture',
    'CC': 'agriculture',
    'HG': 'metals',
    'ZS': 'agriculture',
    'SB': 'agriculture'
  };

  // Map of commodity symbols to their full names
  const commodityNames = {
    'GLD': 'Gold ETF',
    'XAU': 'Gold Spot',
    'SLV': 'Silver ETF',
    'CL': 'WTI Crude Oil',
    'BZ': 'Brent Crude Oil',
    'NG': 'Natural Gas',
    'KC': 'Coffee',
    'CC': 'Cocoa',
    'HG': 'Copper',
    'ZS': 'Soybeans',
    'SB': 'Sugar'
  };

  // Fetch commodities data
  useEffect(() => {
    const fetchCommodityData = async () => {
      setIsLoading(true);
      try {
        // List of Shariah-compliant commodities
        const shariahCompliantCommodities = ['GLD', 'XAU', 'SLV', 'CL', 'BZ', 'NG', 'KC', 'CC', 'HG', 'ZS', 'SB'];
        
        const commoditiesData = [];
        
        // Fetch each commodity's data in parallel
        const promises = shariahCompliantCommodities.map(async (symbol) => {
          try {
            const response = await fetch(`/chart-data/${symbol}_1d.json`);
            if (!response.ok) return null;
            
            const data = await response.json();
            
            // Get the latest price data
            const latestData = data[data.length - 1];
            const previousData = data[data.length - 2];
            
            // Calculate price change
            const price = latestData.close;
            const previousPrice = previousData.close;
            const change = price - previousPrice;
            const changePercent = (change / previousPrice) * 100;
            
            // Get volume data
            const candlesResponse = await fetch(`/chart-data/${symbol}_1d_candles.json`);
            let volume = 0;
            
            if (candlesResponse.ok) {
              const candlesData = await candlesResponse.json();
              const latestCandleData = candlesData[candlesData.length - 1];
              volume = latestCandleData.volume || 0;
            }
            
            return {
              id: symbol,
              name: commodityNames[symbol] || symbol,
              category: commodityCategories[symbol] || 'other',
              price: price,
              change: change,
              changePercent: changePercent,
              volume: volume,
              icon: commodityIcons[symbol] || GiOilDrum
            };
          } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        const validResults = results.filter(result => result !== null);
        
        setCommodities(validResults);
        setFilteredCommodities(validResults);
      } catch (error) {
        console.error('Error fetching commodity data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommodityData();
  }, []);

  // Filter and sort commodities
  useEffect(() => {
    let result = [...commodities];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => item.name.toLowerCase().includes(query) || 
               item.id.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredCommodities(result);
  }, [commodities, searchQuery, sortField, sortDirection, categoryFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const refreshPrices = async () => {
    setIsLoading(true);
    try {
      // Simulate real-time update by refetching all data
      const shariahCompliantCommodities = ['GLD', 'XAU', 'SLV', 'CL', 'BZ', 'NG', 'KC', 'CC', 'HG', 'ZS', 'SB'];
      const commoditiesData = [];
      
      for (const symbol of shariahCompliantCommodities) {
        try {
          const response = await fetch(`/chart-data/${symbol}_1d.json`);
          if (!response.ok) continue;
          
          const data = await response.json();
          
          // Get the latest price data
          const latestData = data[data.length - 1];
          const previousData = data[data.length - 2];
          
          // Calculate price change
          const price = latestData.close;
          const previousPrice = previousData.close;
          const change = price - previousPrice;
          const changePercent = (change / previousPrice) * 100;
          
          // Get volume data
          const candlesResponse = await fetch(`/chart-data/${symbol}_1d_candles.json`);
          let volume = 0;
          
          if (candlesResponse.ok) {
            const candlesData = await candlesResponse.json();
            const latestCandleData = candlesData[candlesData.length - 1];
            volume = latestCandleData.volume || 0;
          }
          
          commoditiesData.push({
            id: symbol,
            name: commodityNames[symbol] || symbol,
            category: commodityCategories[symbol] || 'other',
            price: price,
            change: change,
            changePercent: changePercent,
            volume: volume,
            icon: commodityIcons[symbol] || GiOilDrum
          });
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
        }
      }
      
      setCommodities(commoditiesData);
    } catch (error) {
      console.error('Error refreshing commodity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'energy': return t('commodities.marketplace.category.energy', 'Energy');
      case 'precious-metals': return t('commodities.marketplace.category.preciousMetals', 'Precious Metals');
      case 'metals': return t('commodities.marketplace.category.metals', 'Metals');
      case 'agriculture': return t('commodities.marketplace.category.agriculture', 'Agriculture');
      default: return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'energy': return 'blue';
      case 'precious-metals': return 'yellow';
      case 'metals': return 'purple';
      case 'agriculture': return 'green';
      default: return 'gray';
    }
  };

  const renderPriceChange = (change, changePercent) => {
    const color = change >= 0 ? positiveColor : negativeColor;
    return (
      <HStack>
        <Text color={color} fontWeight="medium">
          {change >= 0 ? '+' : ''}{change.toFixed(2)}
        </Text>
        <Text color={color} fontSize="sm">
          ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
        </Text>
      </HStack>
    );
  };

  return (
    <Box w="full">
      <Tabs variant="line" colorScheme="brand.bittrade" mb={4}>
        <TabList>
          <Tab>{t('commodities.marketplace.tabs.all', 'All Commodities')}</Tab>
          <Tab>{t('commodities.marketplace.tabs.preciousMetals', 'Precious Metals')}</Tab>
          <Tab>{t('commodities.marketplace.tabs.energy', 'Energy')}</Tab>
          <Tab>{t('commodities.marketplace.tabs.agriculture', 'Agriculture')}</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            <Box mb={4} borderRadius="md" p={4} bg={useColorModeValue('blue.50', 'blue.900')} color={useColorModeValue('blue.800', 'blue.100')}>
              <Heading size="sm" mb={2}>
                {t('commodities.marketplace.shariahNotice.title', 'Shariah-Compliant Commodities')}
              </Heading>
              <Text fontSize="sm">
                {t('commodities.marketplace.shariahNotice.description', 'We offer only Shariah-compliant commodities for trading, ensuring all products meet Islamic finance principles. Physical delivery options are available for gold and silver to maintain compliance with Shariah requirements.')}
              </Text>
            </Box>
            
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={4}>
              <Flex mb={{ base: 4, md: 0 }} flex={{ base: 1, md: 2 }}>
                <InputGroup size="md" mr={4} maxW="400px">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder={t('commodities.marketplace.search', 'Search commodities...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderColor={borderColor}
                  />
                </InputGroup>
                <Select
                  size="md"
                  maxW="200px"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  borderColor={borderColor}
                >
                  <option value="all">{t('commodities.marketplace.filter.all', 'All Categories')}</option>
                  <option value="precious-metals">{t('commodities.marketplace.filter.preciousMetals', 'Precious Metals')}</option>
                  <option value="energy">{t('commodities.marketplace.filter.energy', 'Energy')}</option>
                  <option value="agriculture">{t('commodities.marketplace.filter.agriculture', 'Agriculture')}</option>
                  <option value="metals">{t('commodities.marketplace.filter.metals', 'Industrial Metals')}</option>
                </Select>
              </Flex>
              <Button
                leftIcon={<FaChartLine />}
                onClick={refreshPrices}
                isLoading={isLoading}
                loadingText={t('commodities.marketplace.loading', 'Updating...')}
                variant="bittrade-outline"
                size="md"
              >
                {t('commodities.marketplace.refresh', 'Refresh Prices')}
              </Button>
            </Flex>

            {isLoading && commodities.length === 0 ? (
              <Flex justify="center" align="center" minH="300px" direction="column">
                <Spinner size="xl" color="brand.forex.500" mb={4} />
                <Text>{t('commodities.marketplace.loading', 'Loading commodity data...')}</Text>
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('name')}
                        whiteSpace="nowrap"
                      >
                        <Flex align="center">
                          {t('commodities.marketplace.table.commodity', 'Commodity')}
                          {sortField === 'name' ? (
                            sortDirection === 'asc' ? <ChevronUpIcon ml={1} /> : <ChevronDownIcon ml={1} />
                          ) : <FaSort size="0.8em" style={{ marginLeft: '0.5rem', opacity: 0.5 }} />}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('price')}
                        isNumeric
                      >
                        <Flex align="center" justify="flex-end">
                          {t('commodities.marketplace.table.price', 'Price')}
                          {sortField === 'price' ? (
                            sortDirection === 'asc' ? <ChevronUpIcon ml={1} /> : <ChevronDownIcon ml={1} />
                          ) : <FaSort size="0.8em" style={{ marginLeft: '0.5rem', opacity: 0.5 }} />}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('changePercent')}
                        isNumeric
                      >
                        <Flex align="center" justify="flex-end">
                          {t('commodities.marketplace.table.change', '24h Change')}
                          {sortField === 'changePercent' ? (
                            sortDirection === 'asc' ? <ChevronUpIcon ml={1} /> : <ChevronDownIcon ml={1} />
                          ) : <FaSort size="0.8em" style={{ marginLeft: '0.5rem', opacity: 0.5 }} />}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('volume')}
                        isNumeric
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <Flex align="center" justify="flex-end">
                          {t('commodities.marketplace.table.volume', 'Volume')}
                          {sortField === 'volume' ? (
                            sortDirection === 'asc' ? <ChevronUpIcon ml={1} /> : <ChevronDownIcon ml={1} />
                          ) : <FaSort size="0.8em" style={{ marginLeft: '0.5rem', opacity: 0.5 }} />}
                        </Flex>
                      </Th>
                      <Th width="120px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredCommodities.length > 0 ? (
                      filteredCommodities.map((commodity) => (
                        <Tr 
                          key={commodity.id}
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                          transition="background-color 0.2s"
                        >
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={commodity.icon} 
                                boxSize="30px" 
                                mr={3}
                                color={useColorModeValue('gray.600', 'gray.300')}
                              />
                              <Box>
                                <Text fontWeight="medium">{commodity.name}</Text>
                                <Badge 
                                  size="sm" 
                                  colorScheme={getCategoryColor(commodity.category)}
                                  mt={1}
                                >
                                  {getCategoryLabel(commodity.category)}
                                </Badge>
                              </Box>
                            </Flex>
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            ${commodity.price.toFixed(2)}
                          </Td>
                          <Td isNumeric>
                            {renderPriceChange(commodity.change, commodity.changePercent)}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {commodity.volume.toLocaleString()}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="bittrade-solid"
                              width="full"
                              onClick={() => router.push(`/markets/commodities/${commodity.id}`)}
                            >
                              {t('commodities.marketplace.trade', 'Trade')}
                            </Button>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={8}>
                          <Text fontSize="md" color="gray.500">
                            {t('commodities.marketplace.noResults', 'No commodities found. Try adjusting your search.')}
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>

          {/* Tab panels for other categories would follow a similar pattern */}
          <TabPanel px={0}>
            {/* Precious Metals Tab */}
            {isLoading && commodities.length === 0 ? (
              <Flex justify="center" align="center" minH="300px" direction="column">
                <Spinner size="xl" color="brand.forex.500" mb={4} />
                <Text>{t('commodities.marketplace.loading', 'Loading commodity data...')}</Text>
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>{t('commodities.marketplace.table.commodity', 'Commodity')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.price', 'Price')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.change', '24h Change')}</Th>
                      <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{t('commodities.marketplace.table.volume', 'Volume')}</Th>
                      <Th width="120px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {commodities
                      .filter(item => item.category === 'precious-metals')
                      .map((commodity) => (
                        <Tr 
                          key={commodity.id}
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                        >
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={commodity.icon} 
                                boxSize="30px" 
                                mr={3}
                                color={useColorModeValue('gray.600', 'gray.300')}
                              />
                              <Text fontWeight="medium">{commodity.name}</Text>
                            </Flex>
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            ${commodity.price.toFixed(2)}
                          </Td>
                          <Td isNumeric>
                            {renderPriceChange(commodity.change, commodity.changePercent)}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {commodity.volume.toLocaleString()}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="bittrade-solid"
                              width="full"
                              onClick={() => router.push(`/markets/commodities/${commodity.id}`)}
                            >
                              {t('commodities.marketplace.trade', 'Trade')}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {/* Energy Tab */}
            {isLoading && commodities.length === 0 ? (
              <Flex justify="center" align="center" minH="300px" direction="column">
                <Spinner size="xl" color="brand.forex.500" mb={4} />
                <Text>{t('commodities.marketplace.loading', 'Loading commodity data...')}</Text>
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>{t('commodities.marketplace.table.commodity', 'Commodity')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.price', 'Price')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.change', '24h Change')}</Th>
                      <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{t('commodities.marketplace.table.volume', 'Volume')}</Th>
                      <Th width="120px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {commodities
                      .filter(item => item.category === 'energy')
                      .map((commodity) => (
                        <Tr 
                          key={commodity.id}
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                        >
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={commodity.icon} 
                                boxSize="30px" 
                                mr={3}
                                color={useColorModeValue('gray.600', 'gray.300')}
                              />
                              <Text fontWeight="medium">{commodity.name}</Text>
                            </Flex>
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            ${commodity.price.toFixed(2)}
                          </Td>
                          <Td isNumeric>
                            {renderPriceChange(commodity.change, commodity.changePercent)}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {commodity.volume.toLocaleString()}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="bittrade-solid"
                              width="full"
                              onClick={() => router.push(`/markets/commodities/${commodity.id}`)}
                            >
                              {t('commodities.marketplace.trade', 'Trade')}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {/* Agriculture Tab */}
            {isLoading && commodities.length === 0 ? (
              <Flex justify="center" align="center" minH="300px" direction="column">
                <Spinner size="xl" color="brand.forex.500" mb={4} />
                <Text>{t('commodities.marketplace.loading', 'Loading commodity data...')}</Text>
              </Flex>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>{t('commodities.marketplace.table.commodity', 'Commodity')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.price', 'Price')}</Th>
                      <Th isNumeric>{t('commodities.marketplace.table.change', '24h Change')}</Th>
                      <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{t('commodities.marketplace.table.volume', 'Volume')}</Th>
                      <Th width="120px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {commodities
                      .filter(item => item.category === 'agriculture')
                      .map((commodity) => (
                        <Tr 
                          key={commodity.id}
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                        >
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={commodity.icon} 
                                boxSize="30px" 
                                mr={3}
                                color={useColorModeValue('gray.600', 'gray.300')}
                              />
                              <Text fontWeight="medium">{commodity.name}</Text>
                            </Flex>
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            ${commodity.price.toFixed(2)}
                          </Td>
                          <Td isNumeric>
                            {renderPriceChange(commodity.change, commodity.changePercent)}
                          </Td>
                          <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                            {commodity.volume.toLocaleString()}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="bittrade-solid"
                              width="full"
                              onClick={() => router.push(`/markets/commodities/${commodity.id}`)}
                            >
                              {t('commodities.marketplace.trade', 'Trade')}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Shariah Compliance Notes */}
      <Box mt={8} p={5} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
        <Heading size="md" mb={4}>
          {t('commodities.marketplace.shariahCompliance.heading', 'Shariah Compliance Information')}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box p={4} bg={bgColor} borderRadius="md" boxShadow="sm">
            <Text fontWeight="bold" mb={2}>
              {t('commodities.marketplace.shariahCompliance.goldSilver', 'Gold & Silver Trading')}
            </Text>
            <Text fontSize="sm">
              {t('commodities.marketplace.shariahCompliance.goldSilverText', 'Our gold and silver trading adheres to Shariah principles by offering physical delivery options and ensuring full allocation of underlying assets. All transactions are conducted on a spot basis with immediate transfer of ownership.')}
            </Text>
          </Box>
          <Box p={4} bg={bgColor} borderRadius="md" boxShadow="sm">
            <Text fontWeight="bold" mb={2}>
              {t('commodities.marketplace.shariahCompliance.energy', 'Energy Products')}
            </Text>
            <Text fontSize="sm">
              {t('commodities.marketplace.shariahCompliance.energyText', 'Energy commodities like oil and natural gas are traded in accordance with Islamic finance principles. We ensure trades are executed with real underlying assets and avoid excessive speculation or gharar (uncertainty). All energy products comply with AAOIFI Shariah standards.')}
            </Text>
          </Box>
        </SimpleGrid>
        
        <Box mt={4} p={4} bg={bgColor} borderRadius="md" boxShadow="sm">
          <Text fontWeight="bold" mb={2}>
            {t('commodities.marketplace.shariahCompliance.agricultural', 'Agricultural Commodities')}
          </Text>
          <Text fontSize="sm">
            {t('commodities.marketplace.shariahCompliance.agriculturalText', 'Our agricultural commodity products are carefully selected to comply with Shariah principles. We facilitate the trading of real assets with known specifications and provide transparent pricing. All transactions involve a genuine transfer of ownership with the option for physical delivery where applicable.')}
          </Text>
        </Box>
      </Box>

      {/* Physical Delivery Options */}
      <Box mt={6} p={4} bg={useColorModeValue('green.50', 'green.900')} color={useColorModeValue('green.800', 'green.100')} borderRadius="md">
        <Flex align="center" mb={2}>
          <Icon as={GiGoldBar} boxSize={5} mr={3} />
          <Heading size="sm">
            {t('commodities.marketplace.physicalDelivery.title', 'Physical Delivery Options')}
          </Heading>
        </Flex>
        <Text fontSize="sm">
          {t('commodities.marketplace.physicalDelivery.description', 'BitTrade offers physical delivery options for gold and silver investments to ensure Shariah compliance. Minimum quantities for delivery: Gold (1 oz), Silver (5 oz). Delivery is available to most countries with secure, insured shipping. Contact customer support for details or visit our delivery information page.')}
        </Text>
      </Box>

      {/* Certification */}
      <Flex 
        mt={6} 
        p={4} 
        bg={useColorModeValue('blue.50', 'blue.900')} 
        color={useColorModeValue('blue.800', 'blue.100')}
        borderRadius="md"
        align="center"
      >
        <Box w="40px" h="40px" borderRadius="full" bg="white" mr={3} display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaShieldAlt} boxSize={5} color="blue.500" />
        </Box>
        <Box>
          <Text fontWeight="medium">
            {t('commodities.marketplace.certification.title', 'Shariah Certification')}
          </Text>
          <Text fontSize="sm">
            {t('commodities.marketplace.certification.description', 'All commodity products offered on BitTrade are certified by our Shariah Advisory Board in accordance with AAOIFI standards. Our trading processes and contracts are regularly reviewed for ongoing compliance.')}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default CommodityMarketplace;