// components/AdvancedChart.js

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
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

export default function TradingViewChart({ selectedCoin, coins, onPairSelect }) {
  const cryptoPairs = ['BTC','ETH','BNB','XRP','ADA','DOGE','SOL','DOT','LINK','UNI','SHIB','AVAX','LTC'];
  const forexPairs = ['EURUSD','USDJPY','GBPUSD','AUDUSD','USDCAD','USDCHF','NZDUSD','XAU','XAG'];
  const stockPairs = ['AAPL','MSFT','GOOGL','AMZN','META','TSLA','NVDA','INTC','JNJ','JPM','NFLX','PYPL'];
  const intervals = ['5m','15m','1h','4h','1d'];
  const [win, setWin] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  const [sub, setSub] = useState('');
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  
  // Use the passed-in selectedCoin (if any) to initialize the pair; otherwise default to 'BTC'
  const [selectedPair, setSelectedPair] = useState(selectedCoin ? selectedCoin.symbol.toUpperCase() : 'BTC');
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
  const tfMap = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'All': Infinity };

  // For mobile search modal
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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

  const mb = win.width < 768;
  const chartH = mb ? Math.min(350, win.height * 0.5) : 600;
  const volH = mb ? 70 : 120;

  const chartOptions = useMemo(() => ({
    chart: {
      type: line ? 'line' : 'candlestick',
      height: chartH,
      background: dark ? '#000' : '#fff',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false }
    },
    plotOptions: {
      candlestick: { colors: { upward: '#26a69a', downward: '#ef5350' }, wick: { useFillColor: true } },
      bar: { columnWidth: '80%' }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { color: dark ? 'white' : 'black', fontSize: '10px' },
        formatter: v => {
          const dt = new Date(v);
          if (selectedInterval === '1d') {
            return mb ? dt.getDate() : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
          style: { color: dark ? 'white' : 'black', fontSize: '10px' },
          formatter: val => fp(val)
        },
        axisBorder: { show: false },
        tooltip: { enabled: true }
      },
      {
        show: vol && hasVol,
        opposite: true,
        labels: {
          style: { color: dark ? 'white' : 'black', fontSize: '10px' },
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
        return `<div style="background:${dark?'rgba(32,34,42,0.95)':'rgba(255,255,255,0.95)'};border:1px solid ${
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
          borderColor: '#FFC107',
          label: {
            borderColor: 'transparent',
            style: { color:'#FFC107', background:'rgba(255,193,7,0.1)', fontSize:'20px', fontWeight:'bold' },
            text:'404 - No Data',
            position:'middle'
          }
        }
      ]
    } : undefined
  }), [line, chartH, dark, selectedInterval, mb, vol, hasVol, noData, filteredData]);

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
      color: line ? '#2962FF' : undefined
    };
    if (vol && hasVol && !noData) {
      const volum = {
        name:'Volume',
        type:'bar',
        data:d.map(x=>({
          x:new Date(x.timestamp),
          y:x.volume,
          fillColor: x.close>=x.open?'rgba(38,166,154,0.5)':'rgba(239,83,80,0.5)'
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

  const btnStyle = (active=false) => ({
    backgroundColor: active ? '#2962FF' : '#8b7966',
    color: active ? 'white' : dark ? 'white' : 'black',
    border:'none',
    borderRadius:'4px',
    padding: mb ? '10px 0' : '6px 12px',
    fontSize: mb ? '12px' : '14px',
    cursor:'pointer',
    margin:'0 2px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexGrow: mb ? 1 : 0,
    minWidth: mb ? '12px' : 'auto',
    minHeight: mb ? '20px' : 'auto',
    touchAction:'manipulation'
  });

  return (
    <div style={{
      backgroundColor: dark ? '#000' : '#fff',
      color: dark ? 'white' : 'black',
      padding: mb ? '8px' : '10px',
      borderRadius:'8px',
      width:'100%',
      maxWidth:'100vw',
      margin:'0 auto'
    }}>
      {/* Mobile Header: Unified Pricing and Search Markets */}
      {mb ? (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {selectedCoin && selectedCoin.image && (
              <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width:'24px', height:'24px' }} />
            )}
            <span style={{ fontWeight:'bold', fontSize:'16px' }}>
              {selectedCoin ? selectedCoin.symbol.toUpperCase() : selectedPair}
            </span>
            {!loading && filteredData.length > 0 && !noData && (
              <>
                <span style={{ fontSize:'16px' }}>{fp(stats.currentPrice)}</span>
                <span style={{
                  backgroundColor: stats.isPriceUp ? 'rgba(38,166,154,0.15)' : 'rgba(239,83,80,0.15)',
                  color: stats.isPriceUp ? '#26a69a' : '#ef5350',
                  padding:'2px 8px',
                  borderRadius:'4px',
                  fontWeight:'bold'
                }}>
                  {stats.isPriceUp ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </span>
              </>
            )}
          </div>
          <button onClick={() => setShowSearch(true)} style={{ padding:'8px 12px', borderRadius:'4px', backgroundColor:'#2962FF', color:'white', fontSize:'14px' }}>
            Search Markets
          </button>
        </div>
      ) : (
        // Desktop Header: Pair and Interval selectors with pricing info
        <div style={{ display:'flex', flexDirection:'row', gap:'8px', marginBottom:'12px' }}>
          <div style={{ display:'flex', width:'100%', gap:'8px' }}>
            <select
              value={selectedPair}
              onChange={e => { 
                setSelectedPair(e.target.value); 
                if(onPairSelect && coins) { 
                  const coin = coins.find(c => c.symbol.toUpperCase() === e.target.value);
                  if(coin) onPairSelect(coin);
                }
              }}
              style={{
                backgroundColor:'#8b7966',
                color: dark ? 'white' : 'black',
                border:'none',
                borderRadius:'4px',
                padding:'10px',
                fontSize:'14px',
                flexGrow:1,
                maxWidth:'130px',
                appearance:'none'
              }}
            >
              {getPairs().map(x=>(
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            <select
              value={selectedInterval}
              onChange={e => setSelectedInterval(e.target.value)}
              style={{
                backgroundColor:'#8b7966',
                color: dark ? 'white' : 'black',
                border:'none',
                borderRadius:'4px',
                padding:'10px',
                fontSize:'14px',
                flexGrow:1,
                maxWidth:'100px',
                appearance:'none'
              }}
            >
              {intervals.map(x=>(
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
          {!loading && filteredData.length>0 && !noData && (
            <div style={{ display:'flex', alignItems:'center', width:'auto' }}>
              <div style={{ fontSize:'16px', fontWeight:'bold', marginRight:'8px' }}>
                {fp(stats.currentPrice)}
              </div>
              <div style={{
                backgroundColor: stats.isPriceUp ? 'rgba(38,166,154,0.15)' : 'rgba(239,83,80,0.15)',
                color: stats.isPriceUp ? '#26a69a' : '#ef5350',
                padding:'2px 8px',
                borderRadius:'4px',
                fontSize:'12px',
                fontWeight:'bold'
              }}>
                {stats.isPriceUp ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Markets Modal for Mobile */}
      {showSearch && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          backgroundColor:'rgba(0,0,0,0.5)',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          zIndex:1000
        }} onClick={() => setShowSearch(false)}>
          <div style={{
            backgroundColor: dark ? '#000' : '#fff',
            padding:'16px',
            borderRadius:'8px',
            width:'80%',
            maxHeight:'80%',
            overflowY:'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom:'8px' }}>
              <input
                type="text"
                placeholder="Search markets"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width:'100%',
                  padding:'8px',
                  fontSize:'14px',
                  borderRadius:'4px',
                  border:'1px solid #ccc'
                }}
              />
            </div>
            <div>
              {coins ? coins
                .filter(coin => 
                  coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(coin => (
                  <div
                    key={coin.id}
                    style={{ padding:'8px', borderBottom:'1px solid #eee', cursor:'pointer' }}
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm('');
                      setSelectedPair(coin.symbol.toUpperCase());
                      if(onPairSelect) onPairSelect(coin);
                    }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <img src={coin.image} alt={coin.name} style={{ width:'24px', height:'24px' }} />
                      <span style={{ fontWeight:'bold' }}>{coin.symbol.toUpperCase()}</span>
                      <span>{coin.name}</span>
                    </div>
                  </div>
              )) : <div>No markets available</div>}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:`repeat(${mb ? 4 : 7},1fr)`,
          gap:'4px',
          width:'100%'
        }}>
          {Object.keys(tfMap).map(x=>(
            <button key={x} onClick={()=>setTimeframe(x)} style={btnStyle(timeframe===x)}>{x}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'4px' }}>
          <button onClick={toggleType} style={btnStyle()} title={line ? 'Candlestick' : 'Line'} disabled={noData}>
            {line ? <CIcon size={16}/> : <LIcon size={16}/>}
          </button>
          <button onClick={toggleVolume} style={btnStyle(vol)} title={vol ? 'Hide volume' : 'Show volume'} disabled={!hasVol || noData}>
            {vol ? 'Vol ✓' : 'Vol'}
          </button>
          <button onClick={()=>scroll('left')} style={btnStyle()} title="Pan left" disabled={noData}>
            <ChLeft size={16}/>
          </button>
          <button onClick={()=>scroll('right')} style={btnStyle()} title="Pan right" disabled={noData}>
            <ChRight size={16}/>
          </button>
          <button onClick={zoomOut} style={btnStyle()} title="Zoom out" disabled={noData}>
            <ZOut size={16}/>
          </button>
          <button onClick={zoomIn} style={btnStyle()} title="Zoom in" disabled={noData}>
            <ZIn size={16}/>
          </button>
        </div>
      </div>
      {loading && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:chartH+'px' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{
              border:'4px solid rgba(255,255,255,0.1)',
              borderTop:'4px solid #2962FF',
              borderRadius:'50%',
              width:'30px',
              height:'30px',
              animation:'spin 1s linear infinite',
              margin:'0 auto 16px auto'
            }}/>
            <div>Loading chart...</div>
            <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      )}
      {!loading && err && !noData && (
        <div style={{
          backgroundColor:'rgba(239,83,80,0.1)',
          color:'#ef5350',
          padding:'12px',
          borderRadius:'4px',
          marginBottom:'16px',
          fontSize:'13px'
        }}>
          {err}
        </div>
      )}
      {!loading && (
        <div style={{ width:'100%', height:chartH+'px', position:'relative' }}>
          <div style={{
            width:'100%',
            height: vol && hasVol && !noData ? (chartH - volH)+'px' : chartH+'px'
          }}>
            <RChart
              options={chartOptions}
              series={mainSeries.length>0 ? [mainSeries[0]] : []}
              type={line ? 'line' : 'candlestick'}
              height="100%"
              width="100%"
            />
          </div>
          {vol && hasVol && !noData && mainSeries.length>1 && (
            <div style={{ width:'100%', height:volH+'px', position:'absolute', bottom:0 }}>
              <RChart
                options={{
                  ...chartOptions,
                  chart:{...chartOptions.chart, height:volH, id:'volume-chart'},
                  xaxis:{...chartOptions.xaxis, labels:{...chartOptions.xaxis.labels, show:false}},
                  yaxis:[{
                    labels:{
                      style:{ color: dark ? 'white' : 'black', fontSize:'1px' },
                      formatter: v => v>=1e6 ? (v/1e6).toFixed(1)+'M' : (v/1e3).toFixed(0)+'K',
                      show:false
                    },
                    opposite:false
                  }],
                  tooltip:{ enabled:false }
                }}
                series={[mainSeries[1]]}
                type="bar"
                height={volH}
                width="100%"
              />
            </div>
          )}
          {!loading && noData && (
            <div style={{
              position:'absolute',
              top:'50%',
              left:'50%',
              transform:'translate(-50%,-50%)',
              textAlign:'center',
              color:'#FFC107',
              backgroundColor:'rgba(0,0,0,0.7)',
              padding:'20px 40px',
              borderRadius:'8px',
              zIndex:10,
              pointerEvents:'none'
            }}>
              <div style={{ fontSize:'40px', fontWeight:'bold', marginBottom:'8px' }}>404</div>
              <div>No data available for {selectedPair} ({selectedInterval}) in timeframe {timeframe}</div>
            </div>
          )}
        </div>
      )}
      {!loading && filteredData.length>0 && !noData && (
        <div style={{
          marginTop:'12px',
          padding:'10px',
          backgroundColor: dark ? 'rgba(42,46,57,0.5)' : 'rgba(240,240,240,0.7)',
          borderRadius:'6px',
          display:'grid',
          gridTemplateColumns:'repeat(2,1fr)',
          gap:'10px'
        }}>
          <div>
            <div style={{ fontSize:'10px', color: dark ? 'rgba(180,185,190,0.7)' : 'rgba(60,60,60,0.7)' }}>Price</div>
            <div style={{ fontWeight:'bold', fontSize:'14px' }}>{fp(stats.currentPrice)}</div>
          </div>
          <div>
            <div style={{ fontSize:'10px', color: dark ? 'rgba(180,185,190,0.7)' : 'rgba(60,60,60,0.7)' }}>24h Change</div>
            <div style={{
              fontWeight:'bold',
              fontSize:'14px',
              color: stats.isPriceUp ? '#26a69a' : '#ef5350'
            }}>
              {stats.isPriceUp ? '+' : ''}
              {stats.priceChangePercent.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize:'10px', color: dark ? 'rgba(180,185,190,0.7)' : 'rgba(60,60,60,0.7)' }}>24h High</div>
            <div style={{ fontWeight:'bold', fontSize:'14px' }}>{fp(stats.high24h)}</div>
          </div>
          <div>
            <div style={{ fontSize:'10px', color: dark ? 'rgba(180,185,190,0.7)' : 'rgba(60,60,60,0.7)' }}>24h Low</div>
            <div style={{ fontWeight:'bold', fontSize:'14px' }}>{fp(stats.low24h)}</div>
          </div>
        </div>
      )}
      {!loading && !hasVol && !noData && (
        <div style={{
          marginTop:'12px',
          backgroundColor:'rgba(255,193,7,0.1)',
          color:'#FFC107',
          padding:'8px 12px',
          borderRadius:'4px',
          fontSize:'12px',
          textAlign:'center'
        }}>
          No volume data available for this pair/timeframe
        </div>
      )}
    </div>
  );
}
