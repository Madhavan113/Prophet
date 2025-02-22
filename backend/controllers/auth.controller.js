// controllers/auth.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create a token payload (include any user info you need)
    const tokenPayload = { id: user._id, username: user.username };
    // Sign the JWT (ensure process.env.JWT_SECRET is set)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// controllers/auth.controller.js or user.controller.js
import crypto from 'crypto';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, you might not want to reveal that the email doesn't exist
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset token has been sent.' });
    }
    
    // Generate a reset token and set expiry (e.g., 1 hour from now)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email (similar to the verification email)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Your password reset token is: ${resetToken}\nThis token expires in 1 hour.`
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'If that email is registered, a reset token has been sent.' });
  } catch (error) {
    console.error('Error requesting password reset:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    try {
      const user = await User.findOne({ email, resetToken, resetTokenExpiry: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      
      // Hash the new password and update the user document
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.hashed_password = hashedPassword;
      // Clear reset token fields
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      
      await user.save();
      res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  // middleware/auth.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
