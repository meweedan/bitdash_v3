#!/usr/bin/env python3
"""
Command-line interface for Market Data Fetcher.
Allows for fetching and managing market data from the command line.
"""

import os
import sys
import argparse
import json
import pandas as pd
from datetime import datetime, timedelta
from tabulate import tabulate
from pathlib import Path

# Add the parent directory to the path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import from the main script
from market_data_fetcher import (
    fetch_single_asset, get_latest_price, update_all_asset_data,
    consolidate_output, create_exchange_rate_matrix, 
    FIAT, CRYPTO, METALS, COMMODITIES, INDICES, POPULAR_STOCKS,
    CACHE_DIR, OUTPUT_DIR, ensure_dirs, load_from_cache
)

def format_price(value):
    """Format price with appropriate number of decimal places"""
    if value is None:
        return "N/A"
    if isinstance(value, str):
        return value
    
    if abs(value) < 0.0001:
        return f"{value:.8f}"
    elif abs(value) < 0.01:
        return f"{value:.6f}"
    elif abs(value) < 1:
        return f"{value:.4f}"
    elif abs(value) < 10000:
        return f"{value:.2f}"
    else:
        return f"{int(value):,}"

def display_asset(symbol, interval="1d", days=7, force_refresh=False):
    """Display asset data in a nice table format"""
    df = fetch_single_asset(symbol, interval, force_refresh)
    
    if df is None or df.empty:
        print(f"No data available for {symbol}")
        return
    
    # Filter to the last N days
    start_date = datetime.now() - timedelta(days=days)
    df = df[df.index >= start_date]
    
    # Calculate additional metrics
    df['change'] = df['close'].pct_change() * 100
    df['range'] = ((df['high'] - df['low']) / df['close'] * 100)
    
    # Format the data for display
    data = []
    for idx, row in df.iterrows():
        data.append([
            idx.strftime('%Y-%m-%d %H:%M') if interval == "1h" else idx.strftime('%Y-%m-%d'),
            format_price(row['open']),
            format_price(row['high']),
            format_price(row['low']),
            format_price(row['close']),
            f"{row['change']:.2f}%" if not pd.isna(row['change']) else "N/A",
            f"{row['range']:.2f}%" if not pd.isna(row['range']) else "N/A",
            f"{int(row['volume']):,}" if 'volume' in row and not pd.isna(row['volume']) else "N/A"
        ])
    
    # Calculate summary statistics
    first_price = df['open'].iloc[0] if not df.empty else None
    last_price = df['close'].iloc[-1] if not df.empty else None
    period_change = ((last_price / first_price) - 1) * 100 if first_price and last_price else None
    
    max_price = df['high'].max() if not df.empty else None
    min_price = df['low'].min() if not df.empty else None
    avg_price = df['close'].mean() if not df.empty else None
    
    # Print asset information
    print(f"\n{symbol} ({interval} data for last {days} days)")
    print(f"Current Price: {format_price(last_price)}")
    print(f"Period Change: {format_price(period_change)}%")
    print(f"Price Range: {format_price(min_price)} - {format_price(max_price)} (Avg: {format_price(avg_price)})")
    print(f"Last Updated: {df.index[-1] if not df.empty else 'N/A'}")
    
    # Display the data table
    headers = ['Date/Time', 'Open', 'High', 'Low', 'Close', 'Change %', 'Range %', 'Volume']
    print(tabulate(data, headers=headers, tablefmt='grid'))

def display_price_matrix(base_currencies=None, quote_currencies=None):
    """Display a matrix of exchange rates"""
    if base_currencies is None:
        base_currencies = FIAT[:5] + CRYPTO[:3] + METALS[:2]
    
    if quote_currencies is None:
        quote_currencies = FIAT[:5]
    
    # Prepare the data
    data = []
    headers = ['Base\\Quote'] + quote_currencies
    
    for base in base_currencies:
        row = [base]
        for quote in quote_currencies:
            if base == quote:
                row.append('1.0')
                continue
            
            # Get the latest price
            result = get_latest_price(base, quote)
            if 'price' in result:
                row.append(format_price(result['price']))
            else:
                row.append('N/A')
        
        data.append(row)
    
    # Display the table
    print("\nExchange Rate Matrix")
    print(tabulate(data, headers=headers, tablefmt='grid'))

