const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

async function generateIcons() {
  // Make sure the icons directory exists
  const iconsDir = path.join(process.cwd(), 'public', 'work-icons');
  try {
    await fs.mkdir(iconsDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  // Your source image should be at least 512x512 pixels
  const sourceImage = path.join(process.cwd(), 'public', 'work.png');

  // Generate icons for each size
  for (const size of sizes) {
    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      }
}

generateIcons().catch(console.error);