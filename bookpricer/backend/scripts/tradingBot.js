import fetch from 'node-fetch'; // Ensure node-fetch is installed (npm install node-fetch)

class TradingBot {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl; // Base URL for the API
  }

  // Fetch orders for a specific artistId (coin pair)
  async fetchOrdersForArtist(artistId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/orderbook`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const orders = await response.json();

      // Filter orders for the given artistId (coinPair)
      const filteredOrders = orders.filter(order => order.coinPair === artistId);

      // Separate buy and sell orders
      const buyOrders = filteredOrders.filter(order => order.type === 'BUY');
      const sellOrders = filteredOrders.filter(order => order.type === 'SELL');

      // Find the highest bid price and lowest ask price
      const highestBid = buyOrders.length > 0
        ? Math.max(...buyOrders.map(order => order.price))
        : null;
      const lowestAsk = sellOrders.length > 0
        ? Math.min(...sellOrders.map(order => order.price))
        : null;

      // If no valid bid or ask prices are found, return an empty array
      if (highestBid === null || lowestAsk === null) {
        console.warn(`No valid bid or ask prices found for artistId: ${artistId}`);
        return [];
      }

      // Return the bid-ask spread as an array of objects
      return [{ bidPrice: highestBid, askPrice: lowestAsk }];
    } catch (error) {
      console.error(`Error fetching orders for artistId ${artistId}:`, error);
      return [];
    }
  }

  // Calculate the market price using the median of the bid-ask spread
  calculateMarketPrice(spreads) {
    if (spreads.length === 0) {
      console.warn('No spreads found to calculate market price');
      return null;
    }

    // Calculate the midpoint of each spread
    const midpoints = spreads.map(({ bidPrice, askPrice }) => (bidPrice + askPrice) / 2);

    // Sort midpoints to find the median
    midpoints.sort((a, b) => a - b);

    // Calculate the median
    const mid = Math.floor(midpoints.length / 2);
    let medianSpread;
    if (midpoints.length % 2 === 0) {
      // If even, average the two middle values
      medianSpread = (midpoints[mid - 1] + midpoints[mid]) / 2;
    } else {
      // If odd, take the middle value
      medianSpread = midpoints[mid];
    }

    console.log(`Calculated median spread: ${medianSpread}`);
    return medianSpread;
  }

  // Send a POST request to update the coin price
  async updateCoinPrice(artistId, newPrice) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/update-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: { artistId, newPrice } }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update price: ${response.statusText}`);
      }

      console.log(`Price update request sent successfully for artistId: ${artistId}`);
    } catch (error) {
      console.error('Error sending price update request:', error);
    }
  }

  // Main function to run the trading bot
  async run(artistId) {
    console.log(`Starting trading bot for artistId: ${artistId}`);

    // Fetch orders for the artistId
    const spreads = await this.fetchOrdersForArtist(artistId);

    // Calculate the market price
    const marketPrice = this.calculateMarketPrice(spreads);

    if (marketPrice !== null) {
      // Update the coin price in the database
      await this.updateCoinPrice(artistId, marketPrice);
    } else {
      console.warn('No market price calculated. Skipping price update.');
    }

    console.log(`Trading bot cycle completed for artistId: ${artistId}`);
  }
}

// Configuration
const API_BASE_URL = 'http://localhost:5000'; // Replace with your API base URL
const ARTIST_ID = 'BTC-USD'; // Replace with the artistId (coin pair) you want to trade

// Initialize and run the trading bot
const tradingBot = new TradingBot(API_BASE_URL);

// Run the bot on an interval (e.g., every 5 seconds)
const TRADING_INTERVAL = 5000; // 5 seconds
setInterval(async () => {
  try {
    await tradingBot.run(ARTIST_ID);
  } catch (error) {
    console.error('Error in trading bot cycle:', error);
  }
}, TRADING_INTERVAL);

console.log(`Trading bot started for artistId: ${ARTIST_ID}. Running every ${TRADING_INTERVAL / 1000} seconds...`);