def display_portfolio(portfolio_file):
    """Display portfolio value and statistics"""
    if not os.path.exists(portfolio_file):
        print(f"Portfolio file not found: {portfolio_file}")
        return
    
    try:
        with open(portfolio_file, 'r') as f:
            portfolio = json.load(f)
    except Exception as e:
        print(f"Error reading portfolio file: {e}")
        return
    
    total_value_usd = 0.0
    data = []
    
    for asset in portfolio:
        symbol = asset.get('symbol')
        amount = asset.get('amount', 0)
        cost_basis = asset.get('cost_basis')
        quote_currency = asset.get('quote_currency', 'USD')
        
        # Get latest price
        result = get_latest_price(symbol, 'USD')
        current_price = result.get('price')
        
        if current_price:
            value_usd = current_price * amount
            total_value_usd += value_usd
            
            # Calculate profit/loss if cost basis is available
            pnl = None
            pnl_percent = None
            if cost_basis:
                pnl = value_usd - (cost_basis * amount)
                pnl_percent = (pnl / (cost_basis * amount)) * 100 if cost_basis > 0 else 0
            
            data.append([
                symbol,
                format_price(amount),
                format_price(current_price),
                format_price(value_usd),
                format_price(cost_basis) if cost_basis else 'N/A',
                format_price(pnl) if pnl is not None else 'N/A',
                f"{pnl_percent:.2f}%" if pnl_percent is not None else 'N/A'
            ])
    
    # Display portfolio summary
    print("\nPortfolio Summary")
    print(f"Total Value: ${format_price(total_value_usd)}")
    print(f"Assets: {len(portfolio)}")
    
    # Display portfolio details
    headers = ['Asset', 'Amount', 'Price (USD)', 'Value (USD)', 'Cost Basis', 'P/L', 'P/L %']
    print(tabulate(data, headers=headers, tablefmt='grid'))

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Market Data Fetcher CLI')
    
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Asset command
    asset_parser = subparsers.add_parser('asset', help='Get data for a specific asset')
    asset_parser.add_argument('symbol', help='Asset symbol (e.g., BTC, AAPL)')
    asset_parser.add_argument('--interval', '-i', choices=['1h', '1d'], default='1d',
                             help='Data interval (default: 1d)')
    asset_parser.add_argument('--days', '-d', type=int, default=7,
                             help='Number of days to display (default: 7)')
    asset_parser.add_argument('--refresh', '-r', action='store_true',
                             help='Force refresh data from source')
    
    # Price command
    price_parser = subparsers.add_parser('price', help='Get latest price for an asset')
    price_parser.add_argument('symbol', help='Asset symbol (e.g., BTC, AAPL)')
    price_parser.add_argument('--quote', '-q', default='USD',
                             help='Quote currency (default: USD)')
    
    # Matrix command
    matrix_parser = subparsers.add_parser('matrix', help='Display exchange rate matrix')
    matrix_parser.add_argument('--base', '-b', nargs='+',
                             help='Base currencies (default: major currencies)')
    matrix_parser.add_argument('--quote', '-q', nargs='+',
                             help='Quote currencies (default: major fiat)')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List available assets')
    list_parser.add_argument('--type', '-t', choices=['fiat', 'crypto', 'metals', 'commodities', 'indices', 'stocks', 'all'],
                           default='all', help='Asset type to list (default: all)')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update market data')
    update_parser.add_argument('--type', '-t', choices=['all', 'crypto', 'forex', 'stocks', 'commodities', 'indices'],
                             default='all', help='Data type to update (default: all)')
    
    # Portfolio command
    portfolio_parser = subparsers.add_parser('portfolio', help='Display portfolio value')
    portfolio_parser.add_argument('--file', '-f', default='portfolio.json',
                                help='Portfolio file (default: portfolio.json)')
    
    # Cache command
    cache_parser = subparsers.add_parser('cache', help='Manage cache')
    cache_parser.add_argument('--clear', '-c', action='store_true',
                            help='Clear the cache')
    cache_parser.add_argument('--info', '-i', action='store_true',
                            help='Display cache information')
    
    return parser.parse_args()

