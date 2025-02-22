import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, ArrowUp, ArrowDown, Home, Activity, Settings, User, Zap, Calendar, Music, Star } from 'lucide-react';

const MusicCryptoDashboard = () => {
  // Ensure the gradient applies to the full viewport
  React.useEffect(() => {
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
  const [trendingArtists] = useState([
    { 
      id: 1, 
      name: 'Taylor Swift', 
      symbol: 'SWIFT', 
      price: '43,567.89', 
      change: '+5.2',
      image: 'https://picsum.photos/48/48?random=1'
    },
    { 
      id: 2, 
      name: 'Drake', 
      symbol: 'DRAKE', 
      price: '2,890.45', 
      change: '+3.8',
      image: 'https://picsum.photos/48/48?random=2'
    },
    { 
      id: 3, 
      name: 'The Weeknd', 
      symbol: 'WEEKND', 
      price: '189.67', 
      change: '+12.4',
      image: 'https://picsum.photos/48/48?random=3'
    },
    { 
      id: 4, 
      name: 'Beyoncé', 
      symbol: 'BEY', 
      price: '1.23', 
      change: '-2.1',
      image: 'https://picsum.photos/48/48?random=4'
    },
    { 
      id: 5, 
      name: 'Ed Sheeran', 
      symbol: 'SHEER', 
      price: '21.45', 
      change: '+7.8',
      image: 'https://picsum.photos/48/48?random=5'
    },
    { 
      id: 6, 
      name: 'BTS', 
      symbol: 'BTS', 
      price: '34.56', 
      change: '+9.3',
      image: 'https://picsum.photos/48/48?random=6'
    },
  ]);

  const [risingArtists] = useState([
    { 
      id: 7, 
      name: 'Olivia Rodrigo', 
      symbol: 'RODRIGO', 
      price: '12.34', 
      change: '+25.6',
      image: 'https://picsum.photos/48/48?random=7'
    },
    { 
      id: 8, 
      name: 'Doja Cat', 
      symbol: 'DOJA', 
      price: '45.67', 
      change: '+18.9',
      image: 'https://picsum.photos/48/48?random=8'
    },
    { 
      id: 9, 
      name: 'Bad Bunny', 
      symbol: 'BUNNY', 
      price: '78.90', 
      change: '+15.3',
      image: 'https://picsum.photos/48/48?random=9'
    },
    { 
      id: 10, 
      name: 'Billie Eilish', 
      symbol: 'EILISH', 
      price: '56.78', 
      change: '+22.1',
      image: 'https://picsum.photos/48/48?random=10'
    },
    { 
      id: 11, 
      name: 'Travis Scott', 
      symbol: 'TRAVIS', 
      price: '34.56', 
      change: '+30.4',
      image: 'https://picsum.photos/48/48?random=11'
    },
    { 
      id: 12, 
      name: 'Ariana Grande', 
      symbol: 'GRANDE', 
      price: '67.89', 
      change: '+20.7',
      image: 'https://picsum.photos/48/48?random=12'
    },
  ]);

  const [featuredEvents] = useState([
    {
      id: 1,
      title: 'Taylor Swift Eras Tour',
      type: 'Concert',
      date: '2023-12-15',
      description: 'The ultimate Taylor Swift experience. Bet on ticket sales!',
      odds: '+150',
      image: 'https://picsum.photos/300/200?random=13',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 2,
      title: 'Drake vs Kanye Album Drop',
      type: 'Album Battle',
      date: '2023-11-30',
      description: 'Who will top the charts? Place your bets!',
      odds: '+200',
      image: 'https://picsum.photos/300/200?random=14',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 3,
      title: 'BTS Comeback Single',
      type: 'Album Drop',
      date: '2024-01-10',
      description: 'Will their new single break records?',
      odds: '+120',
      image: 'https://picsum.photos/300/200?random=15',
      gradient: 'from-yellow-600 to-red-600'
    },
    {
      id: 4,
      title: 'Beyoncé Renaissance Tour',
      type: 'Concert',
      date: '2024-02-20',
      description: 'Bet on the success of Beyoncé\'s tour!',
      odds: '+180',
      image: 'https://picsum.photos/300/200?random=16',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      id: 5,
      title: 'Metallica World Tour',
      type: 'Concert',
      date: '2024-03-05',
      description: 'Heavy metal legends return. Bet on attendance!',
      odds: '+250',
      image: 'https://picsum.photos/300/200?random=17',
      gradient: 'from-gray-600 to-black'
    },
    {
      id: 6,
      title: 'Adele Comeback Album',
      type: 'Album Drop',
      date: '2024-04-12',
      description: 'Will Adele dominate the charts again?',
      odds: '+150',
      image: 'https://picsum.photos/300/200?random=18',
      gradient: 'from-pink-600 to-red-600'
    },
  ]);

  const duplicatedArtists = [...trendingArtists, ...trendingArtists, ...trendingArtists];
  const itemWidth = 200;
  const totalWidth = trendingArtists.length * itemWidth;

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
              <div className="flex items-center space-x-8">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                  <span>Markets</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="mx-auto p-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">
                Music Artist Tokens
              </h1>
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-gray-200">Live Market Data</span>
              </div>
            </div>

            {/* Continuous Ticker */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-8 overflow-hidden border border-purple-500/20">
              <div 
                className="flex items-center animate-scroll" 
                style={{
                  '--total-width': `${totalWidth}px`,
                  animation: `scroll ${trendingArtists.length * 5}s linear infinite`
                }}
              >
                {duplicatedArtists.map((artist, index) => (
                  <div key={`${artist.id}-${index}`} className="flex-shrink-0 w-48 mx-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{artist.symbol}</span>
                      <span className={artist.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                        {artist.change}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">${artist.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <style>
              {`
                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-${totalWidth}px);
                  }
                }
                .animate-scroll {
                  will-change: transform;
                }
              `}
            </style>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Top Artist Tokens */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Award className="w-6 h-6 text-yellow-400 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Top Artist Tokens</h2>
                </div>
                
                <div className="space-y-4">
                  {trendingArtists.map((artist, index) => (
                    <div key={artist.id}
                         className="flex items-center justify-between p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg hover:bg-gray-600/50 transition-colors border border-purple-500/10">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-300 w-8">{index + 1}</span>
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-white">{artist.name}</div>
                          <div className="text-sm text-gray-300">{artist.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-medium text-white">${artist.price}</div>
                          <div className={`text-sm flex items-center ${
                            artist.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {artist.change.startsWith('+') ? (
                              <ArrowUp className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDown className="w-4 h-4 mr-1" />
                            )}
                            {artist.change}%
                          </div>
                        </div>
                        <div className={`w-2 h-12 rounded-full ${
                          index === 0 ? 'bg-yellow-400' :
                          index === 1 ? 'bg-gray-300' :
                          index === 2 ? 'bg-amber-600' : 'bg-purple-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rising Artist Tokens */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Zap className="w-6 h-6 text-green-400 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Rising Artist Tokens</h2>
                </div>
                
                <div className="space-y-4">
                  {risingArtists.map((artist, index) => (
                    <div key={artist.id}
                         className="flex items-center justify-between p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg hover:bg-gray-600/50 transition-colors border border-purple-500/10">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-300 w-8">{index + 1}</span>
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-white">{artist.name}</div>
                          <div className="text-sm text-gray-300">{artist.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-medium text-white">${artist.price}</div>
                          <div className={`text-sm flex items-center ${
                            artist.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {artist.change.startsWith('+') ? (
                              <ArrowUp className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDown className="w-4 h-4 mr-1" />
                            )}
                            {artist.change}%
                          </div>
                        </div>
                        <div className={`w-2 h-12 rounded-full ${
                          index === 0 ? 'bg-green-400' :
                          index === 1 ? 'bg-blue-400' :
                          index === 2 ? 'bg-purple-400' : 'bg-pink-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Events */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-purple-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Featured Events & Bets</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <div key={event.id}
                       className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-600/50 transition-colors border border-purple-500/10">
                    <div className="flex items-center space-x-2 mb-4">
                      {event.type === 'Concert' && <Music className="w-5 h-5 text-purple-400" />}
                      {event.type === 'Album Battle' && <Star className="w-5 h-5 text-yellow-400" />}
                      {event.type === 'Album Drop' && <Zap className="w-5 h-5 text-green-400" />}
                      <span className="text-sm text-gray-300">{event.type}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-300 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{event.date}</span>
                      <button className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors">
                        Bet ({event.odds})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCryptoDashboard;