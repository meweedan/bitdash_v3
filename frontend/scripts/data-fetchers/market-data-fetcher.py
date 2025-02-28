#!/usr/bin/env python3
"""
Market Data Fetcher - A robust implementation for fetching financial data from multiple free sources
with fallback mechanisms, caching, and scheduled updates.

This script handles:
- Multiple asset types (crypto, forex, stocks, commodities, indices, ETFs)
- Hourly and intraday data retrieval
- Intelligent caching to minimize API calls
- Automatic failover between data sources
- Scheduled data refreshes
- Saving data to the frontend public/chart-data directory
"""

import os
import json
import time
import logging
import requests
import pandas as pd
import schedule
from pathlib import Path
from datetime import datetime, timedelta
import random
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
import shutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("market_data.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("market_data")

# ----- Configuration -----
# Project paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up to the frontend directory and then to public/chart-data
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..', '..'))
PUBLIC_CHART_DATA = os.path.join(PROJECT_ROOT, 'frontend', 'public', 'chart-data')

# Define asset categories
FIAT = ['USD', 'EUR', 'LYD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SAR', 'AED', 'EGP', 'TRY', 'ZAR', 'RUB', 'INR', 'BRL', 'MXN', 'SGD']
CRYPTO = ['BTC', 'ETH', 'USDT', 'XRP', 'BNB', 'ADA', 'SOL', 'DOT', 'DOGE', 'MATIC', 'LTC', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'BCH', 'ATOM', 'CRO', 'FIL']
METALS = ['XAU', 'XAG', 'XPT', 'XPD', 'HG']  # Gold, Silver, Platinum, Palladium, Copper
COMMODITIES = ['CL', 'NG', 'BZ', 'HO', 'RB', 'ZC', 'ZS', 'KE', 'ZW', 'CC', 'CT', 'KC', 'SB', 'JO', 'LBS']
INDICES = ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^GDAXI', '^FCHI', '^N225', '^HSI', '^TNX', '^VIX']

FOREX_PAIRS = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD',
    'EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'CADJPY', 'CHFJPY', 'EURAUD',
    'EURCHF', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'AUDCAD', 'AUDCHF', 'CADCHF',
    # MENA region currency pairs
    'USDSAR', 'USDAED', 'USDEGP', 'USDTRY', 'USDZAR', 'USDRUB', 'USDINR'
]

ETFS = [
    # US ETFs
    'SPY',   # SPDR S&P 500 ETF
    'QQQ',   # Invesco QQQ (Nasdaq 100)
    'IWM',   # iShares Russell 2000
    'DIA',   # SPDR Dow Jones Industrial Average
    'VTI',   # Vanguard Total Stock Market
    'VEA',   # Vanguard FTSE Developed Markets
    'VWO',   # Vanguard FTSE Emerging Markets
    'AGG',   # iShares Core U.S. Aggregate Bond
    'BND',   # Vanguard Total Bond Market
    'VNQ',   # Vanguard Real Estate
    'GLD',   # SPDR Gold Shares
    'SLV',   # iShares Silver Trust
    'XLE',   # Energy Select Sector SPDR
    'XLF',   # Financial Select Sector SPDR
    'XLK',   # Technology Select Sector SPDR
    'XLV',   # Health Care Select Sector SPDR
    'XLY',   # Consumer Discretionary Select Sector SPDR
    'XLP'    # Consumer Staples Select Sector SPDR
]

POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'PYPL', 'INTC',
                 'JNJ', 'V', 'PG', 'JPM', 'WMT', 'DIS', 'BAC', 'PFE', 'KO', 'MRK']

# Aggregate all symbols
ALL_SYMBOLS = list(set(FIAT + CRYPTO + METALS + COMMODITIES + INDICES + FOREX_PAIRS + ETFS + POPULAR_STOCKS))

# API Keys - Fixed values instead of environment variables
ALPHA_VANTAGE_API_KEY = "SDFGFKZGTCY2BTG"
TWELVEDATA_API_KEY = "f1d44b9f025c4f7cb11bea025910eae7"
FMP_API_KEY = "da89fFQkNjDCwpoiH7VMglekEvkJbMF0"

# Cache configuration
CACHE_DIR = "cache"
DEFAULT_CACHE_TTL = {
    "1m": 60 * 10,           # 10 minutes for 1-minute data
    "5m": 60 * 30,           # 30 minutes for 5-minute data
    "15m": 60 * 60,          # 1 hour for 15-minute data
    "30m": 60 * 60 * 2,      # 2 hours for 30-minute data
    "1h": 60 * 60 * 4,       # 4 hours for 1-hour data
    "4h": 60 * 60 * 12,      # 12 hours for 4-hour data
    "1d": 24 * 60 * 60       # 1 day for daily data
}
OUTPUT_DIR = "data"
MAX_WORKERS = 5  # Max parallel requests

# Define all supported intervals
INTERVALS = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"]

# ----- Data Source Classes -----
class DataSource:
    """Base class for all data sources"""
    
    def __init__(self, name):
        self.name = name
        self.rate_limit_reset = 0
    
    def fetch(self, symbol, interval, start_date, end_date):
        """Fetch data for the given symbol and timeframe"""
        raise NotImplementedError("Subclasses must implement this method")
    
    def _handle_rate_limits(self):
        """Handle rate limiting with exponential backoff"""
        current_time = time.time()
        if current_time < self.rate_limit_reset:
            sleep_time = self.rate_limit_reset - current_time + random.uniform(0.1, 1.0)
            logger.info(f"Rate limit for {self.name}, sleeping for {sleep_time:.2f}s")
            time.sleep(sleep_time)
        
        # Set a new rate limit reset time with jitter
        self.rate_limit_reset = time.time() + random.uniform(1.0, 3.0)
    
    def _make_request(self, url, params=None, headers=None, max_retries=3):
        """Make HTTP request with retry logic"""
        for attempt in range(max_retries):
            try:
                self._handle_rate_limits()
                response = requests.get(url, params=params, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    return response.json()
                
                if response.status_code == 429:  # Too Many Requests
                    wait_time = 2 ** attempt + random.uniform(0, 1)
                    logger.warning(f"{self.name} rate limited. Waiting {wait_time:.2f}s. Attempt {attempt+1}/{max_retries}")
                    time.sleep(wait_time)
                    continue
                
                logger.error(f"{self.name} API error: Status {response.status_code}, Response: {response.text}")
                
            except Exception as e:
                logger.error(f"{self.name} request failed: {e}. Attempt {attempt+1}/{max_retries}")
                
            # Exponential backoff
            wait_time = 2 ** attempt + random.uniform(0, 1)
            time.sleep(wait_time)
        
        return None

class YahooFinanceSource(DataSource):
    """Yahoo Finance data source using direct API calls"""
    
    def __init__(self):
        super().__init__("YahooFinance")
        self.base_url = "https://query1.finance.yahoo.com/v8/finance/chart"
    
    def fetch(self, symbol, interval="1h", start_date=None, end_date=None):
        # Convert dates to UNIX timestamps
        if start_date:
            start_ts = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp())
        else:
            start_ts = int((datetime.now() - timedelta(days=7)).timestamp())
        
        if end_date:
            end_ts = int(datetime.strptime(end_date, "%Y-%m-%d").timestamp())
        else:
            end_ts = int(datetime.now().timestamp())
        
        # Map interval to Yahoo format
        interval_map = {
            "1m": "1m",
            "5m": "5m",
            "15m": "15m",
            "30m": "30m",
            "1h": "1h",
            "4h": "4h",
            "1d": "1d"
        }
        yahoo_interval = interval_map.get(interval, "1h")
        
        # Adjust symbol format for Yahoo if needed
        yahoo_symbol = self._get_yahoo_symbol(symbol)
        
        # Prepare request
        params = {
            "symbol": yahoo_symbol,
            "period1": start_ts,
            "period2": end_ts,
            "interval": yahoo_interval,
            "includePrePost": "false",
            "events": "div,splits"
        }
        
        url = f"{self.base_url}/{yahoo_symbol}"
        data = self._make_request(url, params=params)
        
        if not data or "chart" not in data or "result" not in data["chart"] or not data["chart"]["result"]:
            logger.warning(f"No data returned from Yahoo Finance for {symbol}")
            return None
        
        # Parse the response
        chart_data = data["chart"]["result"][0]
        timestamps = chart_data["timestamp"]
        ohlcv = chart_data["indicators"]["quote"][0]
        
        # Build DataFrame
        df = pd.DataFrame({
            "timestamp": [datetime.fromtimestamp(ts) for ts in timestamps],
            "open": ohlcv["open"],
            "high": ohlcv["high"],
            "low": ohlcv["low"],
            "close": ohlcv["close"],
            "volume": ohlcv["volume"]
        })
        
        # Clean data by removing rows with NaN values
        df = df.dropna(subset=['open', 'high', 'low', 'close'])
        
        df.set_index("timestamp", inplace=True)
        return df
    
    def _get_yahoo_symbol(self, symbol):
        """Convert our internal symbol to Yahoo Finance format"""
        # Handle forex pairs
        if symbol in FOREX_PAIRS:
            # Check if already in correct format
            if '=' in symbol:
                return symbol
                
            # Standard pairs like EURUSD
            if len(symbol) == 6:
                base = symbol[:3]
                quote = symbol[3:]
                if quote == 'USD':
                    return f"{base}{quote}=X"
                else:
                    return f"{base}{quote}=X"
            
            return f"{symbol}=X"
            
        # Crypto needs -USD suffix
        if symbol in CRYPTO:
            return f"{symbol}-USD"
        
        # Regular Forex currencies need USD=X format
        if symbol in FIAT and symbol != "USD":
            return f"{symbol}USD=X"
        
        # Special cases for metals
        if symbol == "XAU":
            return "GC=F"  # Gold futures
        if symbol == "XAG":
            return "SI=F"  # Silver futures
        if symbol == "XPT":
            return "PL=F"  # Platinum futures
        if symbol == "XPD":
            return "PA=F"  # Palladium futures
        
        # Oil and gas
        if symbol == "CL":
            return "CL=F"  # Crude oil
        if symbol == "NG":
            return "NG=F"  # Natural gas
        
        # Handle international stocks with exchange suffixes
        if '.' in symbol:
            return symbol  # Already formatted with exchange (e.g., SAP.DE)
        
        # Default case
        return symbol

