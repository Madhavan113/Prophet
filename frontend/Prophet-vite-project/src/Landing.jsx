import React, { useState, useEffect } from 'react';

const CryptoDashboard = () => {
  const [trendingCoins] = useState([
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '43,567.89', change: '+5.2' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: '2,890.45', change: '+3.8' },
    { id: 3, name: 'Solana', symbol: 'SOL', price: '189.67', change: '+12.4' },
    { id: 4, name: 'Cardano', symbol: 'ADA', price: '1.23', change: '-2.1' },
    { id: 5, name: 'Polkadot', symbol: 'DOT', price: '21.45', change: '+7.8' },
    { id: 6, name: 'Avalanche', symbol: 'AVAX', price: '34.56', change: '+9.3' },
  ]);

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % trendingCoins.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [trendingCoins.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            CryptoElite Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-purple-400 text-xl">📈</span>
            <span className="text-gray-400 text-lg">Live Market Data</span>
          </div>
        </div>

        {/* Trending Ticker */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-center space-x-12" 
               style={{ 
                 transform: `translateX(-${scrollPosition * 200}px)`,
                 transition: 'transform 1s ease-in-out'
               }}>
            {trendingCoins.map((coin) => (
              <div key={coin.id} className="flex-shrink-0 text-center min-w-48">
                <div className="text-xl font-semibold mb-2">{coin.symbol}</div>
                <div className="text-2xl font-bold mb-1">${coin.price}</div>
                <div className={`text-lg font-medium ${
                  coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.change}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-800/50 rounded-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <span className="text-yellow-400 text-2xl mr-3">🏆</span>
            <h2 className="text-3xl font-bold">Top Performers</h2>
          </div>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            {trendingCoins.map((coin, index) => (
              <div key={coin.id} 
                   className="flex items-center justify-between p-6 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors">
                <div className="flex items-center space-x-6">
                  <span className="text-2xl font-bold text-gray-400 w-12">{index + 1}</span>
                  <div>
                    <div className="text-xl font-bold mb-1">{coin.name}</div>
                    <div className="text-gray-400 text-lg">{coin.symbol}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="text-xl font-bold mb-1">${coin.price}</div>
                    <div className={`text-lg flex items-center ${
                      coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span className="mr-1">{coin.change.startsWith('+') ? '↑' : '↓'}</span>
                      {coin.change}%
                    </div>
                  </div>
                  <div className={`w-2 h-16 rounded-full ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-gray-300' :
                    index === 2 ? 'bg-amber-600' : 'bg-purple-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;