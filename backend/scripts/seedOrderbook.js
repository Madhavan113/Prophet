// scripts/seedOrderbook.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api/orderbook';

// Mock order data
const mockOrders = [
  {
    type: 'BUY',
    coinPair: 'BTC-USD',
    price: 63500.00,
    amount: 0.5,
    userId: '507f1f77bcf86cd799439011'
  },
  {
    type: 'SELL',
    coinPair: 'BTC-USD',
    price: 64000.00,
    amount: 0.75,
    userId: '507f1f77bcf86cd799439012'
  },
  {
    type: 'BUY',
    coinPair: 'BTC-USD',
    price: 63200.00,
    amount: 1.2,
    userId: '507f1f77bcf86cd799439013'
  },
  {
    type: 'BUY',
    coinPair: 'ETH-USD',
    price: 3200.00,
    amount: 5.0,
    userId: '507f1f77bcf86cd799439011'
  },
  {
    type: 'SELL',
    coinPair: 'ETH-USD',
    price: 3250.00,
    amount: 3.0,
    userId: '507f1f77bcf86cd799439012'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting to seed database via API...');

    // Create orders through API and print full JSON of each created order
    for (const order of mockOrders) {
      try {
        const response = await axios.post(`${API_URL}/order`, order);
        console.log('Created order:', JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
      }
    }

    // Verify orders were created by fetching them and printing full JSON objects
    const btcOrders = await axios.get(`${API_URL}/BTC-USD`);
    console.log('\nBTC-USD Orders:', JSON.stringify(btcOrders.data, null, 2));

    const ethOrders = await axios.get(`${API_URL}/ETH-USD`);
    console.log('\nETH-USD Orders:', JSON.stringify(ethOrders.data, null, 2));

    console.log('\nDatabase seeding completed!');
  } catch (error) {
    console.error('Error in seeding process:', error.response?.data || error.message);
  }
};

// Run the seed function
seedDatabase();
