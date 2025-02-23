import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LiveTrades = () => {
  const [trades, setTrades] = useState([]);
  const [wsStatus, setWsStatus] = useState('connecting');
  const [lastPrice, setLastPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/trades');

    ws.onopen = () => {
      setWsStatus('connected');
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      setTimeout(() => setWsStatus('connecting'), 5000);
    };

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      
      setTrades(prevTrades => {
        const newTrades = [
          {
            ...trade,
            id: Date.now(),
            isNew: true
          },
          ...prevTrades
        ].slice(0, 10); // Keep only last 10 trades for the dashboard

        if (lastPrice !== null) {
          trade.direction = trade.price > lastPrice ? 'up' : 'down';
        }
        setLastPrice(trade.price);

        setTimeout(() => {
          setTrades(current => 
            current.map(t => 
              t.id === trade.id ? { ...t, isNew: false } : t
            )
          );
        }, 1000);

        return newTrades;
      });
    };

    return () => ws.close();
  }, [lastPrice]);

  return (
    <div className="w-full">
      {wsStatus !== 'connected' ? (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {wsStatus === 'connecting' ? 'Connecting to trade feed...' : 'Disconnected from trade feed'}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className={`
                p-4 rounded-xl bg-gray-700/50 hover:bg-gray-600/50
                ${trade.isNew ? 'animate-fade-in' : ''}
                transition-all duration-300 ease-in-out
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {trade.direction === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : trade.direction === 'down' ? (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  ) : null}
                  <span className="text-lg font-semibold">
                    {trade.type === 'BUY' ? 'Buy' : 'Sell'}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${trade.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-gray-400">
                    {trade.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4
                    })} BTC
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
      <div className="max-w-6xl mx-auto mb-12">
        {/* Header Section */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard Section */}
          <div className="bg-gray-800/50 rounded-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <span className="text-yellow-400 text-2xl mr-3">🏆</span>
              <h2 className="text-3xl font-bold">Top Performers</h2>
            </div>
            
            <div className="space-y-6">
              {trendingCoins.slice(0, 4).map((coin, index) => (
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

          {/* Live Trades Section */}
          <div className="bg-gray-800/50 rounded-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <span className="text-blue-400 text-2xl mr-3">🔄</span>
              <h2 className="text-3xl font-bold">Live Trades</h2>
            </div>
            <LiveTrades />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;