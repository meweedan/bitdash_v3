import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowUpDown,
  LineChart as LineChartIcon,
  CandlestickChart as CandlestickIcon,
  ZoomOut,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useColorMode } from '@chakra-ui/react';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
  const TradingViewChart = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  
  // Chart state
  const [selectedPair, setSelectedPair] = useState('BTC');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLineChart, setIsLineChart] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [timeframe, setTimeframe] = useState('3M');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

// TradingView-style color constants
  const TV_COLORS = useMemo(() => ({
    UP_COLOR: '#26a69a',
    DOWN_COLOR: '#ef5350',
    VOLUME_UP_COLOR: 'rgba(38, 166, 154, 0.5)',
    VOLUME_DOWN_COLOR: 'rgba(239, 83, 80, 0.5)',
    GRID_COLOR: isDark ? 'rgba(120, 123, 134, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    CROSSHAIR_COLOR: isDark ? 'rgba(120, 123, 134, 0.6)' : 'rgba(0, 0, 0, 0.4)',
    LINE_COLOR: '#2962FF',
    BACKGROUND: isDark ? '#131722' : '#ffffff', // ✅ **Fix: White in Light Mode**
    TEXT_COLOR: isDark ? '#38a4a4' : '#131722', // ✅ **Fix: Dark text for light mode**
    BUTTON_BG: isDark ? '#2a2e39' : '#e0e0e0',
    BUTTON_HOVER: '#38a4a4',
  }), [isDark]);

// Time frame constants - shortened for mobile
const timeframeDaysMap = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  'All': Infinity,
};

// Shorter lists for mobile friendliness
const AVAILABLE_PAIRS = [
  'BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', // Crypto
  'EURUSD', 'USDJPY', 'GBPUSD', // Forex
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', // Stocks
  'XAU', 'XAG', // Commodities
];

// Available intervals - fewer options for mobile
const AVAILABLE_INTERVALS = ['5m', '15m', '1h', '4h', '1d'];

