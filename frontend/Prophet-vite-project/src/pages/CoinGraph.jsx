import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the dynamic route params
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MusicCryptoDashboard = () => {
  const { id } = useParams(); // Retrieve the dynamic 'id' parameter from the route

  // Mock data for the price of the coin over time (replace with actual data for real use)
  const [coinPriceData, setCoinPriceData] = useState([
    { time: '2024-02-01', price: 50 },
    { time: '2024-02-02', price: 52 },
    { time: '2024-02-03', price: 55 },
    { time: '2024-02-04', price: 54 },
    { time: '2024-02-05', price: 79 },
    { time: '2024-02-06', price: 111 },
    { time: '2024-02-07', price: 444 },
  ]);

  // Determine if the price has gone up or down
  const isProfitable =
    coinPriceData.length > 0 &&
    coinPriceData[coinPriceData.length - 1].price > coinPriceData[0].price;

  // State for Buy/Sell actions
  const [action, setAction] = useState(null);
  const [buyAmount, setBuyAmount] = useState(''); // State for buy amount
  const [sellAmount, setSellAmount] = useState(''); // State for sell amount

  // Update body styles on mount and cleanup on unmount
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = '#0a0a0a'; // Dark fallback

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Function to send order data to the API
  const sendOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/orderbook/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      console.log('Order successfully placed:', result);
      setAction(`Order placed: ${orderData.type} ${orderData.amount} units of ${orderData.coinPair}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setAction(`Failed to place order: ${error.message}`);
    }
  };

  // Handlers for Buy and Sell buttons
  const handleBuy = () => {
    if (!buyAmount || isNaN(buyAmount) || buyAmount <= 0) {
      setAction('Please enter a valid amount to buy');
      return;
    }

    const orderData = {
      type: 'BUY',
      coinPair: id, // Use the coin ID from the URL
      price: coinPriceData[coinPriceData.length - 1].price, // Use the latest price
      amount: parseFloat(buyAmount),
      userId: '67ba4f2338434f902d054c58', // Replace with actual user ID (e.g., from authentication)
      status: 'OPEN',
    };

    sendOrder(orderData);
    setBuyAmount(''); // Clear the input after action
  };

  const handleSell = () => {
    if (!sellAmount || isNaN(sellAmount) || sellAmount <= 0) {
      setAction('Please enter a valid amount to sell');
      return;
    }

    const orderData = {
      type: 'SELL',
      coinPair: id, // Use the coin ID from the URL
      price: coinPriceData[coinPriceData.length - 1].price, // Use the latest price
      amount: parseFloat(sellAmount),
      userId: '67ba4f2338434f902d054c58', // Replace with actual user ID (e.g., from authentication)
      status: 'OPEN',
    };

    sendOrder(orderData);
    setSellAmount(''); // Clear the input after action
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="relative min-h-screen w-full">
        {/* Navigation Bar */}
        <nav className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Prophet
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="mx-auto p-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">{id}</h1>
            </div>

            {/* Display the ID */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white">
                Currently Displaying Information for Coin ID: {id}
              </h2>
              <p className="text-sm text-gray-300">
                This is where the data related to coin with ID {id} will be displayed.
              </p>
            </div>

            {/* Graph of Coin Price */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Price History</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={coinPriceData}>
                  <defs>
                    {/* Gradient for profitable areas */}
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} /> {/* Green */}
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    {/* Gradient for non-profitable areas */}
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} /> {/* Red */}
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isProfitable ? '#10B981' : '#EF4444'} // Dynamic stroke color
                    strokeWidth={4} // Increase line width here
                    fillOpacity={0} // No fill under the line
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Action Buttons (Buy / Sell) */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Buy Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Buy Amount
                  </label>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount to buy"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleBuy}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
                >
                  Buy
                </button>
              </div>

              {/* Sell Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Sell Amount
                  </label>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter amount to sell"
                    min="0"
                  />
                </div>
                <button
                  onClick={handleSell}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Action Status */}
            {action && (
              <div className="mt-6 text-center">
                <p className="text-white text-lg bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                  {action}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCryptoDashboard;
