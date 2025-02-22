// controllers/user.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Helper to generate a 6-digit code
const generate6DigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Example function to send verification email
const sendVerificationEmail = async (email, code) => {
  // Configure your transporter (use your email service details)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`
  };

  await transporter.sendMail(mailOptions);
};

export const registerUser = async (req, res) => {
  const { username, password, email, bio, portfolio_api_url } = req.body;
  try {
    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'Please provide username, password, and email!' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a 6-digit verification code
    const verificationCode = generate6DigitCode();

    // Create new user document with verified false
    const newUser = new User({
      username,
      email,
      hashed_password: hashedPassword,
      bio,
      portfolio_api_url,
      verified: false,
      verificationCode
    });
    await newUser.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationCode);

    // Remove sensitive info before returning
    const userResponse = newUser.toObject();
    delete userResponse.hashed_password;
    delete userResponse.verificationCode;

    res.status(201).json({ success: true, message: 'Registration successful. Please check your email for the verification code.', data: userResponse });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ success: false, message: 'Server Error!' });
  }
};
