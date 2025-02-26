// pages/api/contact.js
import { Resend } from 'resend';

// Initialize the Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5;
const ipRequestMap = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic rate limiting by IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const ipData = ipRequestMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset counter if window has passed
  if (now > ipData.resetTime) {
    ipData.count = 0;
    ipData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Check if rate limit exceeded
  if (ipData.count >= MAX_REQUESTS_PER_IP) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  
  // Increment counter for this IP
  ipData.count++;
  ipRequestMap.set(ip, ipData);

  try {
    const { name, email, inquiryType, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Message is too short' });
    }

    // Determine recipient based on inquiry type
    let toEmail = 'info@bitdash.app';
    switch (inquiryType) {
      case 'support':
        toEmail = 'help@bitdash.app';
        break;
      case 'account':
        toEmail = 'contact@bitdash.app';
        break;
      default:
        toEmail = 'info@bitdash.app';
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'BitFund Contact <contact@bitdash.app>', // Use your verified domain
      to: [toEmail],
      reply_to: email,
      subject: `BitFund Contact: ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)} Inquiry`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3182ce;">New Contact Form Submission</h2>
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3>Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Optionally send confirmation email to user
    await resend.emails.send({
      from: 'BitFund <contact@bitdash.app>', // Use your verified domain
      to: [email],
      subject: 'Thank you for contacting BitFund',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3182ce;">Thank You for Contacting BitFund</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will respond as soon as possible.</p>
          <p>Best regards,<br>The BitFund Team</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}