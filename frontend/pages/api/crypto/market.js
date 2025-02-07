import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&sparkline=true'
    );
    
    const data = response.data.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      sparkline: coin.sparkline_in_7d.price
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
};