/** Volume bar with color coding */
const VolumeBar = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;

  const isUp = payload.close >= payload.open;
  const color = isUp ? TV_COLORS.VOLUME_UP_COLOR : TV_COLORS.VOLUME_DOWN_COLOR;
  const barWidth = Math.max(Math.min(width * 0.7, 8), 2); // Ensure visible on mobile

  return (
    <rect
      x={x + (width - barWidth) / 2}
      y={y}
      width={barWidth}
      height={height}
      fill={color}
    />
  );
};

  // Responsive values based on screen size
  const isMobile = windowSize.width < 768;
  const chartHeight = isMobile ? Math.min(350, windowSize.height * 0.5) : 600;
  const volumeHeight = isMobile ? 70 : 120;
  const displayData = useMemo(() => {
    if (!chartData.length) return [];

    let filteredData = chartData;
    if (timeframe !== 'All') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframeDaysMap[timeframe]);
      filteredData = chartData.filter((d) => new Date(d.timestamp) >= cutoffDate);
    }

    const visibleDataPoints = Math.floor(filteredData.length / zoomLevel);
    const startIndex = Math.min(
      visibleStartIndex,
      Math.max(0, filteredData.length - visibleDataPoints)
    );

    return filteredData.slice(startIndex, startIndex + visibleDataPoints);
  }, [chartData, timeframe, zoomLevel, visibleStartIndex]);
  
  // Monitor window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chart data
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const filePath = `/chart-data/${selectedPair}_${selectedInterval}_candles.json`;
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to load data (${response.status})`);
        }

        const rawData = await response.json();
        let formattedData;

        if (Array.isArray(rawData) && rawData.length > 0) {
          if (Array.isArray(rawData[0])) {
            formattedData = rawData.map((item) => ({
              timestamp: item[0],
              date: new Date(item[0]).toLocaleDateString(),
              time: new Date(item[0]).toLocaleTimeString(),
              open: item[1],
              high: item[2],
              low: item[3],
              close: item[4],
              volume: item[5] || 0,
            }));
          } else if ('symbol' in rawData[0]) {
            formattedData = rawData.map((item) => ({
              timestamp: new Date(item.timestamp).getTime(),
              date: new Date(item.timestamp).toLocaleDateString(),
              time: new Date(item.timestamp).toLocaleTimeString(),
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
              volume: item.volume || 0,
            }));
          } else if ('from_currency' in rawData[0]) {
            formattedData = rawData.map((item) => ({
              timestamp: new Date(item.timestamp).getTime(),
              date: new Date(item.timestamp).toLocaleDateString(),
              time: new Date(item.timestamp).toLocaleTimeString(),
              open: item.open_rate,
              high: item.high_rate,
              low: item.low_rate,
              close: item.rate,
              volume: item.volume || 0,
            }));
          } else {
            throw new Error('Unsupported data format');
          }
        } else {
          throw new Error('Invalid data structure');
        }

        formattedData.sort((a, b) => a.timestamp - b.timestamp);
        setChartData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setErrorMessage('Unable to load data, please choose different pair or timeframe');
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [selectedPair, selectedInterval]);

  // ApexCharts configuration
  const chartOptions = useMemo(() => ({
  chart: {
    type: 'candlestick',
    height: chartHeight,
    background: TV_COLORS.BACKGROUND, // ✅ Dynamically updates background color
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: false },
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: TV_COLORS.UP_COLOR,
        downward: TV_COLORS.DOWN_COLOR,
      },
      wick: { useFillColor: true },
    },
    bar: {
      columnWidth: '80%',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: TV_COLORS.TEXT_COLOR, // ✅ Dynamically updates text color
        fontSize: '10px',
      },
      formatter: (value) => formatXAxisTick(value),
    },
    axisBorder: { show: false },
    axisTicks: {
      color: TV_COLORS.GRID_COLOR, // ✅ Updates grid colors based on theme
    },
    tooltip: { enabled: false },
  },
  yaxis: [
    {
      labels: {
        style: {
          colors: TV_COLORS.TEXT_COLOR, // ✅ Updates Y-axis labels
          fontSize: '10px',
        },
        formatter: (value) => formatPrice(value),
      },
      axisBorder: { show: false },
      tooltip: { enabled: true },
    },
    {
      opposite: true,
      labels: {
        style: {
          colors: TV_COLORS.TEXT_COLOR,
          fontSize: '10px',
        },
        formatter: (value) =>
          value >= 1000000
            ? `${(value / 1000000).toFixed(1)}M`
            : `${(value / 1000).toFixed(0)}K`,
      },
    },
  ],
  grid: {
    borderColor: TV_COLORS.GRID_COLOR, // ✅ Updates grid dynamically
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    enabled: true,
    theme: isDark ? 'dark' : 'light', // ✅ Tooltip theme updates dynamically
    custom: ({ series, seriesIndex, dataPointIndex }) => {
      const data = displayData[dataPointIndex];
      if (!data) return '';

      return `
        <div style="
          background: ${isDark ? 'rgba(32, 34, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          color: ${isDark ? 'white' : 'black'};
          padding: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          font-family: monospace;
          font-size: 12px;
        ">
          <div style="font-weight: bold; margin-bottom: 4px;">
            ${new Date(data.timestamp).toLocaleString()}
          </div>
          <div>O: ${formatPrice(data.open)}</div>
          <div>H: ${formatPrice(data.high)}</div>
          <div>L: ${formatPrice(data.low)}</div>
          <div>C: ${formatPrice(data.close)}</div>
          ${data.volume > 0 ? `<div>V: ${Math.round(data.volume / 1000)}K</div>` : ''}
        </div>
      `;
    },
  },
}), [displayData, windowSize.width, isDark, TV_COLORS]);

  // Prepare series data for ApexCharts
  const chartSeries = useMemo(() => {
    const priceSeries = {
      name: 'Price',
      type: isLineChart ? 'line' : 'candlestick',
      data: displayData.map(d => ({
        x: new Date(d.timestamp),
        y: isLineChart ? d.close : [d.open, d.high, d.low, d.close],
      })),
      color: isLineChart ? TV_COLORS.LINE_COLOR : undefined,
    };

    const volumeSeries = {
      name: 'Volume',
      type: 'bar',
      data: displayData.map(d => ({
        x: new Date(d.timestamp),
        y: d.volume,
        fillColor: d.close >= d.open 
          ? TV_COLORS.VOLUME_UP_COLOR 
          : TV_COLORS.VOLUME_DOWN_COLOR,
      })),
    };

    return [priceSeries, ...(showVolume ? [volumeSeries] : [])];
  }, [displayData, isLineChart, showVolume]);


  // Calculate price stats
  const priceStats = useMemo(() => {
    if (!displayData.length) {
      return {
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        isPriceUp: false,
        high24h: 0,
        low24h: 0,
      };
    }

    const currentPrice = displayData[displayData.length - 1].close;
    const previousPrice = displayData.length > 1 
      ? displayData[displayData.length - 2].close 
      : currentPrice;
      
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = (priceChange / previousPrice) * 100;
    
    // Get 24h high/low
    const last24 = displayData.slice(-24);
    const high24h = Math.max(...last24.map((d) => d.high));
    const low24h = Math.min(...last24.map((d) => d.low));

    return {
      currentPrice,
      priceChange,
      priceChangePercent,
      isPriceUp: priceChange >= 0,
      high24h,
      low24h,
    };
  }, [displayData]);

  // Format price based on asset type
  const formatPrice = (price) => {
    if (price == null) return '-';
    
    const isCrypto = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE'].includes(selectedPair);
    let decimals = 2;
    
    if (isCrypto) {
      decimals = price < 0.1 ? 6 : price < 10 ? 4 : 2;
    } else if (selectedPair.includes('JPY')) {
      decimals = 3;
    } else if (price > 1000) {
      decimals = 1;
    } else if (price < 1) {
      decimals = 5;
    }
    
    return price.toFixed(decimals);
  };

  // Chart interaction handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const toggleChartType = () => setIsLineChart(!isLineChart);
  const toggleVolumeDisplay = () => setShowVolume(!showVolume);
  
  const handleScroll = (direction) => {
    const step = Math.max(1, Math.floor(chartData.length / 20));
    setVisibleStartIndex((prev) => {
      if (direction === 'left') {
        return Math.max(0, prev - step);
      } else {
        const maxIndex = Math.max(0, chartData.length - Math.floor(chartData.length / zoomLevel));
        return Math.min(maxIndex, prev + step);
      }
    });
  };

  // Format X-axis ticks
  const formatXAxisTick = (timestamp) => {
    const date = new Date(timestamp);
    
    if (selectedInterval === '1d') {
      return isMobile ? date.getDate() : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Button styles with mobile-optimized sizing
  const getButtonStyle = (isActive = false) => ({
    backgroundColor: isActive ? '#2962FF' : TV_COLORS.BUTTON_BG,
    color: isActive ? 'white' : TV_COLORS.TEXT_COLOR,
    border: 'none',
    borderRadius: '4px',
    padding: isMobile ? '10px 0' : '6px 12px',
    fontSize: isMobile ? '12px' : '14px',
    cursor: 'pointer',
    margin: '0 2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '12px' : 'auto',
    minHeight: isMobile ? '20px' : 'auto',
    touchAction: 'manipulation',
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
       return (
          <div style={{
            backgroundColor: TV_COLORS.BACKGROUND,
            color: TV_COLORS.TEXT_COLOR,
            padding: isMobile ? '8px' : '16px',
            borderRadius: '8px',
            fontFamily: 'sans-serif',
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: '100%',
            overflowX: 'hidden',
            margin: '0 auto',
          }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {new Date(data.timestamp).toLocaleString()}
          </div>
          <div>O: {formatPrice(data.open)}</div>
          <div>H: {formatPrice(data.high)}</div>
          <div>L: {formatPrice(data.low)}</div>
          <div>C: {formatPrice(data.close)}</div>
          {data.volume > 0 && <div>V: {Math.round(data.volume/1000)}K</div>}
        </div>
      );
    }
    return null;
  };

   return (
    <div style={{
      backgroundColor: TV_COLORS.BACKGROUND,
      color: TV_COLORS.TEXT_COLOR,
      padding: isMobile ? '8px' : '10px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '100vw',
      margin: '0 auto',
    }}>
      {/* Pair and Interval Selectors */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <div style={{ 
          display: 'flex', 
          width: '100%',
          gap: '8px',
        }}>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            style={{
              backgroundColor: TV_COLORS.BUTTON_BG,
              color: TV_COLORS.TEXT_COLOR,
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '14px',
              flexGrow: 1,
              maxWidth: isMobile ? '50%' : '130px',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='292.4' height='292.4'%3E%3Cpath fill='%23b4b9be' d='M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '8px',
              paddingRight: '24px',
            }}
          >
            {AVAILABLE_PAIRS.map((pair) => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>

          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            style={{
              backgroundColor: TV_COLORS.BUTTON_BG,
              color: TV_COLORS.TEXT_COLOR,
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '14px',
              flexGrow: 1,
              maxWidth: isMobile ? '50%' : '100px',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='292.4' height='292.4'%3E%3Cpath fill='%23b4b9be' d='M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-5 0-9.3 1.8-12.9 5.4A17.6 17.6 0 0 0 0 82.2c0 5 1.8 9.3 5.4 12.9l128 127.9c3.6 3.6 7.8 5.4 12.8 5.4s9.2-1.8 12.8-5.4L287 95c3.5-3.5 5.4-7.8 5.4-12.8 0-5-1.9-9.2-5.5-12.8z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '8px',
              paddingRight: '24px',
            }}
          >
            {AVAILABLE_INTERVALS.map((interval) => (
              <option key={interval} value={interval}>{interval}</option>
            ))}
          </select>
        </div>

        {!isLoading && displayData.length > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: isMobile ? '4px' : 0,
            width: isMobile ? '100%' : 'auto',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '8px' }}>
              {formatPrice(priceStats.currentPrice)}
            </div>
            <div style={{
              backgroundColor: priceStats.isPriceUp ? 'rgba(38, 166, 154, 0.15)' : 'rgba(239, 83, 80, 0.15)',
              color: priceStats.isPriceUp ? TV_COLORS.UP_COLOR : TV_COLORS.DOWN_COLOR,
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>
              {priceStats.isPriceUp ? '+' : ''}
              {priceStats.priceChangePercent.toFixed(2)}%
            </div>
          </div>
        )}
      </div>

      {/* Chart Controls: Timeframes and Chart Type */}
      <div style={{
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Timeframe Buttons */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${isMobile ? 4 : 7}, 1fr)`,
          gap: '4px',
          width: '100%',
        }}>
          {Object.keys(timeframeDaysMap).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={getButtonStyle(timeframe === tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type and Zoom Controls */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '4px',
          width: '100%',
        }}>
          <button
            onClick={toggleChartType}
            style={getButtonStyle()}
            title={isLineChart ? 'Switch to candlestick' : 'Switch to line'}
          >
            {isLineChart ? <CandlestickIcon size={16} /> : <LineChartIcon size={16} />}
          </button>

          <button
            onClick={toggleVolumeDisplay}
            style={getButtonStyle()}
            title={showVolume ? 'Hide volume' : 'Show volume'}
          >
            {showVolume ? 'Vol ✓' : 'Vol'}
          </button>

          <button
            onClick={() => handleScroll('left')}
            style={getButtonStyle()}
            title="Pan left"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => handleScroll('right')}
            style={getButtonStyle()}
            title="Pan right"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleZoomOut}
            style={getButtonStyle()}
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={handleZoomIn}
            style={getButtonStyle()}
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${chartHeight}px`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #2962FF',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto',
            }}></div>
            <div>Loading chart...</div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Error Message */}
      {!isLoading && errorMessage && (
        <div style={{
          backgroundColor: 'rgba(239, 83, 80, 0.1)',
          color: TV_COLORS.DOWN_COLOR,
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          {errorMessage}
        </div>
      )}

       {/* Main Chart */}
      {!isLoading && displayData.length > 0 && (
        <div style={{ 
          width: '100%', 
          height: showVolume ? `${chartHeight}px` : `${chartHeight}px`,
          overflow: 'hidden',
        }}>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type={isLineChart ? 'line' : 'candlestick'}
            height={showVolume ? chartHeight - volumeHeight : chartHeight}
            width="100%"
          />
          
          {showVolume && (
            <div style={{ width: '100%', height: `${volumeHeight}px` }}>
              <ReactApexChart
                options={{
                  ...chartOptions,
                  chart: { ...chartOptions.chart, height: volumeHeight },
                  yaxis: chartOptions.yaxis[1],
                }}
                series={[chartSeries[1]]}
                type="bar"
                height={volumeHeight}
                width="100%"
              />
            </div>
          )}
        </div>
      )}

     {/* Stats at bottom */}
     {!isLoading && displayData.length > 0 && (
       <div style={{
         marginTop: '12px',
         padding: '10px',
         backgroundColor: 'rgba(42, 46, 57, 0.5)',
         borderRadius: '6px',
         display: 'grid',
         gridTemplateColumns: 'repeat(2, 1fr)',
         gap: '10px',
       }}>
         <div>
           <div style={{ fontSize: '10px', color: 'rgba(180, 185, 190, 0.7)' }}>
             Price
           </div>
           <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
             {formatPrice(priceStats.currentPrice)}
           </div>
         </div>
         
         <div>
           <div style={{ fontSize: '10px', color: 'rgba(180, 185, 190, 0.7)' }}>
             24h Change
           </div>
           <div style={{
             fontWeight: 'bold',
             fontSize: '14px',
             color: priceStats.isPriceUp ? TV_COLORS.UP_COLOR : TV_COLORS.DOWN_COLOR,
           }}>
             {priceStats.isPriceUp ? '+' : ''}
             {priceStats.priceChangePercent.toFixed(2)}%
           </div>
         </div>
         
         <div>
           <div style={{ fontSize: '10px', color: 'rgba(180, 185, 190, 0.7)' }}>
             24h High
           </div>
           <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
             {formatPrice(priceStats.high24h)}
           </div>
         </div>
         
         <div>
           <div style={{ fontSize: '10px', color: 'rgba(180, 185, 190, 0.7)' }}>
             24h Low
           </div>
           <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
             {formatPrice(priceStats.low24h)}
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default TradingViewChart;