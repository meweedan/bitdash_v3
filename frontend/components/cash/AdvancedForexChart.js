import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import {
  ArrowUpDown,
  LineChart,
  CandlestickChart,
  ZoomOut,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// TradingView-style color constants
const TV_COLORS = {
  UP_COLOR: '#26a69a', // Green for bullish candles
  DOWN_COLOR: '#ef5350', // Red for bearish candles
  VOLUME_UP_COLOR: 'rgba(38, 166, 154, 0.5)', // Semi-transparent green
  VOLUME_DOWN_COLOR: 'rgba(239, 83, 80, 0.5)', // Semi-transparent red
  GRID_COLOR: 'rgba(120, 123, 134, 0.1)', // Subtle grid lines
  CROSSHAIR_COLOR: 'rgba(120, 123, 134, 0.6)', // More visible crosshair
  LINE_COLOR: '#2962FF', // Strong blue for line charts
  BACKGROUND: '#131722', // TradingView dark theme background
  TEXT_COLOR: '#b4b9be', // Light gray text
  BUTTON_BG: '#2a2e39', // Button background
  BUTTON_HOVER: '#363a45', // Button hover state
};

// Time frame constants
const timeframeDaysMap = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  All: Infinity,
};

// Available pairs to select from
const AVAILABLE_PAIRS = [
  'BTC',
  'ETH',
  'USDT',
  'XRP',
  'SOL',
  'ADA',
  'BNB',
  'DOGE', // Crypto
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'AUDUSD',
  'USDCAD',
  'EURGBP',
  'EURJPY', // Forex
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'TSLA',
  'NVDA',
  'META', // Stocks
  'XAU',
  'XAG',
  'CL',
  'NG', // Commodities
];

// Available intervals
const AVAILABLE_INTERVALS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

/** ============ Refined Candle Shape (similar to second snippet) ============ */
function RefinedCandle({ x, y, width, height, payload }) {
  // If bounding box or data is missing, skip
  if (!payload || height === 0) return null;
  const { open, high, low, close } = payload;
  if (open == null || high == null || low == null || close == null) return null;

  const color = close >= open ? TV_COLORS.UP_COLOR : TV_COLORS.DOWN_COLOR;

  // Because Recharts calculates a "full bar" from top to bottom for dataKey="high"
  // we need to manually map each price to a Y coordinate.
  // The provided (x, y, width, height) is the bar's entire bounding box.
  // We'll figure out how to place the candle inside that box:
  const maxPrice = Math.max(high, low);
  const minPrice = Math.min(high, low);
  const priceRange = maxPrice - minPrice;
  if (priceRange === 0) return null; // avoid division by zero

  // Convert a given price to a Y coordinate within [y, y + height]
  // But note that Recharts top is y, bottom is y+height
  const getY = (p) => {
    // Distance from top = ratio * totalHeight
    // ratio = (maxPrice - p) / priceRange
    return y + ((maxPrice - p) / priceRange) * height;
  };

  const highY = getY(high);
  const lowY = getY(low);
  const openY = getY(open);
  const closeY = getY(close);

  // Candle body width
  const candleWidth = Math.max(Math.min(width * 0.75, 8), 1);

  return (
    <g>
      {/* Wick (high -> low) */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body (open -> close) */}
      <rect
        x={x + (width - candleWidth) / 2}
        y={Math.min(openY, closeY)}
        width={candleWidth}
        height={Math.max(1, Math.abs(openY - closeY))}
        fill={color}
      />
    </g>
  );
}

