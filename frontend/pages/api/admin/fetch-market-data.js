import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Path to Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'data-fetchers', 'investpy_fetcher.py');
    
    // Spawn Python process
    const pythonProcess = spawn('python3', [scriptPath], {
      env: {
        ...process.env,
        STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
        ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
      }
    });

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process error:', errorString);
        return res.status(500).json({ error: 'Data fetcher failed' });
      }
      
      res.status(200).json({ message: 'Data fetch completed', output: dataString });
    });

  } catch (error) {
    console.error('Error running data fetcher:', error);
    res.status(500).json({ error: error.message });
  }
}