class CoinGeckoSource(DataSource):
    """CoinGecko API source for cryptocurrency data"""
    
    def __init__(self):
        super().__init__("CoinGecko")
        self.base_url = "https://api.coingecko.com/api/v3"
        self.coin_list = None
    
    @lru_cache(maxsize=100)
    def _get_coin_id(self, symbol):
        """Get CoinGecko's internal ID for a given crypto symbol"""
        if not self.coin_list:
            coin_list_url = f"{self.base_url}/coins/list"
            response = self._make_request(coin_list_url)
            
            if not response:
                logger.error("Failed to fetch CoinGecko coin list")
                return None
            
            self.coin_list = {coin["symbol"].upper(): coin["id"] for coin in response}
        
        return self.coin_list.get(symbol.upper())
    
    def fetch(self, symbol, interval="1h", start_date=None, end_date=None):
        if symbol not in CRYPTO:
            logger.info(f"CoinGecko only supports cryptocurrencies, skipping {symbol}")
            return None
        
        coin_id = self._get_coin_id(symbol)
        if not coin_id:
            logger.warning(f"Could not find CoinGecko ID for {symbol}")
            return None
        
        # Calculate days based on start/end dates
        if start_date and end_date:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            days = (end_dt - start_dt).days + 1
        else:
            # Default: fetch 7 days for hourly, 365 days for daily
            days = 7 if interval == "1h" else 365
        
        # For hourly, CoinGecko limits to ~7 days
        if interval in ["1h", "4h"] and days > 7:
            days = 7
            logger.info(f"CoinGecko hourly data limited to 7 days, truncating request for {symbol}")
        
        vs_currency = "usd"
        url = f"{self.base_url}/coins/{coin_id}/market_chart"
        params = {
            "vs_currency": vs_currency,
            "days": days,
            "interval": "hourly" if interval in ["1h", "4h"] else "daily"
        }
        
        data = self._make_request(url, params=params)
        
        if not data or "prices" not in data:
            logger.warning(f"No data returned from CoinGecko for {symbol}")
            return None
        
        # CoinGecko returns data as [timestamp, value] pairs
        prices = data["prices"]
        market_caps = data["market_caps"]
        volumes = data["total_volumes"]
        
        # Create DataFrame
        df = pd.DataFrame({
            "timestamp": [datetime.fromtimestamp(p[0]/1000) for p in prices],
            "close": [p[1] for p in prices],
            "volume": [v[1] for v in volumes]
        })
        
        # CoinGecko doesn't provide OHLC directly for free tier
        # We'll use close price as an approximation for open/high/low
        df["open"] = df["close"].shift(1)
        df["high"] = df["close"]
        df["low"] = df["close"]
        
        # Fill NaN in first row's open with first close
        if not df.empty:
            df.loc[df.index[0], "open"] = df.loc[df.index[0], "close"]
        
        df.set_index("timestamp", inplace=True)
        
        # If we need 4h data, resample from hourly
        if interval == "4h":
            df = df.resample('4H').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum'
            })
            df = df.dropna()
        
        return df

class AlphaVantageSource(DataSource):
    """Alpha Vantage API data source"""
    
    def __init__(self, api_key):
        super().__init__("AlphaVantage")
        self.base_url = "https://www.alphavantage.co/query"
        self.api_key = api_key
    
    def fetch(self, symbol, interval="1h", start_date=None, end_date=None):
        # Skip if no API key provided
        if not self.api_key or self.api_key == "demo":
            logger.warning("No Alpha Vantage API key provided, skipping")
            return None
        
        # Determine which API function to use based on the symbol type
        function = self._get_function_for_symbol(symbol, interval)
        
        # Adjust symbol format for Alpha Vantage
        av_symbol = self._get_av_symbol(symbol)
        
        # Map interval to Alpha Vantage format
        interval_map = {
            "1m": "1min",
            "5m": "5min",
            "15m": "15min",
            "30m": "30min",
            "1h": "60min",
            "4h": "4hour",  # Note: Alpha Vantage doesn't support 4h directly, we'll adjust
            "1d": "daily"
        }
        av_interval = interval_map.get(interval, "60min")
        
        # Check if interval is supported for intraday
        if function == "TIME_SERIES_INTRADAY" and av_interval == "4hour":
            # We'll fetch 1h and resample later
            av_interval = "60min"
        
        params = {
            "function": function,
            "symbol": av_symbol,
            "apikey": self.api_key,
            "outputsize": "full"
        }
        
        # Add interval parameter for intraday data
        if function == "TIME_SERIES_INTRADAY":
            params["interval"] = av_interval
        
        # Add datatype parameter
        params["datatype"] = "json"
        
        data = self._make_request(self.base_url, params=params)
        
        if not data:
            logger.warning(f"No data returned from Alpha Vantage for {symbol}")
            return None
        
        # Check for error messages
        if "Error Message" in data:
            logger.error(f"Alpha Vantage error: {data['Error Message']}")
            return None
        
        # Parse the response based on the data type
        if function == "TIME_SERIES_INTRADAY":
            time_series_key = f"Time Series ({av_interval})"
        elif function == "TIME_SERIES_DAILY":
            time_series_key = "Time Series (Daily)"
        elif function == "FX_DAILY":
            time_series_key = "Time Series FX (Daily)"
        elif function == "FX_INTRADAY":
            time_series_key = f"Time Series FX ({av_interval})"
        elif function == "DIGITAL_CURRENCY_DAILY":
            time_series_key = f"Time Series (Digital Currency Daily)"
        else:
            logger.error(f"Unknown function type: {function}")
            return None
        
        if time_series_key not in data:
            logger.error(f"Expected key {time_series_key} not found in Alpha Vantage response")
            return None
        
        time_series = data[time_series_key]
        
        # Create DataFrame
        records = []
        for date_str, values in time_series.items():
            timestamp = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S" if ":" in date_str else "%Y-%m-%d")
            
            # Skip if outside requested date range
            if start_date and timestamp.date() < datetime.strptime(start_date, "%Y-%m-%d").date():
                continue
            if end_date and timestamp.date() > datetime.strptime(end_date, "%Y-%m-%d").date():
                continue
            
            # Handle different JSON structures
            if function == "DIGITAL_CURRENCY_DAILY":
                record = {
                    "timestamp": timestamp,
                    "open": float(values[f"1a. open (USD)"]),
                    "high": float(values[f"2a. high (USD)"]),
                    "low": float(values[f"3a. low (USD)"]),
                    "close": float(values[f"4a. close (USD)"]),
                    "volume": float(values["5. volume"])
                }
            else:
                record = {
                    "timestamp": timestamp,
                    "open": float(values["1. open"]),
                    "high": float(values["2. high"]),
                    "low": float(values["3. low"]),
                    "close": float(values["4. close"]),
                    "volume": float(values.get("5. volume", 0))
                }
            
            records.append(record)
        
        if not records:
            logger.warning(f"No data found in date range for {symbol}")
            return None
        
        df = pd.DataFrame(records)
        df.set_index("timestamp", inplace=True)
        df.sort_index(inplace=True)
        
        # If we need 4h data and have 1h data, resample
        if interval == "4h" and function == "TIME_SERIES_INTRADAY" and av_interval == "60min":
            df = df.resample('4H').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum'
            })
            df = df.dropna()
        
        return df
    
    def _get_function_for_symbol(self, symbol, interval):
        """Determine the appropriate Alpha Vantage API function for the symbol"""
        is_intraday = interval in ["1m", "5m", "15m", "30m", "1h", "4h"]
        
        # Handle forex pairs
        if symbol in FOREX_PAIRS:
            return "FX_INTRADAY" if is_intraday else "FX_DAILY"
            
        # Handle cryptocurrencies
        if symbol in CRYPTO:
            return "DIGITAL_CURRENCY_DAILY"  # Alpha Vantage has limited intraday crypto
            
        # Handle standard forex currencies
        if symbol in FIAT:
            return "FX_INTRADAY" if is_intraday else "FX_DAILY"
            
        # Default to standard time series
        return "TIME_SERIES_INTRADAY" if is_intraday else "TIME_SERIES_DAILY"
    
    def _get_av_symbol(self, symbol):
        """Format symbol for Alpha Vantage"""
        # Handle forex pairs
        if symbol in FOREX_PAIRS:
            if len(symbol) == 6:
                return f"{symbol[:3]}/{symbol[3:]}"
            return symbol  # Return as is if not standard format
        
        # Handle single currencies against USD
        if symbol in FIAT and symbol != "USD":
            return f"USD/{symbol}"  # Alpha Vantage uses USD/EUR format for forex
            
        # Default case
        return symbol

