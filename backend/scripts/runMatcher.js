import OrderMatchingService from './OrderMatchingService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MATCHING_INTERVAL = 5000; // 5 seconds in milliseconds

const runMatcher = async () => {
    try {
        // Connect to MongoDB with explicit options
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB successfully');

        // Run initial match
        console.log('Running initial order match...');
        await OrderMatchingService.matchOrders();
        console.log('Initial match completed');

        // Set up interval to run matching every 5 seconds
        setInterval(async () => {
            try {
                console.log(`\nRunning order match at ${new Date().toLocaleTimeString()}`);
                await OrderMatchingService.matchOrders();
                console.log('Match cycle completed');
            } catch (error) {
                console.error('Error in matching interval:', error);
            }
        }, MATCHING_INTERVAL);

        console.log(`Order matcher running every ${MATCHING_INTERVAL/1000} seconds...`);

    } catch (error) {
        console.error('Connection error:', error);
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

// Run the matcher
console.log('Starting order matcher...');
runMatcher();