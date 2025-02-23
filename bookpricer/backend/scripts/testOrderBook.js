import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Replace with your server's URL

// Function to make a POST request to create an order
async function createOrder() {
    try {
        const orderData = {
            type: 'BUY', // or 'SELL'
            coinPair: 'BTC-USD',
            price: 50000,
            amount: 0.1,
            userId: '12345' // Replace with a valid user ID
        };

        const response = await axios.post(`${BASE_URL}/order`, orderData);
        console.log('POST /order Response:', response.data);
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
    }
}

// Function to make a GET request to fetch the orderbook
async function fetchOrderbook(coinPair) {
    try {
        const response = await axios.get(`${BASE_URL}/${coinPair}`);
        console.log(`GET /${coinPair} Response:`, response.data);
    } catch (error) {
        console.error('Error fetching orderbook:', error.response ? error.response.data : error.message);
    }
}

// Run the functions
(async () => {
    console.log('Testing Orderbook API...');

    // Create an order
    await createOrder();

    // Fetch the orderbook for a specific coin pair
    await fetchOrderbook('BTC-USD');
})();