class TwelveDataSource(DataSource):
    """Twelve Data API source"""
    
    def __init__(self, api_key):
        super().__init__("TwelveData")
        self.base_url = "https://api.twelvedata.com"
        self.api_key = api_key
    
    def fetch(self, symbol, interval="1h", start_date=None, end_date=None):
        # Skip if no API key provided
        if not self.api_key:
            logger.warning("No Twelve Data API key provided, skipping")
            return None
        
        # Map interval to Twelve Data format
        interval_map = {
            "1m": "1min",
            "5m": "5min",
            "15m": "15min",
            "30m": "30min",
            "1h": "1h",
            "4h": "4h",
            "1d": "1day"
        }
        td_interval = interval_map.get(interval, "1h")
        
        # Adjust symbol format if needed
        td_symbol = self._get_td_symbol(symbol)
        
        # Calculate output size based on date range
        if start_date and end_date:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            days = (end_dt - start_dt).days + 1
            
            # Approximate number of bars needed based on interval
            bars_per_day = {
                "1min": 1440, "5min": 288, "15min": 96, "30min": 48,
                "1h": 24, "4h": 6, "1day": 1
            }
            
            bars_per_day_value = bars_per_day.get(td_interval, 24)
            output_size = days * bars_per_day_value
            
            # Cap to avoid exceeding limits
            output_size = min(output_size, 5000)
        else:
            # Default sizes based on interval
            default_sizes = {
                "1min": 1000, "5min": 1000, "15min": 500, "30min": 500,
                "1h": 168, "4h": 120, "1day": 90
            }
            output_size = default_sizes.get(td_interval, 100)
        
        url = f"{self.base_url}/time_series"
        params = {
            "symbol": td_symbol,
            "interval": td_interval,
            "outputsize": output_size,
            "apikey": self.api_key
        }
        
        # Add date range parameters if provided
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        data = self._make_request(url, params=params)
        
        if not data or "values" not in data or not data["values"]:
            logger.warning(f"No data returned from Twelve Data for {symbol}")
            return None
        
        # Parse the response
        records = []
        for bar in data["values"]:
            records.append({
                "timestamp": datetime.strptime(bar["datetime"], "%Y-%m-%d %H:%M:%S" if ":" in bar["datetime"] else "%Y-%m-%d"),
                "open": float(bar["open"]),
                "high": float(bar["high"]),
                "low": float(bar["low"]),
                "close": float(bar["close"]),
                "volume": float(bar.get("volume", 0))
            })
        
        if not records:
            return None
        
        df = pd.DataFrame(records)
        df.set_index("timestamp", inplace=True)
        df.sort_index(inplace=True)
        
        return df
    
    def _get_td_symbol(self, symbol):
        """Format symbol for Twelve Data"""
        # Handle forex pairs
        if symbol in FOREX_PAIRS:
            if len(symbol) == 6:
                return f"{symbol[:3]}/{symbol[3:]}"
            return symbol
        
        # Handle cryptocurrencies
        if symbol in CRYPTO:
            return f"{symbol}/USD"
        
        # Handle single currencies against USD
        if symbol in FIAT and symbol != "USD":
            return f"USD/{symbol}"  # Twelve Data uses USD/EUR format for forex
        
        # Special cases for metals
        if symbol == "XAU":
            return "GOLD"
        if symbol == "XAG":
            return "SILVER"
        if symbol == "XPT":
            return "PLATINUM"
        if symbol == "XPD":
            return "PALLADIUM"
        
        # Default case
        return symbol

# ----- Cache and Data Management Functions -----
def ensure_dirs():
    """Ensure cache and output directories exist"""
    Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    Path(PUBLIC_CHART_DATA).mkdir(parents=True, exist_ok=True)

def get_cache_path(symbol, interval):
    """Get file path for cached data"""
    return os.path.join(CACHE_DIR, f"{symbol}_{interval}.json")

def is_cache_valid(symbol, interval):
    """Check if cached data is still valid"""
    cache_path = get_cache_path(symbol, interval)
    if not os.path.exists(cache_path):
        return False
    
    # Get file modification time
    mod_time = os.path.getmtime(cache_path)
    age = time.time() - mod_time
    
    # Check if cache is still valid
    ttl = DEFAULT_CACHE_TTL.get(interval, DEFAULT_CACHE_TTL["1h"])
    return age < ttl

def load_from_cache(symbol, interval):
    """Load data from cache if available"""
    if not is_cache_valid(symbol, interval):
        return None
    
    try:
        cache_path = get_cache_path(symbol, interval)
        with open(cache_path, "r") as f:
            data = json.load(f)
        
        # Convert to DataFrame
        df = pd.DataFrame(data["data"])
        if not df.empty:
            df["timestamp"] = pd.to_datetime(df["timestamp"])
            df.set_index("timestamp", inplace=True)
        return df
    except Exception as e:
        logger.error(f"Error loading cache for {symbol}_{interval}: {e}")
        return None

