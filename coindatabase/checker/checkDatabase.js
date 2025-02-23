import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ArtistCoin, PriceHistory } from '../models/artistCoin.model.js'; // Adjusted import path

dotenv.config(); // Load environment variables

// Sample data
const sampleArtistId = '64c1b2f3e4b0a1b2c3d4e5f6';
const sampleArtistName = 'Taylor Swift';
const samplePrice = 125.5;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Insert sample data
async function insertSampleData() {
  try {
    // Upsert artist coin (avoid duplicate artist entry)
    const artistCoin = await ArtistCoin.findOneAndUpdate(
      { artistId: sampleArtistId },
      { currentPrice: samplePrice, priceChange: 0, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    console.log('✅ Inserted/Updated artist coin:', artistCoin);

    // Insert price history record
    const priceHistory = new PriceHistory({
      coinId: sampleArtistId,
      price: samplePrice,
      priceChange: 0,
    });
    await priceHistory.save();
    console.log('✅ Inserted price history:', priceHistory);
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

// Query and display data
async function queryData() {
  try {
    // Query artist coin
    const artistCoin = await ArtistCoin.findOne({ artistId: sampleArtistId });
    console.log('📊 Queried artist coin:', artistCoin);

    // Query price history
    const priceHistory = await PriceHistory.find({ coinId: sampleArtistId }).sort({ timestamp: -1 });
    console.log('📈 Queried price history:', priceHistory);
  } catch (error) {
    console.error('❌ Error querying data:', error);
  }
}

// Main function
async function main() {
  await connectDB();
  await insertSampleData();
  await queryData();

  // Close connection
  mongoose.connection.close();
  console.log('🔌 Disconnected from MongoDB');
}

// Run the script
main();