/** Volume bar component with color coding, same as original */
const VolumeBar = (props) => {
  const { x, y, width, height, payload } = props;

  if (!payload) return null;

  const isUp = payload.close >= payload.open;
  const color = isUp ? TV_COLORS.VOLUME_UP_COLOR : TV_COLORS.VOLUME_DOWN_COLOR;

  // Make the volume bar width proportionate
  const barWidth = Math.max(Math.min(width * 0.7, 8), 1);

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

/** Custom tooltip for displaying OHLCV data */
const CustomTooltip = ({ active, payload, label, selectedPair }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const formatValue = (value) => {
      if (value == null) return '-';
      const isCrypto = [
        'BTC',
        'ETH',
        'XRP',
        'SOL',
        'ADA',
        'BNB',
        'DOGE',
        'USDT',
      ].includes(selectedPair);

      let precision = 2; // Default
      if (isCrypto) {
        if (value < 0.1) precision = 6;
        else if (value < 10) precision = 4;
        else precision = 2;
      } else if (selectedPair.includes('JPY')) {
        precision = 3;
      } else if (value > 1000) {
        precision = 1;
      } else if (value < 1) {
        precision = 5;
      }
      return value.toFixed(precision);
    };

    const formattedDate =
      typeof label === 'number'
        ? new Date(label).toLocaleString()
        : new Date(data.timestamp || label).toLocaleString();

    return (
      <div
        style={{
          backgroundColor: 'rgba(32, 34, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {formattedDate}
        </div>
        <div>O: {formatValue(data.open)}</div>
        <div>H: {formatValue(data.high)}</div>
        <div>L: {formatValue(data.low)}</div>
        <div>C: {formatValue(data.close)}</div>
        {data.volume > 0 && <div>V: {data.volume.toLocaleString()}</div>}
      </div>
    );
  }
  return null;
};

const TradingViewChart = () => {
  // State for chart data and UI controls
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

  // Load data when pair or interval changes
  useEffect(() => {
    async function loadChartData() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        // Attempt to load JSON file
        const filePath = `/chart-data/${selectedPair}_${selectedInterval}_candles.json`;
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to load data (${response.status})`);
        }

        const rawData = await response.json();
        let formattedData;

        if (Array.isArray(rawData) && rawData.length > 0) {
          if (Array.isArray(rawData[0])) {
            // Format 1: Array of arrays [timestamp, open, high, low, close, volume]
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
            // Format 2: Objects with symbol, timestamp, open, high, low, close
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
            // Format 3: Exchange rate data
            formattedData = rawData.map((item) => ({
              timestamp: new Date(item.timestamp).getTime(),
              date: new Date(item.timestamp).toLocaleDateString(),
              time: new Date(item.timestamp).toLocaleTimeString(),
              open: item.open_rate,
              high: item.high_rate,
              low: item.low_rate,
              close: item.rate,
              volume: item.volume || 0,
              pair: `${item.from_currency}/${item.to_currency}`,
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
        setErrorMessage(
          `Could not load data for ${selectedPair} (${selectedInterval}). Using fallback data.`
        );

        const fallbackData = generateFallbackData();
        setChartData(fallbackData);
        setIsLoading(false);
      }
    }

    loadChartData();
  }, [selectedPair, selectedInterval]);

  // Generate fallback data
  const generateFallbackData = () => {
    const fallbackData = [];
    const now = new Date();
    const isCrypto = [
      'BTC',
      'ETH',
      'XRP',
      'ADA',
      'SOL',
      'BNB',
      'DOGE',
      'USDT',
    ].includes(selectedPair);

    let basePrice;
    if (isCrypto) {
      basePrice =
        selectedPair === 'BTC'
          ? 70000
          : selectedPair === 'ETH'
          ? 3000
          : selectedPair === 'XRP'
          ? 0.5
          : selectedPair === 'ADA'
          ? 0.4
          : selectedPair === 'SOL'
          ? 100
          : selectedPair === 'BNB'
          ? 300
          : selectedPair === 'DOGE'
          ? 0.1
          : 1;
    } else if (selectedPair === 'EURUSD') {
      basePrice = 1.08;
    } else if (selectedPair === 'USDJPY') {
      basePrice = 150;
    } else if (selectedPair === 'GBPUSD') {
      basePrice = 1.27;
    } else if (selectedPair === 'AUDUSD') {
      basePrice = 0.65;
    } else if (selectedPair === 'USDCAD') {
      basePrice = 1.35;
    } else if (selectedPair === 'EURGBP') {
      basePrice = 0.85;
    } else if (selectedPair === 'EURJPY') {
      basePrice = 160;
    } else if (selectedPair === 'XAU') {
      basePrice = 2000;
    } else if (selectedPair === 'XAG') {
      basePrice = 25;
    } else if (selectedPair === 'CL') {
      basePrice = 75;
    } else if (selectedPair === 'NG') {
      basePrice = 3;
    } else {
      // Stocks
      basePrice =
        selectedPair === 'AAPL'
          ? 175
          : selectedPair === 'MSFT'
          ? 400
          : selectedPair === 'GOOGL'
          ? 140
          : selectedPair === 'AMZN'
          ? 180
          : selectedPair === 'TSLA'
          ? 180
          : selectedPair === 'NVDA'
          ? 800
          : selectedPair === 'META'
          ? 450
          : 100;
    }

    const volatility = isCrypto ? 0.03 : 0.005;

    const intervalHours =
      selectedInterval === '1m'
        ? 1 / 60
        : selectedInterval === '5m'
        ? 5 / 60
        : selectedInterval === '15m'
        ? 15 / 60
        : selectedInterval === '30m'
        ? 30 / 60
        : selectedInterval === '1h'
        ? 1
        : selectedInterval === '4h'
        ? 4
        : selectedInterval === '1d'
        ? 24
        : 24;

    const dataPoints =
      selectedInterval === '1d'
        ? 365
        : selectedInterval === '4h'
        ? 365 * 6
        : selectedInterval === '1h'
        ? 365 * 24
        : selectedInterval === '30m'
        ? 7 * 48
        : selectedInterval === '15m'
        ? 7 * 96
        : selectedInterval === '5m'
        ? 7 * 288
        : selectedInterval === '1m'
        ? 1 * 1440
        : 100;

    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i * intervalHours);

      const trendFactor =
        1 +
        Math.sin(i / (dataPoints / 4)) * 0.1 +
        Math.sin(i / (dataPoints / 12)) * 0.05 +
        (i / dataPoints) * (Math.random() > 0.5 ? 0.2 : -0.2);

      const dayRate = basePrice * trendFactor;

      const rangeFactor = volatility / 2;
      const open = dayRate * (1 + (Math.random() - 0.5) * rangeFactor);
      const high = Math.max(open, dayRate) * (1 + Math.random() * rangeFactor);
      const low = Math.min(open, dayRate) * (1 - Math.random() * rangeFactor);
      const close = dayRate * (1 + (Math.random() - 0.5) * rangeFactor);

      const baseVolume = isCrypto ? 5_000_000 : 1_000_000;
      const volumeMultiplier = Math.random() > 0.9 ? 3 : 1;
      const volume = baseVolume * (0.5 + Math.random()) * volumeMultiplier;

      fallbackData.push({
        timestamp: date.getTime(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        open,
        high,
        low,
        close,
        volume,
      });
    }

    fallbackData.sort((a, b) => a.timestamp - b.timestamp);
    return fallbackData;
  };

  // Filter and zoom data
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

  // Price stats
  const priceStats = useMemo(() => {
    if (!displayData.length)
      return {
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        isPriceUp: false,
      };

    const currentPrice = displayData[displayData.length - 1].close;
    const previousPrice =
      displayData.length > 1
        ? displayData[displayData.length - 2].close
        : currentPrice;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = (priceChange / previousPrice) * 100;

    // For 24h high and low, take the last 24 items if we have them
    // or slice whatever we have if less than 24 points.
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

  // Price formatter
  const formatPrice = (price) => {
    if (price == null) return '-';
    const isCrypto = [
      'BTC',
      'ETH',
      'XRP',
      'ADA',
      'SOL',
      'BNB',
      'DOGE',
      'USDT',
    ].includes(selectedPair);

    let decimals = 2;
    if (isCrypto) {
      if (price < 0.1) decimals = 6;
      else if (price < 10) decimals = 4;
      else decimals = 2;
    } else if (selectedPair.includes('JPY')) {
      decimals = 3;
    } else if (price > 1000) {
      decimals = 1;
    } else if (price < 1) {
      decimals = 5;
    }
    return price.toFixed(decimals);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));

  // Pan/Scroll
  const handleScroll = (direction) => {
    const step = Math.max(1, Math.floor(chartData.length / 20));
    setVisibleStartIndex((prev) => {
      if (direction === 'left') {
        return Math.max(0, prev - step);
      } else {
        const maxIndex = Math.max(
          0,
          chartData.length - Math.floor(chartData.length / zoomLevel)
        );
        return Math.min(maxIndex, prev + step);
      }
    });
  };

  const toggleChartType = () => setIsLineChart(!isLineChart);
  const toggleVolumeDisplay = () => setShowVolume(!showVolume);

  // X-axis tick formatting
  const formatXAxisTick = (timestamp) => {
    const date = new Date(timestamp);
    if (selectedInterval === '1d') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else if (['4h', '1h'].includes(selectedInterval)) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Button style
  const buttonStyle = {
    backgroundColor: TV_COLORS.BUTTON_BG,
    color: TV_COLORS.TEXT_COLOR,
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    margin: '0 4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2962FF',
    color: 'white',
  };
  const iconButtonStyle = {
    ...buttonStyle,
    padding: '6px',
  };

  return (
    <div
      style={{
        backgroundColor: TV_COLORS.BACKGROUND,
        color: TV_COLORS.TEXT_COLOR,
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Chart Header with Controls */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            style={{
              backgroundColor: TV_COLORS.BUTTON_BG,
              color: TV_COLORS.TEXT_COLOR,
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '14px',
            }}
          >
            {AVAILABLE_PAIRS.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
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
              padding: '6px 12px',
              fontSize: '14px',
            }}
          >
            {AVAILABLE_INTERVALS.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>

        {!isLoading && displayData.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginRight: '8px',
              }}
            >
              {formatPrice(priceStats.currentPrice)}
            </div>
            <div
              style={{
                backgroundColor: priceStats.isPriceUp
                  ? 'rgba(38, 166, 154, 0.15)'
                  : 'rgba(239, 83, 80, 0.15)',
                color: priceStats.isPriceUp
                  ? TV_COLORS.UP_COLOR
                  : TV_COLORS.DOWN_COLOR,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {priceStats.isPriceUp ? '+' : ''}
              {priceStats.priceChangePercent.toFixed(2)}%
            </div>
          </div>
        )}
      </div>

      {/* Time frame and chart type controls */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {Object.keys(timeframeDaysMap).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={timeframe === tf ? activeButtonStyle : buttonStyle}
            >
              {tf}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={toggleChartType}
            style={iconButtonStyle}
            title={isLineChart ? 'Switch to candlestick' : 'Switch to line chart'}
          >
            {isLineChart ? <CandlestickChart size={16} /> : <LineChart size={16} />}
          </button>

          <button
            onClick={toggleVolumeDisplay}
            style={iconButtonStyle}
            title={showVolume ? 'Hide volume' : 'Show volume'}
          >
            {showVolume ? 'Hide Vol' : 'Show Vol'}
          </button>

          <button
            onClick={() => handleScroll('left')}
            style={iconButtonStyle}
            title="Pan left"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => handleScroll('right')}
            style={iconButtonStyle}
            title="Pan right"
          >
            <ChevronRight size={16} />
          </button>

          <button onClick={handleZoomOut} style={iconButtonStyle} title="Zoom out">
            <ZoomOut size={16} />
          </button>

          <button onClick={handleZoomIn} style={iconButtonStyle} title="Zoom in">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid #2962FF',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto',
              }}
            ></div>
            <div>Loading chart data...</div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Error message */}
      {!isLoading && errorMessage && (
        <div
          style={{
            backgroundColor: 'rgba(239, 83, 80, 0.1)',
            color: TV_COLORS.DOWN_COLOR,
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Main chart */}
      {!isLoading && displayData.length > 0 && (
        <div style={{ width: '100%', height: showVolume ? '500px' : '600px' }}>
          {/* Price chart */}
          <div style={{ width: '100%', height: showVolume ? '80%' : '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {isLineChart ? (
                /* -- LINE CHART (AreaChart) -- */
                <AreaChart
                  data={displayData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={TV_COLORS.LINE_COLOR}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={TV_COLORS.LINE_COLOR}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    tick={{ fill: TV_COLORS.TEXT_COLOR, fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                    tickLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => formatPrice(value)}
                    orientation="right"
                    tick={{ fill: TV_COLORS.TEXT_COLOR, fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                    tickLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <CartesianGrid stroke={TV_COLORS.GRID_COLOR} />
                  <Tooltip content={<CustomTooltip selectedPair={selectedPair} />} />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={TV_COLORS.LINE_COLOR}
                    fill="url(#colorClose)"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: TV_COLORS.LINE_COLOR,
                      fill: TV_COLORS.LINE_COLOR,
                    }}
                  />
                  <ReferenceLine
                    y={priceStats.currentPrice}
                    stroke={
                      priceStats.isPriceUp
                        ? TV_COLORS.UP_COLOR
                        : TV_COLORS.DOWN_COLOR
                    }
                    strokeDasharray="3 3"
                  />
                </AreaChart>
              ) : (
                /* -- CANDLESTICK CHART (ComposedChart) -- */
                <ComposedChart
                  data={displayData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    tick={{ fill: TV_COLORS.TEXT_COLOR, fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                    tickLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => formatPrice(value)}
                    orientation="right"
                    tick={{ fill: TV_COLORS.TEXT_COLOR, fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                    tickLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <CartesianGrid stroke={TV_COLORS.GRID_COLOR} />
                  <Tooltip content={<CustomTooltip selectedPair={selectedPair} />} />

                  {/* Our refined candlestick bar */}
                  <Bar
                    dataKey="high"
                    fill="none"
                    shape={RefinedCandle}
                    isAnimationActive={false}
                  />

                  <ReferenceLine
                    y={priceStats.currentPrice}
                    stroke={
                      priceStats.isPriceUp
                        ? TV_COLORS.UP_COLOR
                        : TV_COLORS.DOWN_COLOR
                    }
                    strokeDasharray="3 3"
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Volume chart */}
          {showVolume && (
            <div style={{ width: '100%', height: '20%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayData}
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxisTick}
                    height={0}
                    tick={false}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <YAxis
                    dataKey="volume"
                    domain={['auto', 'auto']}
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}M`
                        : `${(value / 1000).toFixed(0)}K`
                    }
                    orientation="right"
                    tick={{ fill: TV_COLORS.TEXT_COLOR, fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                    tickLine={{ stroke: 'rgba(120, 123, 134, 0.3)' }}
                  />
                  <CartesianGrid stroke={TV_COLORS.GRID_COLOR} />
                  <Tooltip content={<CustomTooltip selectedPair={selectedPair} />} />
                  <Bar
                    dataKey="volume"
                    shape={<VolumeBar />}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Price statistics */}
      {!isLoading && displayData.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'rgba(42, 46, 57, 0.5)',
            borderRadius: '6px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(180, 185, 190, 0.7)' }}>
              Current Price
            </div>
            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>
              {formatPrice(priceStats.currentPrice)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'rgba(180, 185, 190, 0.7)' }}>
              24h Change
            </div>
            <div
              style={{
                fontWeight: 'bold',
                marginTop: '4px',
                color: priceStats.isPriceUp
                  ? TV_COLORS.UP_COLOR
                  : TV_COLORS.DOWN_COLOR,
              }}
            >
              {priceStats.isPriceUp ? '+' : ''}
              {priceStats.priceChangePercent.toFixed(2)}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'rgba(180, 185, 190, 0.7)' }}>
              24h High
            </div>
            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>
              {formatPrice(priceStats.high24h)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'rgba(180, 185, 190, 0.7)' }}>
              24h Low
            </div>
            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>
              {formatPrice(priceStats.low24h)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;
