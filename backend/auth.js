const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // For making API calls
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

// Artist ID mapping
const artistIdMap = {
  'Taylor Swift': 1,
  'Drake': 2,
  'The Weeknd': 3,
  'Beyonce': 4,
  'Ed Sheeran': 5,
  'BTS': 6,
  'Olivia Rodrigo': 7,
  'Doja Cat': 8,
  'Bad Bunny': 9,
  'Billie Eilish': 10,
  'Travis Scott': 11,
  'Ariana Grande': 12,
};

// Fetch current price for an artist
async function fetchArtistPrice(artistId) {
  try {
    const response = await axios.get(`http://localhost:5001/${artistId}/price`);
    return response.data; // { price: 43567.89, priceChange: "+5.2" }
  } catch (error) {
    console.error(`Error fetching price for artist ID ${artistId}:`, error.message);
    return null;
  }
}

// Cache for storing artist prices
let artistPrices = {};

// Update artist prices every 30 seconds
setInterval(async () => {
  for (const [artist, artistId] of Object.entries(artistIdMap)) {
    const priceData = await fetchArtistPrice(artistId);
    if (priceData) {
      artistPrices[artist] = priceData.price; // Store the current price
    }
  }
  console.log("Updated artist prices:", artistPrices);
}, 30000); // 30 seconds

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
      assets: new Map([
        ['Taylor Swift', 0],
        ['Drake', 0],
        ['The Weeknd', 0],
        ['Beyonce', 0],
        ['Ed Sheeran', 0],
        ['BTS', 0],
        ['Olivia Rodrigo', 0],
        ['Doja Cat', 0],
        ['Bad Bunny', 0],
        ['Billie Eilish', 0],
        ['Travis Scott', 0],
        ['Ariana Grande', 0],
      ]),
      purchasePrices: new Map(), // Store purchase prices for each artist
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// Update Assets Endpoint
router.post('/update-assets', authMiddleware, async (req, res) => {
  try {
    const { artist, amount, purchasePrice } = req.body;

    // Validate the artist name
    if (!artistIdMap[artist]) {
      return res.status(400).json({ msg: "Invalid artist name" });
    }

    // Find the user and update their assets
    const user = await User.findOneAndUpdate(
      { _id: req.user }, // Find the user by ID
      {
        $inc: { [`assets.${artist}`]: amount }, // Increment the artist's coins
        $set: { [`purchasePrices.${artist}`]: purchasePrice }, // Set purchase price
      },
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

// Get Assets Endpoint
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

// Portfolio Value Endpoint
router.get('/portfolio-value', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch latest artist prices
    let portfolioBreakdown = [];
    let totalValue = 0;

    for (const [artist, coins] of Object.entries(user.assets)) {
      const artistId = artistIdMap[artist];
      if (!artistId) continue;

      const priceData = await fetchArtistPrice(artistId);
      if (!priceData) continue;

      const currentPrice = priceData.price;
      const value = coins * currentPrice;

      const purchasePrice = user.purchasePrices?.[artist] || currentPrice; // Default to current if no purchase price stored
      const percentChange = purchasePrice ? ((currentPrice - purchasePrice) / purchasePrice) * 100 : 0;

      portfolioBreakdown.push({
        artist,
        coins,
        currentPrice,
        totalValue: value,
        percentChange,
      });

      totalValue += value;
    }

    res.json({ totalValue, portfolio: portfolioBreakdown });
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
