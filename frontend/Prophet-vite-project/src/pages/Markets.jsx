import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Markets = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const [artistCoins] = useState([
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

  // Separate refs for each scroll container
  const scrollRef1 = useRef();
  const scrollRef2 = useRef();

  const handleCardClick = (symbol) => {
    navigate(`/coin-graph/${symbol}`); // Navigate to the coin's graph page using symbol
  };

  // Function to scroll left automatically
  useEffect(() => {
    const intervalId1 = setInterval(() => {
      if (scrollRef1.current) {
        const card = scrollRef1.current.querySelector('.flex-shrink-0');
        if (card) {
          const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
          const scrollWidth = scrollRef1.current.scrollWidth;
          const scrollLeft = scrollRef1.current.scrollLeft;
          const clientWidth = scrollRef1.current.clientWidth;

          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef1.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef1.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      }
    }, 8000);

    const intervalId2 = setInterval(() => {
      if (scrollRef2.current) {
        const card = scrollRef2.current.querySelector('.flex-shrink-0');
        if (card) {
          const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
          const scrollWidth = scrollRef2.current.scrollWidth;
          const scrollLeft = scrollRef2.current.scrollLeft;
          const clientWidth = scrollRef2.current.clientWidth;

          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef2.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef2.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);

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
              <h1 className="text-3xl font-bold text-white">
                Buy Artist Coins
              </h1>
            </div>

            {/* Categories */}
            <div className="space-y-12">
              {/* Trending Artists */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Trending Artists</h2>
                <div
                  className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                  ref={scrollRef1}
                >
                  {artistCoins.slice(0, 10).map((artist) => (
                    <Card key={artist.id} artist={artist} onClick={handleCardClick} />
                  ))}
                </div>
              </div>

              {/* Top Artists */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Top Artists</h2>
                <div
                  className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                  ref={scrollRef2}
                >
                  {artistCoins.slice(2, 12).map((artist) => (
                    <Card key={artist.id} artist={artist} onClick={handleCardClick} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Card Component defined within the same file
  function Card({ artist, onClick }) {
    return (
      <div
        onClick={() => onClick(artist.symbol)} // Redirect using the artist's symbol
        className="flex-shrink-0 w-40 p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
      >
        <img src={artist.image} alt={artist.name} className="w-full h-32 object-cover rounded-md" />
        <div className="mt-4 text-center text-white">
          <p className="text-lg font-semibold">{artist.name}</p>
          <p className="text-sm text-gray-400">{artist.symbol}</p>
          <p className="text-sm font-semibold text-green-400">{artist.price}</p>
          <p className="text-sm text-gray-400">{artist.change}%</p>
        </div>
      </div>
    );
  }
};

export default Markets;
