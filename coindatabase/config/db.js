import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from the hardcoded .env path
dotenv.config({ path: "C:/Users/kaili/Desktop/Coding Projects/Prophet/bookpricer/backend/.env" });

// MongoDB connection function
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  }
}

export default connectDB;