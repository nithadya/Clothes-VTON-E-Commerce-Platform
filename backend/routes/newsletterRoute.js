import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address (from .env)
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password (from .env)
  },
});

// POST endpoint for email subscription
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Send email to the subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Subscriber email
      subject: 'Welcome to Our Newsletter!', // Email subject
      text: 'Thank you for subscribing to our newsletter. You will receive updates and exclusive offers.', // Email content
    });

    // Save the email to your database (optional)
    // Example: await saveEmailToDatabase(email);

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
});

export default router;