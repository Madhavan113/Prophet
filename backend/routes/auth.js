// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Attach user ID to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Registration Endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with default assets
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // Assets are initialized with default values in the model
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

router.post('/update-assets', authMiddleware, async (req, res) => {
  try {
    const { artist, amount } = req.body;

    // Validate the artist name
    const validArtists = [
      'Taylor Swift', 'Drake', 'The Weeknd', 'Beyonce', 'Ed Sheeran', 'BTS',
      'Olivia Rodrigo', 'Doja Cat', 'Bad Bunny', 'Billie Eilish', 'Travis Scott', 'Ariana Grande',
    ];
    if (!validArtists.includes(artist)) {
      return res.status(400).json({ msg: "Invalid artist name" });
    }

    // Find the user and update their assets
    const user = await User.findOneAndUpdate(
      { _id: req.user }, // Find the user by ID
      { $inc: { [`assets.${artist}`]: amount } }, // Increment the artist's coins
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Assets updated successfully", assets: Object.fromEntries(user.assets) });
  } catch (err) {
    console.error("Update assets error:", err);
    res.status(500).json({ msg: "Server error during assets update" });
  }
});

router.get('/assets', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ assets: Object.fromEntries(user.assets) }); // Convert Map to object
  } catch (err) {
    console.error("Get assets error:", err);
    res.status(500).json({ msg: "Server error during assets fetch" });
  }
});

router.get('/portfolio-value', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch artist coin values (replace this with your actual logic to fetch values)
    const artistValues = {
      'Taylor Swift': 10,
      'Drake': 15,
      'The Weeknd': 12,
      'Beyonce': 20,
      'Ed Sheeran': 8,
      'BTS': 25,
      'Olivia Rodrigo': 18,
      'Doja Cat': 14,
      'Bad Bunny': 22,
      'Billie Eilish': 16,
      'Travis Scott': 19,
      'Ariana Grande': 21,
    };

    // Calculate portfolio value
    let totalValue = 0;
    for (const [artist, coins] of user.assets) {
      totalValue += coins * (artistValues[artist] || 0);
    }

    res.json({ totalValue });
  } catch (err) {
    console.error("Portfolio value error:", err);
    res.status(500).json({ msg: "Server error during portfolio calculation" });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

// Protected GET Endpoint
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    msg: 'This is a protected route',
    user: req.user, // Return the user ID from the token
  });
});

module.exports = router;