def handle_list_command(args):
    """Handle the list command"""
    asset_type = args.type
    
    if asset_type == 'fiat' or asset_type == 'all':
        print("\nFiat Currencies:")
        print(', '.join(FIAT))
    
    if asset_type == 'crypto' or asset_type == 'all':
        print("\nCryptocurrencies:")
        print(', '.join(CRYPTO))
    
    if asset_type == 'metals' or asset_type == 'all':
        print("\nPrecious Metals:")
        print(', '.join(METALS))
    
    if asset_type == 'commodities' or asset_type == 'all':
        print("\nCommodities:")
        print(', '.join(COMMODITIES))
    
    if asset_type == 'indices' or asset_type == 'all':
        print("\nStock Indices:")
        print(', '.join(INDICES))
    
    if asset_type == 'stocks' or asset_type == 'all':
        print("\nPopular Stocks:")
        print(', '.join(POPULAR_STOCKS))

def handle_cache_command(args):
    """Handle the cache command"""
    if args.clear:
        if os.path.exists(CACHE_DIR):
            for file in os.listdir(CACHE_DIR):
                file_path = os.path.join(CACHE_DIR, file)
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            print("Cache cleared")
        else:
            print("Cache directory does not exist")
    
    if args.info:
        if os.path.exists(CACHE_DIR):
            cache_files = [f for f in os.listdir(CACHE_DIR) if os.path.isfile(os.path.join(CACHE_DIR, f))]
            total_size = sum(os.path.getsize(os.path.join(CACHE_DIR, f)) for f in cache_files)
            
            print(f"\nCache Directory: {CACHE_DIR}")
            print(f"Total Files: {len(cache_files)}")
            print(f"Total Size: {total_size / 1024:.2f} KB")
            
            # Group by type
            hourly = [f for f in cache_files if '_1h.json' in f]
            daily = [f for f in cache_files if '_1d.json' in f]
            
            print(f"Hourly Data Files: {len(hourly)}")
            print(f"Daily Data Files: {len(daily)}")
            
            # Show most recent files
            if cache_files:
                print("\nMost Recent Cache Files:")
                recent_files = sorted(cache_files, key=lambda x: os.path.getmtime(os.path.join(CACHE_DIR, x)), reverse=True)[:10]
                for i, file in enumerate(recent_files, 1):
                    file_path = os.path.join(CACHE_DIR, file)
                    mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                    file_size = os.path.getsize(file_path)
                    print(f"{i}. {file} ({file_size/1024:.1f} KB) - Last modified: {mod_time}")
        else:
            print("Cache directory does not exist")

def handle_update_command(args):
    """Handle the update command"""
    update_type = args.type
    
    if update_type == 'all':
        print("Updating all market data...")
        update_all_asset_data()
        consolidate_output()
        create_exchange_rate_matrix()
    elif update_type == 'crypto':
        print("Updating cryptocurrency data...")
        process_asset_list(CRYPTO, "1h", True)
        process_asset_list(CRYPTO, "1d", True)
    elif update_type == 'forex':
        print("Updating forex data...")
        process_asset_list(FIAT, "1d", True)
    elif update_type == 'stocks':
        print("Updating stock data...")
        process_asset_list(POPULAR_STOCKS, "1d", True)
    elif update_type == 'commodities':
        print("Updating commodity data...")
        process_asset_list(COMMODITIES, "1d", True)
    elif update_type == 'indices':
        print("Updating index data...")
        process_asset_list(INDICES, "1d", True)
    
    print("Update completed successfully")

def main():
    """Main CLI function"""
    args = parse_args()
    ensure_dirs()
    
    if args.command == 'asset':
        display_asset(args.symbol, args.interval, args.days, args.refresh)
    
    elif args.command == 'price':
        result = get_latest_price(args.symbol, args.quote)
        if 'price' in result:
            print(f"\n{args.symbol}/{args.quote} Price: {format_price(result['price'])}")
            print(f"Timestamp: {result.get('timestamp', 'N/A')}")
            
            # Show additional info if available
            for key in ['open', 'high', 'low', 'volume']:
                if key in result:
                    print(f"{key.capitalize()}: {format_price(result[key])}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
    
    elif args.command == 'matrix':
        base_currencies = args.base if args.base else None
        quote_currencies = args.quote if args.quote else None
        display_price_matrix(base_currencies, quote_currencies)
    
    elif args.command == 'list':
        handle_list_command(args)
    
    elif args.command == 'update':
        handle_update_command(args)
    
    elif args.command == 'portfolio':
        display_portfolio(args.file)
    
    elif args.command == 'cache':
        handle_cache_command(args)
    
    else:
        # If no command is provided, show help
        print("Please specify a command. Use --help for more information.")

if __name__ == "__main__":
    main()