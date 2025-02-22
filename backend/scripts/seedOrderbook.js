// scripts/seedOrderbook.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mock user IDs (you'll need to replace these with real user IDs from your database)
const mockUserIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

// Mock order data
const mockOrders = [
    {
        type: 'BUY',
        coinPair: 'BTC-USD',
        price: 63500.00,
        amount: 0.5,
        userId: mockUserIds[0],
        status: 'OPEN'
    },
    {
        type: 'SELL',
        coinPair: 'BTC-USD',
        price: 64000.00,
        amount: 0.75,
        userId: mockUserIds[1],
        status: 'OPEN'
    },
    {
        type: 'BUY',
        coinPair: 'BTC-USD',
        price: 63200.00,
        amount: 1.2,
        userId: mockUserIds[2],
        status: 'OPEN'
    },
    {
        type: 'BUY',
        coinPair: 'ETH-USD',
        price: 3200.00,
        amount: 5.0,
        userId: mockUserIds[0],
        status: 'OPEN'
    },
    {
        type: 'SELL',
        coinPair: 'ETH-USD',
        price: 3250.00,
        amount: 3.0,
        userId: mockUserIds[1],
        status: 'OPEN'
    }
];

// MongoDB Order Schema
const OrderSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    coinPair: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    filled: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['OPEN', 'PARTIAL', 'FILLED', 'CANCELLED'],
        default: 'OPEN'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', OrderSchema);

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing orders
        await Order.deleteMany({});
        console.log('Cleared existing orders');

        // Insert mock orders
        const insertedOrders = await Order.insertMany(mockOrders);
        console.log('Inserted mock orders:', insertedOrders);

        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seed function
seedDatabase();