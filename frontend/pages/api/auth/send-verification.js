import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, email, phone } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  try {
    if (type === 'email') {
      // Send email verification
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BitDash Verification Code',
        html: `
          <div style="padding: 20px; background: #f5f5f5;">
            <h2>Welcome to BitDash!</h2>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `
      });
    } else if (type === 'sms') {
      // Send SMS verification
      await twilioClient.messages.create({
        body: `Your BitDash verification code is: ${verificationCode}`,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    }

    // Store verification code in database
    await prisma.verificationCode.create({
      data: {
        code: verificationCode.toString(),
        type,
        identifier: type === 'email' ? email : phone,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
}