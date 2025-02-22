module.exports = {
  '0 */4 * * *': async () => {  // Runs every 4 hours
    const currencyPairs = [
      { base: 'USD', quote: 'LYD' },
      { base: 'USD', quote: 'EGP' },
      { base: 'BTC', quote: 'USDT' },
      { base: 'ETH', quote: 'USDT' },
      { base: 'USD', quote: 'XAU' },
      { base: 'USD', quote: 'XAG' },
      { base: 'EUR', quote: 'USD' },
      { base: 'GBP', quote: 'USD' }
    ];
    
    for (const pair of currencyPairs) {
      try {
        // @ts-ignore
        await strapi.controllers['api::exchange-rate.exchange-rate'].fetchHistoricalData({
          query: { base: pair.base, quote: pair.quote, days: 30 }
        });
      } catch (error) {
        console.error(`Failed to fetch rates for ${pair.base}-${pair.quote}:`, error);
      }
    }
  }
};