// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSpotifyArtistImage } from "./spotify.js";

const Markets = () => {
  const navigate = useNavigate();

  const [artistCoins, setArtistCoins] = useState([
    { id: 1, name: "Taylor Swift", symbol: "SWIFT", price: "43,567.89", change: "+5.2" },
    { id: 2, name: "Drake", symbol: "DRAKE", price: "2,890.45", change: "+3.8" },
    { id: 3, name: "The Weeknd", symbol: "WEEKND", price: "189.67", change: "+12.4" },
    { id: 4, name: "Beyoncé", symbol: "BEY", price: "1.23", change: "-2.1" },
    { id: 5, name: "Ed Sheeran", symbol: "SHEER", price: "21.45", change: "+7.8" },
    { id: 6, name: "BTS", symbol: "BTS", price: "34.56", change: "+9.3" },
    { id: 7, name: "Olivia Rodrigo", symbol: "RODRIGO", price: "12.34", change: "+25.6" },
    { id: 8, name: "Doja Cat", symbol: "DOJA", price: "45.67", change: "+18.9" },
    { id: 9, name: "Bad Bunny", symbol: "BUNNY", price: "78.90", change: "+15.3" },
    { id: 10, name: "Billie Eilish", symbol: "EILISH", price: "56.78", change: "+22.1" },
    { id: 11, name: "Travis Scott", symbol: "TRAVIS", price: "34.56", change: "+30.4" },
    { id: 12, name: "Ariana Grande", symbol: "GRANDE", price: "67.89", change: "+20.7" },
  ]);

  // Fetch artist images from Spotify when the component loads
  useEffect(() => {
    const updateArtistImages = async () => {
      const updatedArtists = await Promise.all(
        artistCoins.map(async (artist) => {
          const imageUrl = await fetchSpotifyArtistImage(artist.name);
          return { ...artist, image: imageUrl };
        })
      );
      setArtistCoins(updatedArtists);
    };

    updateArtistImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll backend to update dynamic coin prices
  useEffect(() => {
    const fetchPrices = async () => {
      const updatedArtists = await Promise.all(
        artistCoins.map(async (artist) => {
          try {
            // Update the URL and port if needed based on your backend configuration
            const res = await fetch(`http://localhost:5005/api/prices/${artist.id}/price`);
            if (!res.ok) throw new Error("Network error");
            const data = await res.json();
            return { ...artist, price: data.price, change: data.priceChange };
          } catch (error) {
            console.error(`Error fetching price for ${artist.name}:`, error);
            return artist;
          }
        })
      );
      setArtistCoins(updatedArtists);
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [artistCoins]);

  // Refs for scrolling containers
  const scrollRef1 = useRef();
  const scrollRef2 = useRef();

  const handleCardClick = (symbol) => {
    navigate(`/coin-graph/${symbol}`);
  };

  // Automatic horizontal scroll for two containers
  useEffect(() => {
    const intervalId1 = setInterval(() => {
      if (scrollRef1.current) {
        const card = scrollRef1.current.querySelector(".flex-shrink-0");
        if (card) {
          const cardWidth =
            card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
          const scrollWidth = scrollRef1.current.scrollWidth;
          const scrollLeft = scrollRef1.current.scrollLeft;
          const clientWidth = scrollRef1.current.clientWidth;

          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef1.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef1.current.scrollBy({ left: cardWidth, behavior: "smooth" });
          }
        }
      }
    }, 8000);

    const intervalId2 = setInterval(() => {
      if (scrollRef2.current) {
        const card = scrollRef2.current.querySelector(".flex-shrink-0");
        if (card) {
          const cardWidth =
            card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
          const scrollWidth = scrollRef2.current.scrollWidth;
          const scrollLeft = scrollRef2.current.scrollLeft;
          const clientWidth = scrollRef2.current.clientWidth;

          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef2.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef2.current.scrollBy({ left: cardWidth, behavior: "smooth" });
          }
        }
      }
    }, 4000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);

  // ----- Chat Functionality -----
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Bot", text: "Welcome to the market chat!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Predefined bot messages (including one like "Taylor Swift is trash")
  const botMessages = [
    "Taylor Swift is trash",
    "Drake is overrated",
    "The Weeknd is fire!",
    "Beyoncé always slays",
    "Ed Sheeran's vibe is chill",
    "BTS are too mainstream",
    "Olivia Rodrigo is the future",
    "Doja Cat is wild!",
    "Bad Bunny is unbeatable",
    "Billie Eilish brings a unique style",
  ];

  // Function to scroll chat to bottom
  const scrollChatToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Send user message
  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      const newMessage = {
        id: crypto.randomUUID(),
        user: "You",
        text: chatInput,
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatInput("");
    }
  };

  // Auto bot: add a bot message every 10 seconds
  useEffect(() => {
    const botInterval = setInterval(() => {
      const randomMsg = botMessages[Math.floor(Math.random() * botMessages.length)];
      const newBotMessage = {
        id: crypto.randomUUID(),
        user: "Bot",
        text: randomMsg,
      };
      setChatMessages((prev) => [...prev, newBotMessage]);
    }, 10000);

    return () => clearInterval(botInterval);
  }, []);

  // Scroll to bottom when new chat messages appear
  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);
  // ----- End of Chat Functionality -----

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-black">
      <div className="relative min-h-screen w-full">
        <nav className="bg-black border-b border-black">
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

        <div className="overflow-y-auto" style={{ height: "calc(100vh - 4rem)" }}>
          <div className="mx-auto p-8 max-w-7xl">
            <div className="space-y-12">
              {/* Top Artists */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Top Artists</h2>
                <div
                  className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                  ref={scrollRef1}
                >
                  {artistCoins.slice(0, 10).map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleCardClick(artist.symbol)}
                      className="flex-shrink-0 w-40 p-4 bg-black rounded-lg shadow-md cursor-pointer hover:bg-gray-900"
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="mt-4 text-center text-white">
                        <p className="text-lg font-semibold">{artist.name}</p>
                        <p className="text-sm text-gray-400">{artist.symbol}</p>
                        <p className="text-sm font-semibold text-green-400">{artist.price}</p>
                        <p className="text-sm text-gray-400">{artist.change}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Artists */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Trending Artists</h2>
                <div
                  className="flex overflow-x-auto space-x-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                  ref={scrollRef2}
                >
                  {artistCoins.slice(2, 12).map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleCardClick(artist.symbol)}
                      className="flex-shrink-0 w-40 p-4 bg-black rounded-lg shadow-md cursor-pointer hover:bg-gray-900"
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="mt-4 text-center text-white">
                        <p className="text-lg font-semibold">{artist.name}</p>
                        <p className="text-sm text-gray-400">{artist.symbol}</p>
                        <p className="text-sm font-semibold text-green-400">{artist.price}</p>
                        <p className="text-sm text-gray-400">{artist.change}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              <div className="bg-black rounded-lg p-4 border border-black mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Market Chat</h2>
                <div className="h-64 overflow-y-auto bg-black p-2 rounded-md mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                      <span className="font-bold text-white">{msg.user}: </span>
                      <span className="text-gray-300">{msg.text}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-black text-white outline-none border border-gray-700"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    className="p-2 bg-purple-600 rounded-md text-white"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
              {/* End Chat Section */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
