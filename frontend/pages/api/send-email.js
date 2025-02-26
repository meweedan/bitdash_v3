// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, inquiryType, platform, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Determine recipient email based on inquiry type
  let toEmail;
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

  try {
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Setup email data
    const mailOptions = {
      from: `BitDash Contact Form <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      replyTo: email,
      subject: `${inquiryType.toUpperCase()} Inquiry - ${platform !== 'all' ? platform : 'All Platforms'}`,
      text: `
Name: ${name}
Email: ${email}
Inquiry Type: ${inquiryType}
Platform: ${platform}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4A5568;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;"><strong>Name:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;"><strong>Email:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;"><strong>Inquiry Type:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${inquiryType}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;"><strong>Platform:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${platform}</td>
    </tr>
  </table>
  
  <h3 style="margin-top: 20px; color: #4A5568;">Message:</h3>
  <div style="background-color: #F7FAFC; padding: 15px; border-radius: 4px;">
    ${message.replace(/\n/g, '<br/>')}
  </div>
</div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const confirmMailOptions = {
      from: `BitDash <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Thank you for contacting BitDash',
      text: `
Dear ${name},

Thank you for reaching out to BitDash. We have received your inquiry and will get back to you as soon as possible.

Your message has been forwarded to our ${inquiryType} team.

Best regards,
The BitDash Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4A5568;">Thank You for Contacting BitDash</h2>
  
  <p>Dear ${name},</p>
  
  <p>Thank you for reaching out to BitDash. We have received your inquiry and will get back to you as soon as possible.</p>
  
  <p>Your message has been forwarded to our ${inquiryType} team.</p>
  
  <p>Best regards,<br/>The BitDash Team</p>
</div>
      `,
    };

    await transporter.sendMail(confirmMailOptions);

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      recipient: toEmail
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
}