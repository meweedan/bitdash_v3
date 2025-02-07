// pages/api/process-qr.js
import { IncomingForm } from 'formidable';
import Jimp from 'jimp';
import QrCode from 'qrcode-reader';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form with a Promise wrapper
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const qrImage = files['qr-image'];
    
    if (!qrImage) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read file
    const imageBuffer = await fs.readFile(qrImage.filepath);

    // Process image with Jimp
    const image = await Jimp.read(imageBuffer);
    const qrCodeInstance = new QrCode();

    // Decode QR code
    const value = await new Promise((resolve, reject) => {
      qrCodeInstance.callback = (err, v) => err ? reject(err) : resolve(v);
      qrCodeInstance.decode(image.bitmap);
    });

    // Clean up temp file
    await fs.unlink(qrImage.filepath);

    console.log('Decoded QR Value:', value?.result); // Debug log

    // Get the URL from the QR code
    let url = value?.result;

    if (!url) {
      return res.status(400).json({ error: 'Could not decode QR code' });
    }

    // Handle different URL formats
    try {
      // Check if it's a full URL
      const urlObj = new URL(url);
      url = urlObj.pathname;
    } catch (e) {
      // If it's not a full URL, assume it's a path
      console.log('Not a full URL, using as path:', url);
    }

    // Clean up the path
    url = url.trim();
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Split the path and validate format
    const pathParts = url.split('/').filter(Boolean);
    console.log('Path parts:', pathParts); // Debug log

    if (pathParts[0] === 'menu' && pathParts[1]) {
      const finalUrl = `/${pathParts[0]}/${pathParts[1]}`;
      console.log('Final URL:', finalUrl); // Debug log
      return res.status(200).json({ url: finalUrl });
    }

    // If the format doesn't match exactly but contains 'menu' and an ID
    const menuIndex = pathParts.findIndex(part => part.toLowerCase() === 'menu');
    if (menuIndex !== -1 && pathParts[menuIndex + 1]) {
      const finalUrl = `/menu/${pathParts[menuIndex + 1]}`;
      console.log('Alternative format URL:', finalUrl); // Debug log
      return res.status(200).json({ url: finalUrl });
    }

    return res.status(400).json({ 
      error: 'Invalid QR code format. Expected restaurant menu URL.',
      decoded: url, // Include the decoded value for debugging
      pathParts // Include path parts for debugging
    });

  } catch (error) {
    console.error('QR Processing Error:', error);
    
    return res.status(500).json({ 
      error: error.message || 'Failed to process QR code',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}