def save_to_cache(symbol, interval, df):
    """Save data to cache"""
    if df is None or df.empty:
        return
    
    try:
        # Reset index to include timestamp as column
        df_reset = df.reset_index()
        
        # Convert to dict for JSON serialization
        data = {
            "symbol": symbol,
            "interval": interval,
            "last_updated": datetime.now().isoformat(),
            "data": df_reset.to_dict(orient="records")
        }
        
        cache_path = get_cache_path(symbol, interval)
        with open(cache_path, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving cache for {symbol}_{interval}: {e}")

def save_to_output(symbol, interval, df):
    """Save processed data to output directory"""
    if df is None or df.empty:
        return
    
    try:
        # Create output directory with today's date
        date_str = datetime.now().strftime("%Y-%m-%d")
        output_path = os.path.join(OUTPUT_DIR, date_str)
        Path(output_path).mkdir(parents=True, exist_ok=True)
        
        # Convert to standardized records format
        records = []
        for idx, row in df.iterrows():
            record = {
                "symbol": symbol,
                "timestamp": idx.isoformat(),
                "open": float(row["open"]),
                "high": float(row["high"]),
                "low": float(row["low"]),
                "close": float(row["close"]),
                "volume": float(row["volume"]) if "volume" in row else 0,
                "interval": interval
            }
            records.append(record)
        
        # Save to JSON file
        output_file = os.path.join(output_path, f"{symbol}_{interval}.json")
        with open(output_file, "w") as f:
            json.dump(records, f, indent=2)
        
        # Also save to public/chart-data directory
        public_chart_file = os.path.join(PUBLIC_CHART_DATA, f"{symbol}_{interval}.json")
        with open(public_chart_file, "w") as f:
            json.dump(records, f, indent=2)
        
        # Also save a consolidated CSV with most recent data
        csv_path = os.path.join(OUTPUT_DIR, f"market_data_{interval}.csv")
        
        # Check if file exists and read it
        if os.path.exists(csv_path):
            existing_df = pd.read_csv(csv_path)
            # Remove data for this symbol to be replaced with new data
            existing_df = existing_df[existing_df["symbol"] != symbol]
        else:
            existing_df = pd.DataFrame()
        
        # Prepare new data
        new_data = pd.DataFrame(records)
        # Append new data
        combined_df = pd.concat([existing_df, new_data], ignore_index=True)
        # Save to CSV
        combined_df.to_csv(csv_path, index=False)
        
        logger.info(f"Saved data for {symbol} ({interval}) to {output_file} and {public_chart_file}")
    except Exception as e:
        logger.error(f"Error saving output for {symbol}_{interval}: {e}")

def save_candles_format(symbol, interval, df):
    """Save data in candles format (array of arrays) for charting libraries"""
    if df is None or df.empty:
        return
    
    try:
        # Create directory if it doesn't exist
        Path(PUBLIC_CHART_DATA).mkdir(parents=True, exist_ok=True)
        
        # Convert to candles format: [timestamp, open, high, low, close, volume]
        candles = []
        for idx, row in df.iterrows():
            # Convert timestamp to milliseconds for JS compatibility
            ts_ms = int(idx.timestamp() * 1000)
            candle = [
                ts_ms,
                float(row["open"]),
                float(row["high"]),
                float(row["low"]),
                float(row["close"]),
                float(row["volume"]) if "volume" in row else 0
            ]
            candles.append(candle)
        
        # Save to JSON file in public/chart-data
        output_file = os.path.join(PUBLIC_CHART_DATA, f"{symbol}_{interval}_candles.json")
        with open(output_file, "w") as f:
            json.dump(candles, f)
        
        logger.info(f"Saved candles format for {symbol} ({interval}) to {output_file}")
    except Exception as e:
        logger.error(f"Error saving candles format for {symbol}_{interval}: {e}")

# ----- Main Data Fetching Logic -----
def fetch_data_with_fallback(symbol, interval="1h", force_refresh=False):
    """Fetch data for the given symbol with fallback mechanisms"""
    # Check cache first unless force refresh
    if not force_refresh:
        cached_data = load_from_cache(symbol, interval)
        if cached_data is not None and not cached_data.empty:
            logger.info(f"Using cached data for {symbol} ({interval})")
            return cached_data
    
    # Calculate date range based on interval
    end_date = datetime.now().strftime("%Y-%m-%d")
    
    # Determine lookback period based on interval
    lookback_days = {
        "1m": 1,
        "5m": 3,
        "15m": 5,
        "30m": 5,
        "1h": 7,
        "4h": 30,
        "1d": 365
    }
    days_lookback = lookback_days.get(interval, 7)
    start_date = (datetime.now() - timedelta(days=days_lookback)).strftime("%Y-%m-%d")
    
    # Initialize data sources
    data_sources = []
    
    # Prioritize sources based on asset type and interval
    if symbol in FOREX_PAIRS:
        # For forex, prioritize sources depending on interval
        if interval in ["1m", "5m", "15m", "30m"]:
            # For short timeframes, use Twelve Data and Alpha Vantage
            data_sources = [
                TwelveDataSource(TWELVEDATA_API_KEY),
                AlphaVantageSource(ALPHA_VANTAGE_API_KEY),
                YahooFinanceSource()  # Yahoo has limited intraday data
            ]
        else:
            # For longer timeframes, Yahoo is reliable
            data_sources = [
                YahooFinanceSource(),
                TwelveDataSource(TWELVEDATA_API_KEY),
                AlphaVantageSource(ALPHA_VANTAGE_API_KEY)
            ]
    elif symbol in CRYPTO:
        data_sources = [
            CoinGeckoSource(),
            YahooFinanceSource(),
            AlphaVantageSource(ALPHA_VANTAGE_API_KEY),
            TwelveDataSource(TWELVEDATA_API_KEY)
        ]
    elif symbol in FIAT or symbol in METALS:
        data_sources = [
            YahooFinanceSource(),
            AlphaVantageSource(ALPHA_VANTAGE_API_KEY),
            TwelveDataSource(TWELVEDATA_API_KEY)
        ]
    else:  # Stocks, ETFs, commodities, indices
        data_sources = [
            YahooFinanceSource(),
            TwelveDataSource(TWELVEDATA_API_KEY),
            AlphaVantageSource(ALPHA_VANTAGE_API_KEY)
        ]
    
    # Try each source until we get data
    df = None
    errors = []
    
    for source in data_sources:
        try:
            logger.info(f"Trying {source.name} for {symbol} ({interval})")
            df = source.fetch(symbol, interval, start_date, end_date)
            
            if df is not None and not df.empty:
                logger.info(f"Successfully fetched data from {source.name} for {symbol}")
                break
            
        except Exception as e:
            error_msg = f"Error from {source.name} for {symbol}: {str(e)}"
            logger.error(error_msg)
            errors.append(error_msg)
    
    if df is None or df.empty:
        logger.warning(f"Failed to fetch data for {symbol} from all sources")
        return None
    
    # Cache the results
    save_to_cache(symbol, interval, df)
    
    # Save to output
    save_to_output(symbol, interval, df)
    
    # Save in candles format for charting libraries
    save_candles_format(symbol, interval, df)
    
    return df

def fetch_forex_pair(base_currency, quote_currency, interval="1d", force_refresh=False):
    """Fetch data for a forex pair directly"""
    if base_currency == quote_currency:
        # Return a constant 1.0 exchange rate for same currency
        now = datetime.now()
        yesterday = now - timedelta(days=1)
        dates = pd.date_range(start=yesterday, end=now, freq='D')
        df = pd.DataFrame(index=dates)
        df["open"] = 1.0
        df["high"] = 1.0
        df["low"] = 1.0
        df["close"] = 1.0
        df["volume"] = 0
        return df
    
    # Try direct forex pair first (more accurate)
    forex_symbol = f"{base_currency}{quote_currency}"
    df = fetch_data_with_fallback(forex_symbol, interval, force_refresh)
    if df is not None and not df.empty:
        return df
    
    # If direct pair fails, try to calculate via USD
    logger.info(f"Direct fetch failed for {forex_symbol}, trying cross-calculation")
    
    # Get base/USD
    base_usd = None
    if base_currency != "USD":
        base_usd = fetch_data_with_fallback(base_currency, interval, force_refresh)
    
    # Get quote/USD
    quote_usd = None
    if quote_currency != "USD":
        quote_usd = fetch_data_with_fallback(quote_currency, interval, force_refresh)
    
    # Calculate cross-rate
    if base_currency == "USD" and quote_usd is not None:
        # USD/quote = 1/(quote/USD)
        df = quote_usd.copy()
        df["open"] = 1.0 / df["open"]
        df["high"] = 1.0 / df["low"]  # Note high/low swap
        df["low"] = 1.0 / df["high"]
        df["close"] = 1.0 / df["close"]
    elif base_usd is not None and quote_currency == "USD":
        # base/USD direct
        df = base_usd
    elif base_usd is not None and quote_usd is not None:
        # base/quote = (base/USD) / (quote/USD)
        # Find common dates
        common_index = base_usd.index.intersection(quote_usd.index)
        if len(common_index) == 0:
            logger.warning(f"No overlapping dates for {base_currency}/{quote_currency}")
            return None
        
        # Align dataframes
        aligned_base = base_usd.loc[common_index]
        aligned_quote = quote_usd.loc[common_index]
        
        # Calculate cross rate
        df = pd.DataFrame(index=common_index)
        df["open"] = aligned_base["open"] / aligned_quote["open"]
        df["high"] = aligned_base["high"] / aligned_quote["low"]
        df["low"] = aligned_base["low"] / aligned_quote["high"]
        df["close"] = aligned_base["close"] / aligned_quote["close"]
        df["volume"] = aligned_base["volume"]
    else:
        logger.warning(f"Missing data to calculate {base_currency}/{quote_currency}")
        return None
    
    # Cache this calculated pair
    symbol = f"{base_currency}-{quote_currency}"
    save_to_cache(symbol, interval, df)
    save_to_output(symbol, interval, df)
    save_candles_format(symbol, interval, df)
    
    return df

def process_asset_list(assets, interval="1h", force_refresh=False):
    """Process a list of assets in parallel"""
    results = {}
    failed = []
    
    def process_asset(symbol):
        try:
            df = fetch_data_with_fallback(symbol, interval, force_refresh)
            if df is not None and not df.empty:
                return symbol, df
            return symbol, None
        except Exception as e:
            logger.error(f"Error processing {symbol}: {e}")
            return symbol, None
    
    # Use ThreadPoolExecutor for parallel processing
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_symbol = {executor.submit(process_asset, symbol): symbol for symbol in assets}
        
        for future in future_to_symbol:
            symbol, df = future.result()
            if df is not None:
                results[symbol] = df
            else:
                failed.append(symbol)
    
    logger.info(f"Processed {len(results)} assets successfully, {len(failed)} failed")
    if failed:
        logger.info(f"Failed assets: {', '.join(failed)}")
    
    return results

def update_forex_pairs(intervals=None):
    """Update data for all forex pairs with specified intervals"""
    if intervals is None:
        intervals = ["1h", "4h", "1d"]  # Default intervals
    
    logger.info(f"Updating forex pairs for intervals: {intervals}")
    
    for interval in intervals:
        logger.info(f"Processing forex pairs with interval {interval}")
        results = process_asset_list(FOREX_PAIRS, interval)
        logger.info(f"Completed forex pairs with interval {interval}: {len(results)} pairs updated")

def update_crypto_data(intervals=None):
    """Update data for all cryptocurrencies with specified intervals"""
    if intervals is None:
        intervals = ["1h", "4h", "1d"]  # Default intervals
    
    logger.info(f"Updating cryptocurrencies for intervals: {intervals}")
    
    for interval in intervals:
        logger.info(f"Processing cryptocurrencies with interval {interval}")
        results = process_asset_list(CRYPTO, interval)
        logger.info(f"Completed cryptocurrencies with interval {interval}: {len(results)} assets updated")

def update_stocks_and_etfs(intervals=None):
    """Update data for stocks and ETFs with specified intervals"""
    if intervals is None:
        intervals = ["1d"]  # Default to daily for stocks/ETFs
    
    logger.info(f"Updating stocks and ETFs for intervals: {intervals}")
    
    assets = POPULAR_STOCKS + ETFS
    
    for interval in intervals:
        logger.info(f"Processing stocks and ETFs with interval {interval}")
        results = process_asset_list(assets, interval)
        logger.info(f"Completed stocks and ETFs with interval {interval}: {len(results)} assets updated")

def update_all_asset_data():
    """Update data for all assets"""
    ensure_dirs()
    
    # Process different asset classes and intervals
    asset_configs = [
        {"assets": CRYPTO, "interval": "1h", "name": "cryptocurrencies (hourly)"},
        {"assets": CRYPTO, "interval": "4h", "name": "cryptocurrencies (4-hour)"},
        {"assets": CRYPTO, "interval": "1d", "name": "cryptocurrencies (daily)"},
        {"assets": FOREX_PAIRS, "interval": "1h", "name": "forex pairs (hourly)"},
        {"assets": FOREX_PAIRS, "interval": "4h", "name": "forex pairs (4-hour)"},
        {"assets": FOREX_PAIRS, "interval": "1d", "name": "forex pairs (daily)"},
        {"assets": FIAT, "interval": "1d", "name": "fiat currencies (daily)"},
        {"assets": METALS, "interval": "1d", "name": "precious metals (daily)"},
        {"assets": COMMODITIES, "interval": "1d", "name": "commodities (daily)"},
        {"assets": INDICES, "interval": "1d", "name": "stock indices (daily)"},
        {"assets": POPULAR_STOCKS, "interval": "1d", "name": "popular stocks (daily)"},
        {"assets": ETFS, "interval": "1d", "name": "ETFs (daily)"}
    ]
    
    # Add intraday data for forex pairs
    intraday_intervals = ["1m", "5m", "15m", "30m"]
    major_forex = FOREX_PAIRS[:10]  # Use only major pairs for intraday to conserve API calls
    
    for interval in intraday_intervals:
        asset_configs.append({
            "assets": major_forex,
            "interval": interval,
            "name": f"major forex pairs ({interval})"
        })
    
    # Process each configuration
    for config in asset_configs:
        logger.info(f"Updating {config['name']}...")
        results = process_asset_list(config["assets"], config["interval"])
        logger.info(f"Completed {config['name']}: {len(results)} assets updated")
    
    # Copy all data to public/chart-data directory
    logger.info("Copying all data to public/chart-data directory")
    ensure_public_chart_data()

def ensure_public_chart_data():
    """Ensure all data is available in the public/chart-data directory"""
    try:
        # Ensure directory exists
        Path(PUBLIC_CHART_DATA).mkdir(parents=True, exist_ok=True)
        
        # Walk through the output directory
        for root, dirs, files in os.walk(OUTPUT_DIR):
            for file in files:
                if file.endswith(".json") and not file.startswith("all_"):
                    input_path = os.path.join(root, file)
                    output_path = os.path.join(PUBLIC_CHART_DATA, file)
                    
                    # Copy file if it doesn't exist or is older
                    if not os.path.exists(output_path) or \
                       os.path.getmtime(input_path) > os.path.getmtime(output_path):
                        shutil.copy2(input_path, output_path)
                        logger.info(f"Copied {file} to public/chart-data")
                    
                    # Also create candles format if it doesn't exist
                    parts = file.split('_')
                    if len(parts) >= 2:
                        symbol = parts[0]
                        interval = parts[1].replace('.json', '')
                        
                        candles_file = f"{symbol}_{interval}_candles.json"
                        candles_path = os.path.join(PUBLIC_CHART_DATA, candles_file)
                        
                        if not os.path.exists(candles_path):
                            # Load data and convert to candles format
                            with open(input_path, 'r') as f:
                                data = json.load(f)
                            
                            if isinstance(data, list) and len(data) > 0:
                                # Convert to candles format
                                candles = []
                                for item in data:
                                    if "timestamp" in item and "open" in item:
                                        ts = datetime.fromisoformat(item["timestamp"]).timestamp() * 1000
                                        candle = [
                                            int(ts),
                                            float(item["open"]),
                                            float(item["high"]),
                                            float(item["low"]),
                                            float(item["close"]),
                                            float(item.get("volume", 0))
                                        ]
                                        candles.append(candle)
                                
                                with open(candles_path, 'w') as f:
                                    json.dump(candles, f)
                                logger.info(f"Created candles format for {symbol} ({interval})")
        
        logger.info("Ensured all data is available in public/chart-data directory")
    except Exception as e:
        logger.error(f"Error ensuring public chart data: {e}")

def consolidate_output():
    """Consolidate all output files into a single JSON and CSV file"""
    try:
        logger.info("Consolidating output files...")
        all_data = []
        
        # Walk through the output directory
        for root, dirs, files in os.walk(OUTPUT_DIR):
            for file in files:
                if file.endswith(".json") and not file.startswith("all_"):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r") as f:
                            data = json.load(f)
                            if isinstance(data, list):
                                all_data.extend(data)
                    except Exception as e:
                        logger.error(f"Error reading file {file_path}: {e}")
        
        if all_data:
            # Save consolidated JSON
            json_path = os.path.join(OUTPUT_DIR, "all_market_data.json")
            with open(json_path, "w") as f:
                json.dump(all_data, f, indent=2)
            
            # Also save to public/chart-data
            public_json_path = os.path.join(PUBLIC_CHART_DATA, "all_market_data.json")
            with open(public_json_path, "w") as f:
                json.dump(all_data, f, indent=2)
            
            # Save consolidated CSV
            csv_path = os.path.join(OUTPUT_DIR, "all_market_data.csv")
            df = pd.DataFrame(all_data)
            df.to_csv(csv_path, index=False)
            
            # Also save to public/chart-data
            public_csv_path = os.path.join(PUBLIC_CHART_DATA, "all_market_data.csv")
            df.to_csv(public_csv_path, index=False)
            
            logger.info(f"Consolidated {len(all_data)} records to output and public/chart-data directories")
        else:
            logger.warning("No data found to consolidate")
    
    except Exception as e:
        logger.error(f"Error in consolidate_output: {e}")

def create_exchange_rate_matrix():
    """Create a matrix of all currency exchange rates"""
    try:
        logger.info("Creating exchange rate matrix...")
        
        # Get all currencies
        currencies = FIAT + CRYPTO + METALS
        
        # Get latest data
        rates = {}
        for base in currencies:
            for quote in currencies:
                if base != quote:
                    symbol = f"{base}-{quote}"
                    # Try to load from cache
                    df = load_from_cache(symbol, "1d")
                    if df is None or df.empty:
                        # Try direct forex pair
                        forex_symbol = f"{base}{quote}"
                        df = load_from_cache(forex_symbol, "1d")
                    
                    if df is not None and not df.empty:
                        # Get most recent rate
                        latest = df.iloc[-1]
                        rates[(base, quote)] = latest["close"]
        
        # Create a matrix
        matrix = []
        for base in currencies:
            row = {"base_currency": base}
            for quote in currencies:
                if base == quote:
                    row[quote] = 1.0
                else:
                    row[quote] = rates.get((base, quote), float('nan'))
            matrix.append(row)
        
        # Save to JSON and CSV
        matrix_json_path = os.path.join(OUTPUT_DIR, "exchange_rate_matrix.json")
        with open(matrix_json_path, "w") as f:
            json.dump(matrix, f, indent=2)
        
        # Also save to public/chart-data
        public_matrix_path = os.path.join(PUBLIC_CHART_DATA, "exchange_rate_matrix.json")
        with open(public_matrix_path, "w") as f:
            json.dump(matrix, f, indent=2)
        
        matrix_csv_path = os.path.join(OUTPUT_DIR, "exchange_rate_matrix.csv")
        pd.DataFrame(matrix).to_csv(matrix_csv_path, index=False)
        
        # Also save to public/chart-data
        public_matrix_csv_path = os.path.join(PUBLIC_CHART_DATA, "exchange_rate_matrix.csv")
        pd.DataFrame(matrix).to_csv(public_matrix_csv_path, index=False)
        
        logger.info(f"Exchange rate matrix saved to output and public/chart-data directories")
    
    except Exception as e:
        logger.error(f"Error in create_exchange_rate_matrix: {e}")

# ----- Scheduling and Main Function -----
def setup_schedule():
    """Set up the schedule for data updates"""
    # Daily full refresh
    schedule.every().day.at("00:00").do(update_all_asset_data)
    schedule.every().day.at("00:30").do(consolidate_output)
    schedule.every().day.at("01:00").do(create_exchange_rate_matrix)
    
    # Forex intraday updates (every 4 hours)
    for hour in [4, 8, 12, 16, 20]:
        schedule.every().day.at(f"{hour:02d}:00").do(
            update_forex_pairs, 
            ["1m", "5m", "15m", "30m", "1h"]
        )
    
    # Hourly updates for important assets
    for hour in range(1, 24):
        if hour % 4 == 0:
            # Every 4 hours, update 4h data
            schedule.every().day.at(f"{hour:02d}:00").do(
                process_asset_list, 
                FOREX_PAIRS[:10] + CRYPTO[:5],  # Major forex pairs and top crypto
                "4h"
            )
        else:
            # Every hour, update 1h data
            schedule.every().day.at(f"{hour:02d}:00").do(
                process_asset_list, 
                FOREX_PAIRS[:10] + CRYPTO[:5],  # Major forex pairs and top crypto
                "1h"
            )
    
    logger.info("Schedule set up successfully")

def run_scheduled_tasks():
    """Run scheduled tasks and handle any exceptions"""
    try:
        schedule.run_pending()
    except Exception as e:
        logger.error(f"Error running scheduled tasks: {e}")

def main():
    """Main function"""
    logger.info("Starting Market Data Fetcher")
    ensure_dirs()
    
    # Initial data fetch
    logger.info("Performing initial data fetch...")
    update_all_asset_data()
    consolidate_output()
    create_exchange_rate_matrix()
    
    # Set up schedule
    setup_schedule()
    
    # Run scheduler loop
    try:
        logger.info("Starting scheduler. Press Ctrl+C to exit.")
        while True:
            run_scheduled_tasks()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user.")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {e}")
    
    logger.info("Market Data Fetcher stopped")

