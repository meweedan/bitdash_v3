#!/usr/bin/env python3
import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta
import time

# ----- Configuration -----
FIAT = ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND']
CRYPTO = ['BTC', 'ETH', 'USDT']
METALS = ['XAU', 'XAG']
ALL_CURRENCIES = FIAT + CRYPTO + METALS

# ----- Helper Functions -----
def get_ticker(currency):
    """
    Returns the appropriate yfinance ticker for a given currency.
    For CRYPTO and METALS, use their known tickers.
    For FIAT, assume the ticker format is "{currency}USD=X".
    """
    special_mapping = {
        "BTC": "BTC-USD",
        "ETH": "ETH-USD",
        "USDT": "USDT-USD",
        "XAU": "XAUUSD=X",
        "XAG": "XAGUSD=X"
    }
    if currency in special_mapping:
        return special_mapping[currency]
    else:
        return f"{currency}USD=X"

def flatten_columns(df):
    """If the DataFrame has MultiIndex columns, drop extra levels."""
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    return df

def get_historical_data_for_pair(base, quote, start_date, end_date, interval="1d"):
    """
    Fetches daily historical data for the given currency pair using yfinance.
    Conversion rules:
      - If base is USD: fetch ticker for quote and invert the rates.
      - If quote is USD: fetch ticker for base directly.
      - Otherwise: fetch both (base/USD and quote/USD) and compute the ratio.
    Returns a DataFrame with columns: Open, High, Low, Close, Volume.
    """
    # Case 1: base is USD -> fetch ticker for quote and invert
    if base == "USD":
        ticker = get_ticker(quote)
        df = yf.download(ticker, start=start_date, end=end_date, interval=interval)
        if df.empty:
            return None
        df = flatten_columns(df)
        # Invert rates (note: high and low are swapped on inversion)
        df_inverted = df.copy()
        df_inverted["Open"] = 1.0 / df["Open"]
        df_inverted["High"] = 1.0 / df["Low"]
        df_inverted["Low"] = 1.0 / df["High"]
        df_inverted["Close"] = 1.0 / df["Close"]
        return df_inverted

    # Case 2: quote is USD -> fetch ticker for base directly
    if quote == "USD":
        ticker = get_ticker(base)
        df = yf.download(ticker, start=start_date, end=end_date, interval=interval)
        if df.empty:
            return None
        df = flatten_columns(df)
        return df

    # Case 3: Neither is USD -> fetch both and compute ratio
    ticker_base = get_ticker(base)
    ticker_quote = get_ticker(quote)
    df_base = yf.download(ticker_base, start=start_date, end=end_date, interval=interval)
    df_quote = yf.download(ticker_quote, start=start_date, end=end_date, interval=interval)
    if df_base.empty or df_quote.empty:
        return None
    df_base = flatten_columns(df_base)
    df_quote = flatten_columns(df_quote)
    # Merge on the date index
    df_merged = pd.merge(df_base, df_quote, left_index=True, right_index=True, suffixes=('_base', '_quote'))
    # Compute ratio; use approximations for high and low
    df_merged["Open"] = df_merged["Open_base"] / df_merged["Open_quote"]
    df_merged["High"] = df_merged["High_base"] / df_merged["Low_quote"]
    df_merged["Low"] = df_merged["Low_base"] / df_merged["High_quote"]
    df_merged["Close"] = df_merged["Close_base"] / df_merged["Close_quote"]
    df_merged["Volume"] = df_merged["Volume_base"]
    df_final = df_merged[["Open", "High", "Low", "Close", "Volume"]]
    return df_final

def safe_float(x):
    """Converts x to a float. If x is a single-element Series, use its first element."""
    if isinstance(x, pd.Series):
        return float(x.iloc[0])
    return float(x)

def create_record_from_row(base, quote, row, date):
    """
    Converts a row from the historical DataFrame into a record matching
    the exchange-rate schema.
    """
    try:
        open_rate = safe_float(row["Open"])
        high_rate = safe_float(row["High"])
        low_rate = safe_float(row["Low"])
        close_rate = safe_float(row["Close"])
    except Exception as ex:
        print(f"Error converting rates for {base}/{quote} on {date}: {ex}")
        return None

    # For volume, ensure we handle potential Series ambiguity
    try:
        vol_val = row["Volume"]
        volume = safe_float(vol_val) if not pd.isna(vol_val).all() else 0.0
    except Exception:
        volume = 0.0

    buy_price = close_rate * 1.02
    sell_price = close_rate * 0.98
    change_percentage = ((close_rate - open_rate) / open_rate * 100) if open_rate != 0 else 0.0

    record = {
        "from_currency": base,
        "to_currency": quote,
        "rate": close_rate,
        "buy_price": buy_price,
        "sell_price": sell_price,
        "open_rate": open_rate,
        "high_rate": high_rate,
        "low_rate": low_rate,
        "volume": volume,
        "change_percentage": change_percentage,
        "source": "yfinance",
        "timestamp": date.isoformat(),
        "market_multiplier": 1.0,
        "is_crypto": base in CRYPTO
    }
    return record

# ----- Main Script -----
def main():
    # Define the time range: last 1 year
    end_date = datetime.today()
    start_date = end_date - timedelta(days=365)
    interval = "1d"  # daily data

    all_records = []
    pairs = []
    # Generate all ordered pairs (base, quote) where base != quote.
    for base in ALL_CURRENCIES:
        for quote in ALL_CURRENCIES:
            if base != quote:
                pairs.append((base, quote))
                
    print(f"Fetching historical data for {len(pairs)} pairs...")
    for base, quote in pairs:
        print(f"Fetching {base}/{quote} ...")
        df = get_historical_data_for_pair(base, quote, start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"), interval)
        if df is None or df.empty:
            print(f"No data for {base}/{quote}; skipping.")
            continue
        # Ensure DataFrame columns are flattened (if not already)
        df = flatten_columns(df)
        for idx, row in df.iterrows():
            record = create_record_from_row(base, quote, row, idx)
            if record:
                all_records.append(record)
        time.sleep(1)  # brief pause to avoid rate limits

    output_file = "data/exchange_rates_data.json"
    with open(output_file, "w") as f:
        json.dump(all_records, f, indent=4)
    print(f"Data for {len(pairs)} pairs saved to {output_file}")

if __name__ == "__main__":
    main()
