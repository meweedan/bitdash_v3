// api/exchange-rate/services/exchange-rate.js
module.exports = {
  async fetchHistoricalCryptoAndMetalRates() {
    const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'USDT'];
    const METAL_SYMBOLS = ['XAU', 'XAG'];
    
    const PROFIT_MARGINS = {
      CRYPTO: {
        buy: 0.02,
        sell: 0.015,
        market_multiplier: 1.2
      },
      METALS: {
        buy: 0.02,
        sell: 0.015,
        market_multiplier: 1.2
      }
    };

    try {
      // Fetch current rates from CurrencyFreaks
      const cryptoResponse = await fetch(
        `${process.env.CURRENCYFREAKS_URL}/latest?apikey=${process.env.CURRENCYFREAKS_KEY}&symbols=${CRYPTO_SYMBOLS.join(',')}`
      );
      const metalResponse = await fetch(
        `${process.env.CURRENCYFREAKS_URL}/latest?apikey=${process.env.CURRENCYFREAKS_KEY}&symbols=${METAL_SYMBOLS.join(',')}`
      );

      const cryptoData = await cryptoResponse.json();
      const metalData = await metalResponse.json();

      const historicalEntries = [];

      // Process Crypto Rates
      CRYPTO_SYMBOLS.forEach(symbol => {
        const rate = parseFloat(cryptoData.rates[symbol]);
        historicalEntries.push({
          from_currency: 'USDT',
          to_currency: symbol,
          rate: rate,
          open_rate: rate,
          high_rate: rate * 1.01,  // Simulated high
          low_rate: rate * 0.99,   // Simulated low
          buy_price: rate * (1 + PROFIT_MARGINS.CRYPTO.buy),
          sell_price: rate * (1 - PROFIT_MARGINS.CRYPTO.sell),
          change_percentage: 0,
          volume: 0,
          timestamp: new Date(),
          is_crypto: true,
          source: 'CurrencyFreaks'
        });
      });

      // Process Metal Rates
      METAL_SYMBOLS.forEach(symbol => {
        const rate = parseFloat(metalData.rates[symbol]);
        historicalEntries.push({
          from_currency: 'USD',
          to_currency: symbol,
          rate: rate,
          open_rate: rate,
          high_rate: rate * 1.01,  // Simulated high
          low_rate: rate * 0.99,   // Simulated low
          buy_price: rate * (1 + PROFIT_MARGINS.METALS.buy),
          sell_price: rate * (1 - PROFIT_MARGINS.METALS.sell),
          change_percentage: 0,
          volume: 0,
          timestamp: new Date(),
          is_crypto: false,
          source: 'CurrencyFreaks'
        });
      });

      // Bulk create entries
      await Promise.all(historicalEntries.map(async (entry) => {
        await strapi.entityService.create('api::exchange-rate.exchange-rate', {
          data: entry
        });
      }));

      console.log(`Inserted ${historicalEntries.length} historical rate entries`);
    } catch (error) {
      console.error('Error fetching historical crypto and metal rates:', error);
    }
  }
};