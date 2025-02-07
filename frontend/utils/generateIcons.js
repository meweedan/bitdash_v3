// utils/generateIcons.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const customIcons = [
  { symbol: 'lyd', color: '#4CAF50', text: 'LYD' },
  { symbol: 'egp', color: '#FF9800', text: 'EGP' },
  { symbol: 'gbp', color: '#2196F3', text: '£' },
  
  // Stocks
  { symbol: 'apple', color: '#333', text: 'A' },
  { symbol: 'google', color: '#4285F4', text: 'G' },
  { symbol: 'microsoft', color: '#F35426', text: 'M' },
  
  // Commodities
  { symbol: 'gold', color: '#FFD700', text: 'Au' },
  { symbol: 'silver', color: '#C0C0C0', text: 'Ag' },
  { symbol: 'oil', color: '#795548', text: 'OIL' }
];

const generateIcon = async (symbol, color, text) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="${color}"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy=".3em" 
        fill="white" 
        font-size="14" 
        font-weight="bold"
      >
        ${text}
      </text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '..', 'public', 'custom-icons', '32', `${symbol}.png`);
  
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile(outputPath);
};

const generateAllIcons = async () => {
  for (const icon of customIcons) {
    await generateIcon(icon.symbol, icon.color, icon.text);
  }
  console.log('Icons generated successfully');
};

generateAllIcons();