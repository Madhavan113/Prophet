// controllers/user.controller.js
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Helper to generate a 6-digit code
const generate6DigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send verification email
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred email service
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

// REGISTER USER
export const registerUser = async (req, res) => {
  const { username, password, email, bio, portfolio_api_url } = req.body;

  // Basic validation
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, password, and email!'
    });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a 6-digit verification code
    const verificationCode = generate6DigitCode();

    // Create new user document with verified=false
    const newUser = new User({
      username,
      email,
      hashed_password: hashedPassword,
      bio,
      portfolio_api_url,
      verified: false,
      verificationCode
    });

    // Attempt to save the user
    await newUser.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationCode);

    // Remove sensitive info before returning
    const userResponse = newUser.toObject();
    delete userResponse.hashed_password;
    delete userResponse.verificationCode;

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the verification code.',
      data: userResponse
    });
  } catch (error) {
    // Handle duplicate username/email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    console.error('Error creating user:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error!' });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Validate the MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error!' });
  }
};

// VERIFY EMAIL
export const verifyUserEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.verificationCode === code) {
      user.verified = true;
      user.verificationCode = undefined; // clear the code
      await user.save();
      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('Error verifying email:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    // Exclude hashed_password
    const users = await User.find().select('-hashed_password');
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error!' });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { bio, portfolio_api_url, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const updatedFields = { bio, portfolio_api_url };

    // If a new password is provided, hash it
    if (password) {
      const saltRounds = 10;
      updatedFields.hashed_password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove sensitive info
    const userResponse = updatedUser.toObject();
    delete userResponse.hashed_password;
    delete userResponse.verificationCode;

    return res.status(200).json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Error updating user:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error!' });
  }
};
