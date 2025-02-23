import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import priceRoutes from './routes/price.route.js';

dotenv.config();

// Initialize Express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/api/prices', priceRoutes);

// Add error/404 handler as needed...

const PORT = process.env.PORT || 5005;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });