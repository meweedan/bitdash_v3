// pages/api/crypto-news.js

export default async function handler(req, res) {
  const { coin } = req.query; // expecting a query parameter "coin"
  const apiKey = process.env.CRYPTOPANIC_API_KEY; // set this in your .env.local (without NEXT_PUBLIC)
  
  try {
    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&currencies=${coin}`
    );
    if (!response.ok) {
      throw new Error("CryptoPanic API request failed");
    }
    const data = await response.json();
    // Return only the results array (or modify as needed)
    res.status(200).json({ results: data.results });
  } catch (error) {
    console.error("API Route Error:", error);
    res.status(500).json({ error: error.message });
  }
}
