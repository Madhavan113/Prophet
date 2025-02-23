import mongoose from 'mongoose';
import Order from '../models/order.model.js'; // Import the Order model
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Delete all entries in the orderbook
const deleteAllOrders = async () => {
  try {
    // Delete all documents in the Order collection
    const result = await Order.deleteMany({});
    console.log(`Deleted ${result.deletedCount} orders from the orderbook.`);
  } catch (error) {
    console.error('Error deleting orders:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
(async () => {
  await connectToDatabase();
  await deleteAllOrders();
})();