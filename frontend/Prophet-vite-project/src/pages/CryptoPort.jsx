import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Sample data - replace with actual API data
const generateMockData = (days) => {
  const data = [];
  let value = 10000;
  for (let i = 0; i < days; i++) {
    // Increase volatility by increasing the randomness factor (e.g., 0.1 instead of 0.02)
    value = value * (1 + (Math.random() - 0.5) * 0.1); // Increased volatility
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: value
    });
  }
  return data;
};

const mockHoldings = [
  { coin: 'Bitcoin', symbol: 'BTC', amount: 0.45, value: 21345.67, change: 2.3 },
  { coin: 'Ethereum', symbol: 'ETH', amount: 4.2, value: 8765.43, change: -1.2 },
  { coin: 'Solana', symbol: 'SOL', amount: 65.0, value: 4532.10, change: 5.7 },
  { coin: 'Cardano', symbol: 'ADA', amount: 2500.0, value: 2345.67, change: -0.8 },
  { coin: 'Polkadot', symbol: 'DOT', amount: 150.0, value: 1987.54, change: 3.4 },
];

const PortfolioDashboard = () => {
  const [timeframe, setTimeframe] = useState('3M');
  const timeframes = {
    '3M': 90,
    '1Y': 365,
    '5Y': 1825,
    'ALL': 2555
  };

  const chartData = generateMockData(timeframes[timeframe]);
  const totalValue = mockHoldings.reduce((acc, curr) => acc + curr.value, 0);

  // Determine if the chart is overall profitable
  const isChartProfitable = chartData[chartData.length - 1].value > chartData[0].value;

  return (
    <div className="min-h-screen bg-gray-900 text-white w-screen overflow-x-hidden">
      <div className="pt-16 w-full max-w-full">
        {/* Portfolio Value Header */}
        <div className="mb-8 px-6">
          <h1 className="text-2xl font-bold mb-2">Portfolio Value</h1>
          <div className="text-4xl font-bold text-purple-400">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 mx-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Portfolio Performance</h2>
            <div className="flex space-x-2">
              {Object.keys(timeframes).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeframe === period
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  {/* Gradient for profitable areas */}
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/> {/* Green */}
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  {/* Gradient for non-profitable areas */}
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/> {/* Red */}
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value) => `$${value.toFixed(2)}`} // Show dollar amount up to 2 decimal places
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isChartProfitable ? '#10B981' : '#EF4444'} // Dynamic stroke color
                  fillOpacity={1}
                  fill={isChartProfitable ? 'url(#colorProfit)' : 'url(#colorLoss)'} // Dynamic fill color
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="bg-gray-800 rounded-xl p-6 mx-6">
          <h2 className="text-xl font-semibold mb-6">Current Holdings</h2>
          <div className="grid gap-4">
            {mockHoldings.map((holding) => (
              <div key={holding.symbol} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-600 p-2 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{holding.coin}</h3>
                    <p className="text-sm text-gray-400">{holding.amount} {holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${holding.value.toLocaleString()}</p>
                  <div className={`flex items-center justify-end text-sm ${
                    holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(holding.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;