# Utility function to fetch on-demand data
def fetch_single_asset(symbol, interval="1d", force_refresh=False):
    """Fetch data for a single asset on demand"""
    ensure_dirs()
    logger.info(f"Fetching data for {symbol} ({interval})...")
    df = fetch_data_with_fallback(symbol, interval, force_refresh)
    if df is not None and not df.empty:
        logger.info(f"Successfully fetched data for {symbol}")
        return df
    else:
        logger.warning(f"Failed to fetch data for {symbol}")
        return None

# Direct API endpoint - allows fetching data programmatically from other scripts
def get_latest_price(symbol, quote_currency="USD"):
    """Get the latest price for a symbol in the specified quote currency"""
    try:
        # First try the direct symbol
        df = load_from_cache(symbol, "1d")
        
        # If not found and we want a non-USD quote, try the pair
        if (df is None or df.empty) and quote_currency != "USD":
            pair_symbol = f"{symbol}-{quote_currency}"
            df = load_from_cache(pair_symbol, "1d")
            
            # Also try standard forex format
            if df is None or df.empty:
                forex_symbol = f"{symbol}{quote_currency}"
                df = load_from_cache(forex_symbol, "1d")
        
        # If we have data, return the latest price
        if df is not None and not df.empty:
            latest = df.iloc[-1]
            result = {
                "symbol": symbol,
                "quote_currency": quote_currency,
                "price": float(latest["close"]),
                "timestamp": latest.name.isoformat(),
                "open": float(latest["open"]),
                "high": float(latest["high"]),
                "low": float(latest["low"]),
                "volume": float(latest["volume"]) if "volume" in latest else 0
            }
            return result
        
        # If not in cache, fetch it fresh
        if quote_currency == "USD":
            df = fetch_data_with_fallback(symbol, "1d")
            if df is not None and not df.empty:
                latest = df.iloc[-1]
                result = {
                    "symbol": symbol,
                    "quote_currency": "USD",
                    "price": float(latest["close"]),
                    "timestamp": latest.name.isoformat(),
                    "open": float(latest["open"]),
                    "high": float(latest["high"]),
                    "low": float(latest["low"]),
                    "volume": float(latest["volume"]) if "volume" in latest else 0
                }
                return result
        # Try direct forex pair
            if len(symbol) == 6 and all(c.isalpha() for c in symbol):
                base = symbol[:3]
                quote = symbol[3:]
                df = fetch_forex_pair(base, quote, "1d")
                if df is not None and not df.empty:
                    latest = df.iloc[-1]
                    result = {
                        "symbol": symbol,
                        "base_currency": base,
                        "quote_currency": quote,
                        "price": float(latest["close"]),
                        "timestamp": latest.name.isoformat(),
                        "open": float(latest["open"]),
                        "high": float(latest["high"]),
                        "low": float(latest["low"]),
                        "volume": float(latest["volume"]) if "volume" in latest else 0
                    }
                    return result
        
        return {"error": f"Price not available for {symbol}/{quote_currency}"}
    
    except Exception as e:
        logger.error(f"Error in get_latest_price for {symbol}/{quote_currency}: {e}")
        return {"error": str(e)}

