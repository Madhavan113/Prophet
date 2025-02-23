// scripts/testApi.js
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const API_URL = 'http://localhost:5000/api/orderbook';

// Create valid ObjectIds for testing
const testUserIds = [
    '67ba4f2338434f902d054c58',  // Use existing userId from your DB
    '67ba4f2338434f902d054c59'   // Use existing userId from your DB
];

const sampleOrders = [
    {
        type: 'BUY',
        coinPair: 'SWIFT-USD',
        price: 150.00,
        amount: 10.0,
        userId: testUserIds[0]
    },
    {
        type: 'SELL',
        coinPair: 'SHEER-USD',
        price: 75.00,
        amount: 20.0,
        userId: testUserIds[1]
    },
    {
        type: 'BUY',
        coinPair: 'SHEER-USD',
        price: 80.00,
        amount: 15.0,
        userId: testUserIds[0]
    },
    {
        type: 'SELL',
        coinPair: 'SWIFT-USD',
        price: 155.00,
        amount: 5.0,
        userId: testUserIds[1]
    },
    {
        type: 'BUY',
        coinPair: 'SWIFT-USD',
        price: 148.00,
        amount: 8.0,
        userId: testUserIds[0]
    },
    {
        type: 'SELL',
        coinPair: 'SHEER-USD',
        price: 77.00,
        amount: 12.0,
        userId: testUserIds[1]
    }
];

const testApi = async () => {
    try {
        console.log('\n=== Starting API Tests ===\n');
        
        // POST - Create new orders
        console.log('1. Creating new orders...');
        const createdOrders = [];
        for (const order of sampleOrders) {
            try {
                const response = await axios.post(`${API_URL}/order`, order);
                createdOrders.push(response.data);
                console.log(`Created order: ${response.data._id} for user ${order.userId}`);
            } catch (error) {
                console.error('Error creating order:', error.response?.data || error.message);
            }
        }

        // GET - Fetch all orders
        console.log('\n2. Fetching all orders...');
        try {
            const allOrders = await axios.get(API_URL);
            console.log(`Found ${allOrders.data.length} total orders:`);
            allOrders.data.forEach(order => {
                console.log(`- Order ${order._id}: ${order.type} ${order.amount} ${order.coinPair} at ${order.price} (User: ${order.userId})`);
            });
        } catch (error) {
            console.error('Error fetching all orders:', error.response?.data || error.message);
        }

        // GET - Fetch orders for specific user
        console.log('\n3. Fetching orders for specific user...');
        try {
            const userOrders = await axios.get(`${API_URL}?userId=${testUserIds[0]}`);
            console.log(`Found ${userOrders.data.length} orders for user ${testUserIds[0]}:`);
            userOrders.data.forEach(order => {
                console.log(`- Order ${order._id}: ${order.type} ${order.amount} ${order.coinPair} at ${order.price}`);
            });
        } catch (error) {
            console.error('Error fetching user orders:', error.response?.data || error.message);
        }

        // DELETE - Delete first created order
        if (createdOrders.length > 0) {
            console.log('\n4. Deleting first created order...');
            try {
                const deleteResponse = await axios.delete(`${API_URL}/${createdOrders[0]._id}`);
                console.log('Delete response:', deleteResponse.data);
            } catch (error) {
                console.error('Error deleting order:', error.response?.data || error.message);
            }
        }

        // Verify deletion
        console.log('\n5. Verifying deletion by fetching all orders again...');
        try {
            const remainingOrders = await axios.get(API_URL);
            console.log(`Remaining orders: ${remainingOrders.data.length}`);
            remainingOrders.data.forEach(order => {
                console.log(`- Order ${order._id}: ${order.type} ${order.amount} ${order.coinPair} at ${order.price} (User: ${order.userId})`);
            });
        } catch (error) {
            console.error('Error fetching remaining orders:', error.response?.data || error.message);
        }

        console.log('\n=== API Tests Completed ===\n');
    } catch (error) {
        console.error('Unexpected error during testing:', error);
    }
};

// Run the tests
console.log('Starting API tests...');
testApi().then(() => console.log('Tests completed!'));