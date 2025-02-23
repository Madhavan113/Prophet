import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const PortfolioDashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to view your portfolio.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/auth/assets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const assets = response.data.assets;
        const artistNames = Object.keys(assets);

        // Fetch real-time prices for all assets
        const priceResponses = await Promise.all(
          artistNames.map((artist) =>
            axios.get(`http://localhost:5001/api/prices/${artist}`).catch(() => null)
          )
        );

        const updatedPortfolio = artistNames.map((artist, index) => {
          const coins = assets[artist];
          const priceData = priceResponses[index]?.data;
          const currentPrice = priceData ? priceData.price : 0;
          const totalValue = coins * currentPrice;

          return {
            artist,
            coins,
            currentPrice,
            totalValue,
            priceChange: priceData ? priceData.priceChange : 0,
          };
        });

        setPortfolio(updatedPortfolio);
        setTotalValue(updatedPortfolio.reduce((sum, item) => sum + item.totalValue, 0));
      } catch (error) {
        setErrorMessage('Failed to load portfolio. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white w-screen overflow-x-hidden">
      <div className="pt-16 w-full max-w-full">
        {loading ? (
          <div className="text-center text-gray-400 text-lg mt-10">Loading portfolio...</div>
        ) : errorMessage ? (
          <div className="text-center text-red-400 text-lg mt-10">{errorMessage}</div>
        ) : (
          <>
            <div className="mb-8 px-6">
              <h1 className="text-2xl font-bold mb-2">Portfolio Value</h1>
              <div className="text-4xl font-bold text-purple-400">
                ${totalValue.toLocaleString()}
              </div>
            </div>

            {/* Holdings Section */}
            <div className="bg-gray-800 rounded-xl p-6 mx-6">
              <h2 className="text-xl font-semibold mb-6">Current Holdings</h2>
              <div className="grid gap-4">
                {portfolio.map((holding) => (
                  <div
                    key={holding.artist}
                    className="hover:bg-gray-600 bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-600 p-2 rounded-lg">
                        <DollarSign className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{holding.artist}</h3>
                        <p className="text-sm text-gray-400">{holding.coins} tokens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${holding.totalValue.toLocaleString()}</p>
                      <div className={`text-sm ${holding.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.priceChange}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;