def generate_frontend_data():
    """Generate frontend-specific data files for the UI components"""
    try:
        logger.info("Generating frontend data files...")
        
        # Ensure the chart-data directory exists
        Path(PUBLIC_CHART_DATA).mkdir(parents=True, exist_ok=True)
        
        # 1. Generate Market Overview data (US Markets, EU Markets, Commodities)
        generate_market_overview_data()
        
        # 2. Generate Stock Ticker data
        generate_stock_ticker_data()
        
        # 3. Generate Asset Performance Chart data
        generate_asset_performance_data()
        
        logger.info("Frontend data files generated successfully")
    except Exception as e:
        logger.error(f"Error generating frontend data: {e}")

def generate_market_overview_data():
    """Generate data for the MarketOverview component"""
    try:
        # US Markets
        us_markets = [
            {"name": "S&P 500", "symbol": "^GSPC"},
            {"name": "Dow Jones", "symbol": "^DJI"},
            {"name": "NASDAQ", "symbol": "^IXIC"},
            {"name": "Russell 2000", "symbol": "^RUT"},
            {"name": "Tesla", "symbol": "TSLA"},
            {"name": "Apple", "symbol": "AAPL"},
            {"name": "Microsoft", "symbol": "MSFT"},
            {"name": "Amazon", "symbol": "AMZN"}
        ]
        
        # EU Markets
        eu_markets = [
            {"name": "FTSE 100", "symbol": "^FTSE"},
            {"name": "DAX", "symbol": "^GDAXI"},
            {"name": "CAC 40", "symbol": "^FCHI"},
            {"name": "Euro Stoxx 50", "symbol": "^STOXX50E"},
            {"name": "Volkswagen", "symbol": "VOW.DE"},
            {"name": "LVMH", "symbol": "MC.PA"},
            {"name": "SAP", "symbol": "SAP.DE"},
            {"name": "Siemens", "symbol": "SIE.DE"}
        ]
        
        # Commodities
        commodities = [
            {"name": "Gold", "symbol": "XAU"},
            {"name": "Silver", "symbol": "XAG"},
            {"name": "Crude Oil WTI", "symbol": "CL"},
            {"name": "Brent Crude", "symbol": "BZ"},
            {"name": "Natural Gas", "symbol": "NG"},
            {"name": "Platinum", "symbol": "XPT"},
            {"name": "Palladium", "symbol": "XPD"},
            {"name": "Copper", "symbol": "HG"}
        ]
        
        # Get data for each market
        us_data = get_market_data(us_markets)
        eu_data = get_market_data(eu_markets)
        commodities_data = get_market_data(commodities)
        
        # Save to JSON files
        market_overview = {
            "usMarkets": us_data,
            "euMarkets": eu_data,
            "commodities": commodities_data,
            "lastUpdated": datetime.now().isoformat()
        }
        
        output_file = os.path.join(PUBLIC_CHART_DATA, "market_overview.json")
        with open(output_file, "w") as f:
            json.dump(market_overview, f, indent=2)
        
        logger.info(f"Market overview data saved to {output_file}")
    except Exception as e:
        logger.error(f"Error generating market overview data: {e}")

