import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hardcode the absolute path to the .env file
const envPath = 'C:/Users/its1g/Prophet/Prophet/coindatabase/.env';
console.log('Looking for .env file at:', envPath);

const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
//commit bait
// Schema Definition
const priceSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Create compound index for efficient time series queries
priceSchema.index({ ticker: 1, timestamp: -1 });

// Model
const Price = mongoose.model('Price', priceSchema);

// Test Data
const testData = {
    prices: [
        {
            ticker: 'BTC',
            price: 50000,
            timestamp: new Date()
        },
        {
            ticker: 'ETH',
            price: 3000,
            timestamp: new Date()
        }
    ]
};

// Database Connection
async function connectDB() {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI); // Debug log
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Data Insertion Test
async function testDataInsertion() {
    try {
        console.log('\n--- Testing Data Insertion ---');
        
        // Clear existing test data
        await Price.deleteMany({ 
            ticker: { $in: testData.prices.map(p => p.ticker) } 
        });

        // Insert prices
        for (const priceData of testData.prices) {
            const price = new Price(priceData);
            await price.save();
            console.log(`Inserted price for ${priceData.ticker}`);
        }
    } catch (error) {
        console.error('Error in data insertion test:', error);
    }
}

// Query Test
async function testQueries() {
    try {
        console.log('\n--- Testing Queries ---');

        // Test getting all prices
        const allPrices = await Price.find();
        console.log('All prices:', allPrices);

        // Test getting specific ticker price
        const specificPrice = await Price.findOne({ 
            ticker: testData.prices[0].ticker 
        });
        console.log('Specific ticker price:', specificPrice);

        // Test getting price history
        const priceHistory = await Price.find({ 
            ticker: testData.prices[0].ticker 
        }).sort({ timestamp: -1 });
        console.log('Price history:', priceHistory);

        // Test aggregation query for price statistics
        const priceStats = await Price.aggregate([
            {
                $match: { 
                    ticker: testData.prices[0].ticker 
                }
            },
            {
                $group: {
                    _id: '$ticker',
                    avgPrice: { $avg: '$price' },
                    maxPrice: { $max: '$price' },
                    minPrice: { $min: '$price' }
                }
            }
        ]);
        console.log('Price statistics:', priceStats);

    } catch (error) {
        console.error('Error in query test:', error);
    }
}

// Schema Validation Test
async function testSchemaValidation() {
    try {
        console.log('\n--- Testing Schema Validation ---');

        // Test required fields
        const invalidPrice = new Price({});
        try {
            await invalidPrice.save();
        } catch (error) {
            console.log('Successfully caught invalid price entry:', error.message);
        }

        // Test invalid price format
        const invalidPriceFormat = new Price({
            ticker: 'TEST',
            price: 'not_a_number',
        });
        try {
            await invalidPriceFormat.save();
        } catch (error) {
            console.log('Successfully caught invalid price format:', error.message);
        }

    } catch (error) {
        console.error('Error in schema validation test:', error);
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        
        await testDataInsertion();
        await testQueries();
        await testSchemaValidation();

        console.log('\nAll tests completed successfully');
    } catch (error) {
        console.error('Error in main execution:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDisconnected from MongoDB');
    }
}

// Execute tests
main();