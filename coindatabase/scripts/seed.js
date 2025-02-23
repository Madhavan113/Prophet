import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { ArtistCoin } from '../models/artistCoin.model.js';

dotenv.config({ path: "C:/Users/its1g/Prophet/Prophet/.env" });

// List of 12 hardcoded coins
const coins = [
  { artistId: '1', name: 'Taylor Swift', currentPrice: 100, priceChange: 0 },
  { artistId: '2', name: 'Drake', currentPrice: 100, priceChange: 0 },
  { artistId: '3', name: 'The Weeknd', currentPrice: 100, priceChange: 0 },
  { artistId: '4', name: 'Beyoncé', currentPrice: 100, priceChange: 0 },
  { artistId: '5', name: 'Ed Sheeran', currentPrice: 100, priceChange: 0 },
  { artistId: '6', name: 'BTS', currentPrice: 100, priceChange: 0 },
  { artistId: '7', name: 'Olivia Rodrigo', currentPrice: 100, priceChange: 0 },
  { artistId: '8', name: 'Doja Cat', currentPrice: 100, priceChange: 0 },
  { artistId: '9', name: 'Bad Bunny', currentPrice: 100, priceChange: 0 },
  { artistId: '10', name: 'Billie Eilish', currentPrice: 100, priceChange: 0 },
  { artistId: '11', name: 'Travis Scott', currentPrice: 100, priceChange: 0 },
  { artistId: '12', name: 'Ariana Grande', currentPrice: 100, priceChange: 0 },
];

async function seedCoins() {
  try {
    await connectDB();
    // Optionally clear any existing coin documents before seeding
    await ArtistCoin.deleteMany({});
    await ArtistCoin.insertMany(coins);
    console.log('Coins seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding coins:', error);
    process.exit(1);
  }
}

seedCoins();