def get_market_data(markets):
    """Get market data for a list of markets"""
    result = []
    
    for market in markets:
        try:
            symbol = market["symbol"]
            
            # Get latest price data
            price_data = get_latest_price(symbol)
            
            if "error" not in price_data:
                # Format value based on the price
                value = f"{price_data['price']:.2f}"
                
                # Add currency symbol if needed
                if symbol in ["VOW.DE", "MC.PA", "SAP.DE", "SIE.DE"]:
                    value = f"€{value}"
                elif not symbol.startswith("^") and symbol not in ["XAU", "XAG", "XPT", "XPD", "CL", "BZ", "NG", "HG"]:
                    value = f"${value}"
                elif symbol in ["XAU", "XAG", "XPT", "XPD"]:
                    value = f"${value}/oz"
                elif symbol in ["CL", "BZ"]:
                    value = f"${value}/bbl"
                elif symbol == "NG":
                    value = f"${value}/MMBtu"
                elif symbol == "HG":
                    value = f"${value}/lb"
                
                # Calculate percent change
                percent_change = ((price_data['close'] - price_data['open']) / price_data['open'] * 100)
                is_up = percent_change >= 0
                change = f"{'+' if is_up else ''}{percent_change:.2f}%"
                
                result.append({
                    "name": market["name"],
                    "value": value,
                    "change": change,
                    "percentChange": percent_change,
                    "isUp": is_up
                })
            else:
                # Use fallback demo data
                result.append({
                    "name": market["name"],
                    "value": "N/A" if market["name"].startswith("^") else "$0.00",
                    "change": "0.00%",
                    "percentChange": 0,
                    "isUp": True
                })
        except Exception as e:
            logger.error(f"Error getting data for {market['name']}: {e}")
            # Add fallback entry
            result.append({
                "name": market["name"],
                "value": "N/A",
                "change": "0.00%",
                "percentChange": 0,
                "isUp": True
            })
    
    return result

def generate_stock_ticker_data():
    """Generate data for the StockTicker component"""
    try:
        stocks = [
            "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "JPM", 
            "V", "XOM", "WMT", "JNJ", "VOW.DE", "MC.PA", "SAP.DE", "GLD", "USO"
        ]
        
        result = []
        
        for symbol in stocks:
            try:
                # Get latest price data
                price_data = get_latest_price(symbol)
                
                if "error" not in price_data:
                    # Format price based on the symbol
                    price = f"{price_data['price']:.2f}"
                    
                    # Add currency symbol if needed
                    if symbol in ["VOW.DE", "MC.PA", "SAP.DE"]:
                        price = f"{price}€"
                    else:
                        price = f"${price}"
                    
                    # Calculate percent change
                    percent_change = ((price_data['close'] - price_data['open']) / price_data['open'] * 100)
                    is_up = percent_change >= 0
                    change = f"{'+' if is_up else ''}{percent_change:.2f}%"
                    
                    result.append({
                        "symbol": symbol,
                        "price": price,
                        "change": change,
                        "isUp": is_up
                    })
                else:
                    # Use fallback data
                    result.append({
                        "symbol": symbol,
                        "price": "$0.00",
                        "change": "0.00%",
                        "isUp": True
                    })
            except Exception as e:
                logger.error(f"Error getting data for stock {symbol}: {e}")
                # Add fallback entry
                result.append({
                    "symbol": symbol,
                    "price": "N/A",
                    "change": "0.00%",
                    "isUp": True
                })
        
        # Save to JSON file
        output_file = os.path.join(PUBLIC_CHART_DATA, "stock_ticker.json")
        with open(output_file, "w") as f:
            json.dump(result, f, indent=2)
        
        logger.info(f"Stock ticker data saved to {output_file}")
    except Exception as e:
        logger.error(f"Error generating stock ticker data: {e}")

def generate_asset_performance_data():
    """Generate data for the AssetPerformanceChart component"""
    try:
        # Define assets to track for different categories
        assets = {
            "stocks": ["SPY", "QQQ", "DIA", "IWM", "VTI"],  # US stock ETFs
            "gold": ["GLD", "XAU", "XAG", "SLV", "IAU"],    # Gold and precious metals
            "oil": ["USO", "CL", "BZ", "OIL", "XLE"],       # Oil and energy
            "private": ["VOW.DE", "SIE.DE", "MC.PA", "SAP.DE", "TSLA"]  # Using some stocks as proxy for private assets
        }
        
        # Timeframes
        timeframes = ["1M", "3M", "6M", "1Y"]
        timeframe_intervals = {
            "1M": "1d",   # Daily data for 1 month
            "3M": "1d",   # Daily data for 3 months
            "6M": "1d",   # Daily data for 6 months
            "1Y": "1d"    # Daily data for 1 year
        }
        
        # Get data for each asset category and timeframe
        result = {}
        
        for category, symbols in assets.items():
            result[category] = {}
            
            for timeframe in timeframes:
                interval = timeframe_intervals[timeframe]
                days_back = 30 if timeframe == "1M" else 90 if timeframe == "3M" else 180 if timeframe == "6M" else 365
                
                # Use the first symbol as representative for the category
                primary_symbol = symbols[0]
                
                # Get historical data
                df = fetch_historical_data(primary_symbol, interval, days_back)
                
                if df is not None and not df.empty:
                    data_points = format_asset_performance_data(df, timeframe)
                    result[category][timeframe] = data_points
                else:
                    # Use fallback data
                    logger.warning(f"No data for {primary_symbol}, using fallback for {category} {timeframe}")
                    result[category][timeframe] = generate_fallback_performance_data(timeframe, category)
                    
            # Also generate comparison and volume data
            result[category]["comparison"] = generate_comparison_data(category, timeframes)
            result[category]["volume"] = generate_volume_data(category, timeframes)
        
        # Save to JSON file
        output_file = os.path.join(PUBLIC_CHART_DATA, "asset_performance.json")
        with open(output_file, "w") as f:
            json.dump(result, f, indent=2)
        
        logger.info(f"Asset performance data saved to {output_file}")
    except Exception as e:
        logger.error(f"Error generating asset performance data: {e}")

