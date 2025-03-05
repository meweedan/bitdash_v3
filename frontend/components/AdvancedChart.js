// components/AdvancedChart.js

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Flex,
  Select,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Grid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useBreakpointValue,
  Image,
  HStack,
  VStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  LineChart as LIcon,
  CandlestickChart as CIcon,
  ZoomOut as ZOut,
  ZoomIn as ZIn,
  ChevronLeft as ChLeft,
  ChevronRight as ChRight
} from 'lucide-react';

const RChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function getSubdomain() {
  if (typeof window === 'undefined') return '';
  const parts = window.location.hostname.split('.');
  return parts[0].toLowerCase();
}

function binanceSymbol(p) {
  const map = {
    BTC: 'BTCUSDT',
    ETH: 'ETHUSDT',
    BNB: 'BNBUSDT',
    DOGE: 'DOGEUSDT',
    ADA: 'ADAUSDT',
    XRP: 'XRPUSDT',
    LTC: 'LTCUSDT',
    SOL: 'SOLUSDT',
    AVAX: 'AVAXUSDT',
    DOT: 'DOTUSDT',
    LINK: 'LINKUSDT',
    UNI: 'UNIUSDT',
    SHIB: 'SHIBUSDT'
  };
  return map[p.toUpperCase()] || null;
}

function binanceInterval(i) {
  return i;
}

async function binanceKlines(pair, interval) {
  const sym = binanceSymbol(pair);
  if (!sym) return null;
  const url = `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${binanceInterval(interval)}&limit=500`;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function parseBinance(data) {
  return data.map(c => {
    const [t, o, h, l, cl, v] = c;
    return {
      timestamp: t,
      date: new Date(t).toLocaleDateString(),
      time: new Date(t).toLocaleTimeString(),
      open: parseFloat(o),
      high: parseFloat(h),
      low: parseFloat(l),
      close: parseFloat(cl),
      volume: parseFloat(v)
    };
  });
}

function parseLocal(data) {
  let out;
  if (Array.isArray(data[0])) {
    out = data.map(x => ({
      timestamp: x[0],
      date: new Date(x[0]).toLocaleDateString(),
      time: new Date(x[0]).toLocaleTimeString(),
      open: x[1],
      high: x[2],
      low: x[3],
      close: x[4],
      volume: x[5] || 0
    }));
  } else if ('symbol' in data[0]) {
    out = data.map(x => ({
      timestamp: new Date(x.timestamp).getTime(),
      date: new Date(x.timestamp).toLocaleDateString(),
      time: new Date(x.timestamp).toLocaleTimeString(),
      open: x.open,
      high: x.high,
      low: x.low,
      close: x.close,
      volume: x.volume || 0
    }));
  } else if ('from_currency' in data[0] || 'open_rate' in data[0]) {
    out = data.map(x => ({
      timestamp: new Date(x.timestamp).getTime(),
      date: new Date(x.timestamp).toLocaleDateString(),
      time: new Date(x.timestamp).toLocaleTimeString(),
      open: x.open_rate,
      high: x.high_rate,
      low: x.low_rate,
      close: x.rate,
      volume: x.volume || 0
    }));
  } else {
    throw new Error('Data');
  }
  out.sort((a, b) => a.timestamp - b.timestamp);
  return out;
}

function create404() {
  const n = new Date();
  const b = 40;
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(n);
    dt.setDate(dt.getDate() - i);
    if (i === 2 || i === 5) {
      arr.unshift({
        timestamp: dt.getTime(),
        date: dt.toLocaleDateString(),
        time: dt.toLocaleTimeString(),
        open: b + 10,
        high: b + 20,
        low: b - 10,
        close: b,
        volume: 0
      });
    } else if (i === 1 || i === 4) {
      arr.unshift({
        timestamp: dt.getTime(),
        date: dt.toLocaleDateString(),
        time: dt.toLocaleTimeString(),
        open: b,
        high: b + 20,
        low: b - 20,
        close: b,
        volume: 0
      });
    } else {
      arr.unshift({
        timestamp: dt.getTime(),
        date: dt.toLocaleDateString(),
        time: dt.toLocaleTimeString(),
        open: b + 10,
        high: b + 20,
        low: b - 10,
        close: b,
        volume: 0
      });
    }
  }
  return arr;
}

export default function ChakraAdvancedChart({ selectedCoin, coins, onPairSelect }) {
  const cryptoPairs = ['BTC','ETH','BNB','XRP','ADA','DOGE','SOL','DOT','LINK','UNI','SHIB','AVAX','LTC'];
  const forexPairs = ['EURUSD','USDJPY','GBPUSD','AUDUSD','USDCAD','USDCHF','NZDUSD','XAU','XAG'];
  const stockPairs = ['AAPL','MSFT','GOOGL','AMZN','META','TSLA','NVDA','INTC','JNJ','JPM','NFLX','PYPL'];
  const intervals = ['5m','15m','1h','4h','1d'];
  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'All'];
  const tfMap = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'All': Infinity };
  
  const [win, setWin] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  const [sub, setSub] = useState('');
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  
  // Use the passed-in selectedCoin (if any) to initialize the pair; otherwise default to 'BTC'
  const [selectedPair, setSelectedPair] = useState(selectedCoin ? selectedCoin.symbol.toUpperCase() : 'USDT');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [line, setLine] = useState(false);
  const [vol, setVol] = useState(true);
  const [timeframe, setTimeframe] = useState('3M');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [idx, setIdx] = useState(0);
  const [hasVol, setHasVol] = useState(true);
  const [noData, setNoData] = useState(false);

  // For mobile search modal
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartH = isMobile ? Math.min(350, win.height * 0.5) : 600;
  const volH = isMobile ? 70 : 120;
  
  // Update selectedPair if selectedCoin prop changes
  useEffect(() => {
    if(selectedCoin) {
      setSelectedPair(selectedCoin.symbol.toUpperCase());
    }
  }, [selectedCoin]);

  useEffect(() => {
    setSub(getSubdomain());
  }, []);

  useEffect(() => {
    const r = () => setWin({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const isCryptoDomain = sub === 'crypto';
  const isForexDomain = sub === 'forex';
  const isStockDomain = sub === 'stock';

  const getPairs = () => {
    if (isCryptoDomain) return cryptoPairs;
    if (isForexDomain) return forexPairs;
    if (isStockDomain) return stockPairs;
    return [];
  };

  useEffect(() => {
    setLoading(true);
    setErr('');
    setNoData(false);
    setChartData([]);
    setHasVol(true);
    if (!sub) return;
    const path = `/chart-data/${selectedPair}_${selectedInterval}_candles.json`;
    (async () => {
      try {
        const resp = await fetch(path);
        if (!resp.ok) {
          if (isCryptoDomain) {
            const bin = await binanceKlines(selectedPair, selectedInterval);
            if (!bin || !Array.isArray(bin) || !bin.length) throw new Error('Fallback');
            const fm = parseBinance(bin);
            finishLoad(fm);
          } else {
            throw new Error('Local file');
          }
        } else {
          const j = await resp.json();
          if (!Array.isArray(j) || !j.length) throw new Error('Invalid local');
          const fm = parseLocal(j);
          finishLoad(fm);
        }
      } catch(e) {
        setErr(e.message || 'Data error');
        setLoading(false);
      }
    })();
  }, [sub, selectedPair, selectedInterval]);

  function finishLoad(fm) {
    fm.sort((a, b) => a.timestamp - b.timestamp);
    const hv = fm.some(d => d.volume > 0);
    setHasVol(hv);
    if (!hv) setVol(false);
    setChartData(fm);
    setLoading(false);
  }

  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    let f = chartData;
    if (timeframe !== 'All') {
      const c = new Date();
      c.setDate(c.getDate() - tfMap[timeframe]);
      f = chartData.filter(d => new Date(d.timestamp) >= c);
    }
    const pts = Math.floor(f.length / zoomLevel);
    const st = Math.min(idx, Math.max(0, f.length - pts));
    if (f.length === 0 && chartData.length > 0) {
      setNoData(true);
      return create404();
    }
    setNoData(false);
    return f.slice(st, st + pts);
  }, [chartData, timeframe, zoomLevel, idx]);

  const stats = useMemo(() => {
    if (!filteredData.length || noData) {
      return {
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        isPriceUp: false,
        high24h: 0,
        low24h: 0
      };
    }
    const cp = filteredData[filteredData.length - 1].close;
    const pp = filteredData.length > 1 ? filteredData[filteredData.length - 2].close : cp;
    const ch = cp - pp;
    const chp = (ch / pp) * 100;
    const last24 = filteredData.slice(-24);
    const hh = Math.max(...last24.map(d => d.high));
    const ll = Math.min(...last24.map(d => d.low));
    return {
      currentPrice: cp,
      priceChange: ch,
      priceChangePercent: chp,
      isPriceUp: ch >= 0,
      high24h: hh,
      low24h: ll
    };
  }, [filteredData, noData]);

  function fp(n) {
    if (n == null) return '-';
    return n.toFixed(2);
  }

  const chartOptions = useMemo(() => ({
    chart: {
      type: line ? 'line' : 'candlestick',
      height: chartH,
      background: dark ? '#1A202C' : '#fff',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false }
    },
    plotOptions: {
      candlestick: { colors: { upward: '#48BB78', downward: '#F56565' }, wick: { useFillColor: true } },
      bar: { columnWidth: '80%' }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: dark ? 'white' : 'black', fontSize: '10px' },
        formatter: v => {
          const dt = new Date(v);
          if (selectedInterval === '1d') {
            return isMobile ? dt.getDate() : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }
          return dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        }
      },
      axisBorder: { show: false },
      axisTicks: { color: dark ? 'rgba(120,123,134,0.1)' : 'rgba(0,0,0,0.1)' },
      tooltip: { enabled: false }
    },
    yaxis: [
      {
        labels: {
          style: { colors: dark ? 'white' : 'black', fontSize: '10px' },
          formatter: val => fp(val)
        },
        axisBorder: { show: false },
        tooltip: { enabled: true }
      },
      {
        show: vol && hasVol,
        opposite: true,
        labels: {
          style: { colors: dark ? 'white' : 'black', fontSize: '10px' },
          formatter: val => val >= 1e6 ? (val / 1e6).toFixed(1)+'M' : (val / 1e3).toFixed(0)+'K'
        }
      }
    ],
    grid: {
      borderColor: dark ? 'rgba(120,123,134,0.1)' : 'rgba(0,0,0,0.1)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    tooltip: {
      enabled: true,
      theme: dark ? 'dark' : 'light',
      custom: ({ dataPointIndex }) => {
        const d = filteredData[dataPointIndex];
        if (!d) return '';
        const vv = d.volume >= 1e6
          ? (d.volume / 1e6).toFixed(2)+'M'
          : d.volume >= 1e3
          ? (d.volume / 1e3).toFixed(0)+'K'
          : d.volume.toFixed(0);
        return `<div style="background:${dark?'#2D3748':'#fff'};border:1px solid ${
          dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'
        };color:${dark?'white':'black'};padding:8px;border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.3);font-family:monospace;font-size:12px;">
          <div style="font-weight:bold;margin-bottom:4px;">${new Date(d.timestamp).toLocaleString()}</div>
          <div>O: ${fp(d.open)}</div><div>H: ${fp(d.high)}</div><div>L: ${fp(d.low)}</div><div>C: ${fp(d.close)}</div>${
            d.volume>0?`<div>V: ${vv}</div>`:''
          }
        </div>`;
      }
    },
    annotations: noData ? {
      xaxis: [
        {
          x: filteredData[Math.floor(filteredData.length/2)]?.timestamp,
          borderColor: '#ECC94B',
          label: {
            borderColor: 'transparent',
            style: { color:'#ECC94B', background:'rgba(236,201,75,0.1)', fontSize:'20px', fontWeight:'bold' },
            text:'404 - No Data',
            position:'middle'
          }
        }
      ]
    } : undefined
  }), [line, chartH, dark, selectedInterval, isMobile, vol, hasVol, noData, filteredData]);

  const mainSeries = useMemo(() => {
    let d = filteredData;
    if (!d.length) {
      if (err || noData) d = create404();
      else return [];
    }
    const price = {
      name:'Price',
      type: line ? 'line' : 'candlestick',
      data: d.map(x=>({ x:new Date(x.timestamp), y: line ? x.close :[x.open,x.high,x.low,x.close] })),
      color: line ? '#3182CE' : undefined
    };
    if (vol && hasVol && !noData) {
      const volum = {
        name:'Volume',
        type:'bar',
        data:d.map(x=>({
          x:new Date(x.timestamp),
          y:x.volume,
          fillColor: x.close>=x.open?'rgba(72,187,120,0.5)':'rgba(245,101,101,0.5)'
        }))
      };
      return [price, volum];
    }
    return [price];
  }, [filteredData, line, vol, hasVol, noData, err]);

  const scroll = dir => {
    if (noData) return;
    const s = Math.max(1, Math.floor(chartData.length / 20));
    setIdx(prev => {
      if (dir==='left') return Math.max(0, prev - s);
      const mx = Math.max(0, chartData.length - Math.floor(chartData.length/zoomLevel));
      return Math.min(mx, prev + s);
    });
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev+0.5,4));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev-0.5,1));
  const toggleType = () => setLine(!line);
  const toggleVolume = () => {
    if (!hasVol) return;
    setVol(!vol);
  };

  return (
    <Box 
      bg={dark ? 'gray.800' : 'white'} 
      color={dark ? 'white' : 'gray.800'}
      borderRadius="lg" 
      p={isMobile ? 3 : 4}
      width="100%" 
      maxW="100vw" 
      mx="auto"
      boxShadow="md"
    >
      {/* Mobile Header: Unified Pricing and Search Markets */}
      {isMobile ? (
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Flex alignItems="center" gap={2}>
            {selectedCoin && selectedCoin.image && (
              <Image src={selectedCoin.image} alt={selectedCoin.name} boxSize="24px" />
            )}
            <Text fontWeight="bold" fontSize="md">
              {selectedCoin ? selectedCoin.symbol.toUpperCase() : selectedPair}
            </Text>
            {!loading && filteredData.length > 0 && !noData && (
              <>
                <Text fontSize="md">{fp(stats.currentPrice)}</Text>
                <Badge 
                  colorScheme={stats.isPriceUp ? 'green' : 'red'} 
                  variant="subtle" 
                  px={2} 
                  py={1}
                  fontWeight="bold"
                >
                  {stats.isPriceUp ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </Badge>
              </>
            )}
          </Flex>
          <Button color="brand.bitdash.400" size="sm" variant="bitdash-outline" onClick={() => setShowSearch(true)}>
            Search 
          </Button>
        </Flex>
      ) : (
        // Desktop Header: Pair selection with integrated dropdown for timeframe/interval
        <Flex mb={4} justify="space-between" align="center">
          <Flex gap={4} align="center">
            <Select
              value={selectedPair}
              onChange={(e) => {
                setSelectedPair(e.target.value);
                if(onPairSelect && coins) {
                  const coin = coins.find(c => c.symbol.toUpperCase() === e.target.value);
                  if(coin) onPairSelect(coin);
                }
              }}
              width="140px"
              variant="filled"
              bg="gray.100"
              _dark={{ bg: "gray.700" }}
              size="md"
            >
              {getPairs().map(x => (
                <option key={x} value={x}>{x}</option>
              ))}
            </Select>
            
            {/* Combined Settings Menu */}
            <Menu closeOnSelect={false}>
              <MenuButton 
                as={Button} 
                rightIcon={<ChevronDownIcon />}
                variant="filled"
                bg="gray.100"
                _dark={{ bg: "gray.700" }}
                _hover={{ bg: "gray.200" }}
                _dark_hover={{ bg: "gray.600" }}
              >
                {timeframe} | {selectedInterval}
              </MenuButton>
              <MenuList>
                <Text px={3} fontWeight="bold" mb={2}>Timeframe</Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={1} px={3} mb={3}>
                  {timeframes.map(tf => (
                    <Button 
                      key={tf}
                      size="sm" 
                      colorScheme={timeframe === tf ? "blue" : "gray"}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </Grid>
                <Divider mb={2} />
                <Text px={3} fontWeight="bold" mb={2}>Interval</Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={1} px={3}>
                  {intervals.map(int => (
                    <Button 
                      key={int}
                      size="sm" 
                      colorScheme={selectedInterval === int ? "blue" : "gray"}
                      onClick={() => setSelectedInterval(int)}
                    >
                      {int}
                    </Button>
                  ))}
                </Grid>
              </MenuList>
            </Menu>
            
            {/* Chart Type & Volume Toggle */}
            <HStack spacing={2}>
              <Tooltip label={line ? "Switch to Candlestick" : "Switch to Line"}>
                <IconButton
                  icon={line ? <CIcon size={18} /> : <LIcon size={18} />}
                  size="sm"
                  onClick={toggleType}
                  isDisabled={noData}
                  aria-label={line ? "Switch to Candlestick" : "Switch to Line"}
                />
              </Tooltip>
              <Tooltip label={vol ? "Hide Volume" : "Show Volume"}>
                <Button
                  size="sm"
                  onClick={toggleVolume}
                  isDisabled={!hasVol || noData}
                  variant={vol ? "solid" : "outline"}
                  colorScheme={vol ? "blue" : "gray"}
                >
                  Vol {vol ? "✓" : ""}
                </Button>
              </Tooltip>
            </HStack>
            
            {/* Navigation Controls */}
            <HStack spacing={2}>
              <IconButton
                icon={<ChLeft size={18} />}
                size="sm"
                onClick={() => scroll('left')}
                isDisabled={noData}
                aria-label="Pan left"
              />
              <IconButton
                icon={<ChRight size={18} />}
                size="sm"
                onClick={() => scroll('right')}
                isDisabled={noData}
                aria-label="Pan right"
              />
              <IconButton
                icon={<ZOut size={18} />}
                size="sm"
                onClick={zoomOut}
                isDisabled={noData}
                aria-label="Zoom out"
              />
              <IconButton
                icon={<ZIn size={18} />}
                size="sm"
                onClick={zoomIn}
                isDisabled={noData}
                aria-label="Zoom in"
              />
            </HStack>
          </Flex>
          
          {/* Price Display */}
          {!loading && filteredData.length > 0 && !noData && (
            <HStack spacing={3}>
              <Text fontSize="xl" fontWeight="bold">
                {fp(stats.currentPrice)}
              </Text>
              <Badge 
                colorScheme={stats.isPriceUp ? "green" : "red"} 
                variant="subtle" 
                px={2} 
                py={1} 
                fontSize="md"
              >
                {stats.isPriceUp ? "+" : ""}{stats.priceChangePercent.toFixed(2)}%
              </Badge>
            </HStack>
          )}
        </Flex>
      )}

      {/* Search Markets Modal for Mobile */}
      <Modal isOpen={showSearch} onClose={() => setShowSearch(false)} isCentered>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Search Markets</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Search by name or symbol"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={4}
            />
            <Box maxH="60vh" overflowY="auto">
              {/* For Crypto Domain with coin objects */}
              {isCryptoDomain && coins ? 
                coins
                  .filter(coin => 
                    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(coin => (
                    <Flex
                      key={coin.id}
                      p={2}
                      _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                      cursor="pointer"
                      alignItems="center"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      _dark={{ borderColor: "gray.700" }}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchTerm('');
                        setSelectedPair(coin.symbol.toUpperCase());
                        if(onPairSelect) onPairSelect(coin);
                      }}
                    >
                      {coin.image && (
                        <Image src={coin.image} boxSize="24px" mr={3} alt={coin.name} />
                      )}
                      <Text fontWeight="bold" mr={2}>{coin.symbol.toUpperCase()}</Text>
                      <Text color="gray.500">{coin.name}</Text>
                    </Flex>
                  )) : 
                  
                /* For Forex and Stock Domains - direct pairs */
                (isForexDomain || isStockDomain) ?
                  getPairs()
                    .filter(pair => pair.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(pair => (
                      <Flex
                        key={pair}
                        p={2}
                        _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                        cursor="pointer"
                        alignItems="center"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        _dark={{ borderColor: "gray.700" }}
                        onClick={() => {
                          setShowSearch(false);
                          setSearchTerm('');
                          setSelectedPair(pair);
                        }}
                      >
                        <Text fontWeight="bold">{pair}</Text>
                      </Flex>
                    )) :
                  <Text>No markets available</Text>
              }
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Mobile Controls */}
      {isMobile && (
        <VStack spacing={2} mb={4}>
          {/* Mobile Timeframe/Interval Menu */}
          <Menu closeOnSelect={false}>
            <MenuButton 
              as={Button} 
              rightIcon={<ChevronDownIcon />}
              width="full"
              variant="outline"
            >
              {timeframe} | {selectedInterval}
            </MenuButton>
            <MenuList>
              <Text px={3} fontWeight="bold" mb={2}>Timeframe</Text>
              <Grid templateColumns="repeat(4, 1fr)" gap={1} px={3} mb={3}>
                {timeframes.map(tf => (
                  <Button 
                    key={tf}
                    size="sm" 
                    colorScheme={timeframe === tf ? "blue" : "gray"}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </Button>
                ))}
              </Grid>
              <Divider mb={2} />
              <Text px={3} fontWeight="bold" mb={2}>Interval</Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={1} px={3}>
                {intervals.map(int => (
                  <Button 
                    key={int}
                    size="sm" 
                    colorScheme={selectedInterval === int ? "blue" : "gray"}
                    onClick={() => setSelectedInterval(int)}
                  >
                    {int}
                  </Button>
                ))}
              </Grid>
            </MenuList>
          </Menu>
          
          {/* Chart Controls */}
          <Grid templateColumns="repeat(6, 1fr)" gap={1} width="full">
            <IconButton
              icon={line ? <CIcon size={16} /> : <LIcon size={16} />}
              onClick={toggleType}
              isDisabled={noData}
              aria-label={line ? "Switch to Candlestick" : "Switch to Line"}
              size="sm"
            />
            <Button
              size="sm"
              onClick={toggleVolume}
            isDisabled={!hasVol || noData}
            variant={vol ? "solid" : "outline"}
            colorScheme={vol ? "blue" : "gray"}
          >
            Vol
          </Button>
          <IconButton
            icon={<ChLeft size={16} />}
            onClick={() => scroll('left')}
            isDisabled={noData}
            aria-label="Pan left"
            size="sm"
          />
          <IconButton
            icon={<ChRight size={16} />}
            onClick={() => scroll('right')}
            isDisabled={noData}
            aria-label="Pan right"
            size="sm"
          />
          <IconButton
            icon={<ZOut size={16} />}
            onClick={zoomOut}
            isDisabled={noData}
            aria-label="Zoom out"
            size="sm"
          />
          <IconButton
            icon={<ZIn size={16} />}
            onClick={zoomIn}
            isDisabled={noData}
            aria-label="Zoom in"
            size="sm"
          />
        </Grid>
      </VStack>
    )}

    {/* Loading State */}
    {loading && (
      <Flex justify="center" align="center" height={`${chartH}px`}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading chart data...</Text>
        </VStack>
      </Flex>
    )}
    
    {/* Error Display */}
    {!loading && err && !noData && (
      <Alert status="error" mb={4} borderRadius="md">
        <AlertIcon />
        {err}
      </Alert>
    )}

    {/* Chart Display */}
    {!loading && (
      <Box position="relative" width="100%" height={`${chartH}px`}>
        <Box 
          width="100%" 
          height={vol && hasVol && !noData ? `${chartH - volH}px` : `${chartH}px`}
        >
          <RChart
            options={chartOptions}
            series={mainSeries.length > 0 ? [mainSeries[0]] : []}
            type={line ? 'line' : 'candlestick'}
            height="100%"
            width="100%"
          />
        </Box>
        
        {/* Volume Chart */}
        {vol && hasVol && !noData && mainSeries.length > 1 && (
          <Box position="absolute" bottom={0} width="100%" height={`${volH}px`}>
            <RChart
              options={{
                ...chartOptions,
                chart: {...chartOptions.chart, height: volH, id: 'volume-chart'},
                xaxis: {...chartOptions.xaxis, labels: {...chartOptions.xaxis.labels, show: false}},
                yaxis: [{
                  labels: {
                    style: { colors: dark ? 'white' : 'black', fontSize: '1px' },
                    formatter: v => v >= 1e6 ? (v/1e6).toFixed(1)+'M' : (v/1e3).toFixed(0)+'K',
                    show: false
                  },
                  opposite: false
                }],
                tooltip: { enabled: false }
              }}
              series={[mainSeries[1]]}
              type="bar"
              height={volH}
              width="100%"
            />
          </Box>
        )}
        
        {/* No Data Overlay */}
        {!loading && noData && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            alignItems="center"
            justifyContent="center"
            bgColor="rgba(0,0,0,0.7)"
            borderRadius="md"
            zIndex={2}
            pointerEvents="none"
          >
            <VStack spacing={2} px={8} py={6}>
              <Text color="yellow.400" fontSize="3xl" fontWeight="bold">
                404
              </Text>
              <Text color="yellow.400" textAlign="center">
                No data available for {selectedPair} ({selectedInterval}) in timeframe {timeframe}
              </Text>
            </VStack>
          </Flex>
        )}
      </Box>
    )}
    
    {/* Statistics Cards */}
    {!loading && filteredData.length > 0 && !noData && (
      <Grid 
        templateColumns={isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"}
        gap={4}
        mt={4}
        p={4}
        bg={dark ? "gray.700" : "gray.50"}
        borderRadius="md"
      >
        <Stat>
          <StatLabel color={dark ? "gray.400" : "gray.500"}>Price</StatLabel>
          <StatNumber fontWeight="bold" fontSize={isMobile ? "md" : "lg"}>
            {fp(stats.currentPrice)}
          </StatNumber>
        </Stat>
        
        <Stat>
          <StatLabel color={dark ? "gray.400" : "gray.500"}>24h Change</StatLabel>
          <StatNumber 
            fontWeight="bold" 
            fontSize={isMobile ? "md" : "lg"}
            color={stats.isPriceUp ? "green.500" : "red.500"}
          >
            {stats.isPriceUp ? "+" : ""}
            {stats.priceChangePercent.toFixed(2)}%
          </StatNumber>
        </Stat>
        
        <Stat>
          <StatLabel color={dark ? "gray.400" : "gray.500"}>24h High</StatLabel>
          <StatNumber fontWeight="bold" fontSize={isMobile ? "md" : "lg"}>
            {fp(stats.high24h)}
          </StatNumber>
        </Stat>
        
        <Stat>
          <StatLabel color={dark ? "gray.400" : "gray.500"}>24h Low</StatLabel>
          <StatNumber fontWeight="bold" fontSize={isMobile ? "md" : "lg"}>
            {fp(stats.low24h)}
          </StatNumber>
        </Stat>
      </Grid>
    )}
    
    {/* No Volume Data Warning */}
    {!loading && !hasVol && !noData && (
      <Alert status="warning" mt={4} borderRadius="md">
        <AlertIcon />
        No volume data available for this pair/timeframe
      </Alert>
    )}
  </Box>
  );
  }