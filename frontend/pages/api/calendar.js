// pages/api/calendar.js

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 60 seconds

export default async function handler(req, res) {
  try {
    // If we have cached data and it's still fresh, return it
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData);
    }
    
    const apiUrl = 'https://api.tradingeconomics.com/calendar?c=6711bef72a994eb:qxujcsu789aj0bw';
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }
    const data = await response.json();
    // Cache the data
    cachedData = data;
    cacheTimestamp = Date.now();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