def fetch_historical_data(symbol, interval, days_back):
    """Fetch historical data for a symbol"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Try to load from cache
        df = load_from_cache(symbol, interval)
        
        # If no data in cache or need to fetch more historical data, fetch it
        if df is None or df.empty or df.index.min() > start_date:
            df = fetch_data_with_fallback(symbol, interval, True)
        
        if df is not None and not df.empty:
            # Filter to requested date range
            df = df[df.index >= start_date]
            return df
        
        return None
    except Exception as e:
        logger.error(f"Error fetching historical data for {symbol}: {e}")
        return None

def format_asset_performance_data(df, timeframe):
    """Format historical data for asset performance chart"""
    result = []
    
    # Determine date format based on timeframe
    if timeframe == "1M":
        # For 1 month, use day of month
        date_format = "D%d"
    elif timeframe == "3M" or timeframe == "6M":
        # For 3 and 6 months, use week number
        date_format = "W%W"
    else:
        # For 1 year, use month abbreviation
        date_format = "%b"
    
    # Sort by date ascending
    df = df.sort_index()
    
    # Normalize values to start at 100
    if not df.empty:
        start_value = df.iloc[0]["close"]
        
        for idx, row in df.iterrows():
            normalized_value = (row["close"] / start_value) * 100
            
            # Format date
            if timeframe == "1Y":
                date_str = idx.strftime(date_format)
            else:
                date_str = date_format % idx.day
            
            result.append({
                "date": date_str,
                "value": normalized_value
            })
    
    return result

def generate_fallback_performance_data(timeframe, category):
    """Generate fallback performance data if real data is unavailable"""
    data = []
    points = 30 if timeframe == "1M" else 12 if timeframe == "3M" else 24 if timeframe == "6M" else 12
    
    value = 100
    for i in range(points):
        # Different trends for different asset categories
        if category == "stocks":
            change = (random.random() - 0.47) * 2
        elif category == "gold":
            change = (random.random() - 0.45) * 1.5
        elif category == "oil":
            change = (random.random() - 0.52) * 3
        else:  # private assets
            change = (random.random() - 0.35) * 0.9
        
        value = max(80, value + change)
        
        if timeframe == "1M":
            date = f"D{i+1}"
        elif timeframe == "3M" or timeframe == "6M":
            date = f"W{i+1}"
        else:
            date = f"M{i+1}"
        
        data.append({
            "date": date,
            "value": value
        })
    
    return data

def generate_comparison_data(category, timeframes):
    """Generate comparison data for asset performance chart"""
    result = {}
    
    for timeframe in timeframes:
        points = 30 if timeframe == "1M" else 12 if timeframe == "3M" else 24 if timeframe == "6M" else 12
        
        data = []
        asset_value = 100
        sp_value = 100
        msci_value = 100
        
        for i in range(points):
            # Different trends for different asset categories
            if category == "stocks":
                asset_change = (random.random() - 0.47) * 2
            elif category == "gold":
                asset_change = (random.random() - 0.45) * 1.5
            elif category == "oil":
                asset_change = (random.random() - 0.52) * 3
            else:  # private assets
                asset_change = (random.random() - 0.35) * 0.9
            
            sp_change = (random.random() - 0.48) * 2
            msci_change = (random.random() - 0.49) * 1.8
            
            asset_value = max(80, asset_value + asset_change)
            sp_value = max(80, sp_value + sp_change)
            msci_value = max(80, msci_value + msci_change)
            
            if timeframe == "1M":
                date = f"D{i+1}"
            elif timeframe == "3M" or timeframe == "6M":
                date = f"W{i+1}"
            else:
                date = f"M{i+1}"
            
            data.append({
                "date": date,
                "assetValue": asset_value,
                "sp500": sp_value,
                "msciWorld": msci_value
            })
        
        result[timeframe] = data
    
    return result

def generate_volume_data(category, timeframes):
    """Generate volume data for asset performance chart"""
    result = {}
    
    for timeframe in timeframes:
        points = 20 if timeframe == "1M" else 12 if timeframe == "3M" else 24 if timeframe == "6M" else 12
        
        data = []
        
        # Base volume depends on asset type
        base_volume = 3000000 if category == "stocks" else 800000 if category == "gold" else 1200000 if category == "oil" else 100000
        
        for i in range(points):
            # Random volume with some spikes
            volume = base_volume + (random.random() - 0.5) * base_volume * 0.5
            
            # Occasional volume spikes
            if random.random() > 0.85:
                volume = volume * (1 + random.random())
            
            if timeframe == "1M":
                date = f"D{i+1}"
            elif timeframe == "3M" or timeframe == "6M":
                date = f"W{i+1}"
            else:
                date = f"M{i+1}"
            
            data.append({
                "date": date,
                "volume": int(volume)
            })
        
        result[timeframe] = data
    
    return result

def create_summary_file():
    """Create a summary file with basic market information for quick access"""
    try:
        # 1. Get key market indices
        indices = [
            {"name": "S&P 500", "symbol": "^GSPC"},
            {"name": "Dow Jones", "symbol": "^DJI"},
            {"name": "NASDAQ", "symbol": "^IXIC"},
            {"name": "FTSE 100", "symbol": "^FTSE"},
            {"name": "DAX", "symbol": "^GDAXI"},
            {"name": "Nikkei 225", "symbol": "^N225"}
        ]
        
        # 2. Get key forex rates
        forex = [
            {"name": "EUR/USD", "symbol": "EURUSD"},
            {"name": "GBP/USD", "symbol": "GBPUSD"},
            {"name": "USD/JPY", "symbol": "USDJPY"},
            {"name": "USD/CAD", "symbol": "USDCAD"},
            {"name": "AUD/USD", "symbol": "AUDUSD"}
        ]
        
        # 3. Get key commodities
        commodities = [
            {"name": "Gold", "symbol": "XAU"},
            {"name": "Silver", "symbol": "XAG"},
            {"name": "Oil (WTI)", "symbol": "CL"},
            {"name": "Natural Gas", "symbol": "NG"}
        ]
        
        # 4. Get key cryptocurrencies
        crypto = [
            {"name": "Bitcoin", "symbol": "BTC"},
            {"name": "Ethereum", "symbol": "ETH"},
            {"name": "Binance Coin", "symbol": "BNB"},
            {"name": "XRP", "symbol": "XRP"}
        ]
        
        # Get data for each category
        indices_data = get_summary_data(indices)
        forex_data = get_summary_data(forex)
        commodities_data = get_summary_data(commodities)
        crypto_data = get_summary_data(crypto)
        
        # Create summary object
        summary = {
            "indices": indices_data,
            "forex": forex_data,
            "commodities": commodities_data,
            "crypto": crypto_data,
            "lastUpdated": datetime.now().isoformat()
        }
        
        # Save to JSON file
        output_file = os.path.join(PUBLIC_CHART_DATA, "market_summary.json")
        with open(output_file, "w") as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"Market summary saved to {output_file}")
    except Exception as e:
        logger.error(f"Error creating summary file: {e}")

def get_summary_data(items):
    """Get summary data for a list of market items"""
    result = []
    
    for item in items:
        try:
            # Get latest price data
            price_data = get_latest_price(item["symbol"])
            
            if "error" not in price_data:
                # Calculate percent change
                percent_change = ((price_data['close'] - price_data['open']) / price_data['open'] * 100)
                
                result.append({
                    "name": item["name"],
                    "symbol": item["symbol"],
                    "price": price_data['price'],
                    "change": percent_change,
                    "direction": "up" if percent_change >= 0 else "down",
                    "timestamp": price_data['timestamp']
                })
            else:
                # Add placeholder data
                result.append({
                    "name": item["name"],
                    "symbol": item["symbol"],
                    "price": 0,
                    "change": 0,
                    "direction": "neutral",
                    "timestamp": datetime.now().isoformat()
                })
        except Exception as e:
            logger.error(f"Error getting summary data for {item['name']}: {e}")
            # Add placeholder data
            result.append({
                "name": item["name"],
                "symbol": item["symbol"],
                "price": 0,
                "change": 0,
                "direction": "neutral",
                "timestamp": datetime.now().isoformat()
            })
    
    return result

# Add command line interface for the script
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Market Data Fetcher')
    parser.add_argument('--update', action='store_true', help='Update all market data')
    parser.add_argument('--frontend', action='store_true', help='Generate frontend data')
    parser.add_argument('--forex', action='store_true', help='Update forex data')
    parser.add_argument('--crypto', action='store_true', help='Update cryptocurrency data')
    parser.add_argument('--stocks', action='store_true', help='Update stock data')
    parser.add_argument('--symbol', type=str, help='Fetch data for a specific symbol')
    parser.add_argument('--interval', type=str, default='1d', choices=INTERVALS, help='Data interval (1m, 5m, 15m, 30m, 1h, 4h, 1d)')
    parser.add_argument('--days', type=int, default=7, help='Number of days to fetch data for')
    parser.add_argument('--schedule', action='store_true', help='Run scheduler')
    
    args = parser.parse_args()
    
    if args.update:
        logger.info("Updating all market data...")
        update_all_asset_data()
        consolidate_output()
        create_exchange_rate_matrix()
        
    elif args.frontend:
        logger.info("Generating frontend data...")
        generate_frontend_data()
        create_summary_file()
        
    elif args.forex:
        logger.info("Updating forex data...")
        update_forex_pairs()
        
    elif args.crypto:
        logger.info("Updating cryptocurrency data...")
        update_crypto_data()
        
    elif args.stocks:
        logger.info("Updating stock data...")
        update_stocks_and_etfs()
        
    elif args.symbol:
        logger.info(f"Fetching data for {args.symbol} ({args.interval})...")
        df = fetch_single_asset(args.symbol, args.interval, True)
        if df is not None:
            print(f"Successfully fetched data for {args.symbol}")
            if args.days > 0:
                # Show the last N days
                cutoff_date = datetime.now() - timedelta(days=args.days)
                df = df[df.index >= cutoff_date]
            print(df)
        else:
            print(f"Failed to fetch data for {args.symbol}")
            
    elif args.schedule:
        logger.info("Running scheduler...")
        main()
        
    else:
        # Default: update and generate frontend data
        logger.info("Updating market data and generating frontend data...")
        update_all_asset_data()
        generate_frontend_data()
        create_summary_file()