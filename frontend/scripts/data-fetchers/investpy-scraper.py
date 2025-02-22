# frontend/scripts/data-fetchers/investpy_fetcher.py

import investpy
import pandas as pd
from datetime import datetime, timedelta
import time
import json
import logging
import requests
import sys
import os

# Set up logging to both file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('investpy_scraper.log')
    ]
)

class StrapiInvestpyScraper:
    def __init__(self, strapi_url, auth_token):
        self.strapi_url = strapi_url
        self.auth_token = auth_token
        
        # Define pairs to fetch
        self.forex_pairs = [
            ('USD', 'EUR'), ('USD', 'GBP'), ('USD', 'LYD'),
            ('USD', 'EGP'), ('USD', 'TND')
        ]
        
        self.crypto_pairs = [
            ('BTC', 'USD'), ('ETH', 'USD'), ('USDT', 'USD')
        ]
        
        self.commodities = [
            ('XAU', 'USD'),  # Gold
            ('XAG', 'USD')   # Silver
        ]

        # Profit margins and multipliers
        self.margins = {
            'forex': {'buy': 0.02, 'sell': 0.015, 'multiplier': 1.0},
            'crypto': {'buy': 0.02, 'sell': 0.015, 'multiplier': 1.2},
            'metals': {'buy': 0.02, 'sell': 0.015, 'multiplier': 1.2}
        }

    def save_to_strapi(self, data):
        try:
            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f'{self.strapi_url}/api/exchange-rates',
                headers=headers,
                json={'data': data}
            )
            
            if response.status_code == 200:
                logging.info(f"Successfully saved {data['from_currency']}/{data['to_currency']}")
                return True
            else:
                logging.error(f"Failed to save data: {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"Error saving to Strapi: {str(e)}")
            return False

    def process_data(self, data, from_curr, to_curr, asset_type):
        try:
            margins = self.margins[asset_type]
            for index, row in data.iterrows():
                rate = float(row['Close'])
                
                entry_data = {
                    'from_currency': from_curr,
                    'to_currency': to_curr,
                    'rate': rate,
                    'buy_price': rate * (1 + margins['buy']),
                    'sell_price': rate * (1 - margins['sell']),
                    'open_rate': float(row['Open']),
                    'high_rate': float(row['High']),
                    'low_rate': float(row['Low']),
                    'volume': float(row['Volume']) if 'Volume' in row else 0,
                    'change_percentage': float(((rate - float(row['Open'])) / float(row['Open'])) * 100),
                    'source': 'investpy',
                    'timestamp': index.isoformat(),
                    'market_multiplier': margins['multiplier'],
                    'is_crypto': asset_type == 'crypto'
                }
                
                self.save_to_strapi(entry_data)
                time.sleep(1)  # Rate limiting
                
        except Exception as e:
            logging.error(f"Error processing data for {from_curr}/{to_curr}: {str(e)}")

    def fetch_all_data(self):
        end_date = datetime.now()
        # Fetch last 7 days of data
        start_date = end_date - timedelta(days=7)
        
        date_from = start_date.strftime('%d/%m/%Y')
        date_to = end_date.strftime('%d/%m/%Y')

        # Fetch forex pairs
        for base, quote in self.forex_pairs:
            try:
                logging.info(f"Fetching forex data for {base}/{quote}")
                data = investpy.get_currency_cross_historical_data(
                    from_currency=base,
                    to_currency=quote,
                    from_date=date_from,
                    to_date=date_to
                )
                self.process_data(data, base, quote, 'forex')
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                logging.error(f"Error fetching forex pair {base}/{quote}: {str(e)}")

        # Fetch crypto pairs
        for base, quote in self.crypto_pairs:
            try:
                logging.info(f"Fetching crypto data for {base}")
                data = investpy.get_crypto_historical_data(
                    crypto=base,
                    from_date=date_from,
                    to_date=date_to
                )
                self.process_data(data, base, quote, 'crypto')
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"Error fetching crypto {base}: {str(e)}")

        # Fetch commodities
        for symbol, quote in self.commodities:
            try:
                logging.info(f"Fetching commodity data for {symbol}")
                commodity_name = 'Gold' if symbol == 'XAU' else 'Silver'
                data = investpy.get_commodity_historical_data(
                    commodity=commodity_name,
                    from_date=date_from,
                    to_date=date_to
                )
                self.process_data(data, symbol, quote, 'metals')
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"Error fetching commodity {symbol}: {str(e)}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python investpy_fetcher.py <strapi_url> <auth_token>")
        sys.exit(1)

    strapi_url = sys.argv[1]
    auth_token = sys.argv[2]

    logging.info(f"Starting data fetch for {strapi_url}")
    
    try:
        scraper = StrapiInvestpyScraper(strapi_url, auth_token)
        scraper.fetch_all_data()
        logging.info("Data fetch completed successfully")
    except Exception as e:
        logging.error(f"Error in main execution: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()