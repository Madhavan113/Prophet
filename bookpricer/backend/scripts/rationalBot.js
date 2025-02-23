import fetch from 'node-fetch'; // Ensure node-fetch is installed (npm install node-fetch)

class TradingBot {
  constructor(apiBaseUrl, artistId) {
    this.apiBaseUrl = apiBaseUrl; // Base URL for the API
    this.artistId = artistId; // Coin pair to trade (e.g., 'BTC-USD')
  }

  // Fetch orders for a specific artistId (coin pair)
  async fetchOrdersForArtist() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/orders`, {
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
      return orders.filter(order => order.coinPair === this.artistId);
    } catch (error) {
      console.error(`Error fetching orders for artistId ${this.artistId}:`, error);
      return [];
    }
  }

  // Calculate the best bid and ask prices from the orderbook
  calculateBestBidAndAsk(orders) {
    const buyOrders = orders.filter(order => order.type === 'BUY');
    const sellOrders = orders.filter(order => order.type === 'SELL');

    const bestBid = buyOrders.length > 0
      ? Math.max(...buyOrders.map(order => order.price))
      : null;
    const bestAsk = sellOrders.length > 0
      ? Math.min(...sellOrders.map(order => order.price))
      : null;

    return { bestBid, bestAsk };
  }

  // Place a buy order
  async placeBuyOrder(price, amount) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'BUY',
          coinPair: this.artistId,
          price,
          amount,
          userId: 'trading-bot', // Identifier for the bot
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to place buy order: ${response.statusText}`);
      }

      console.log(`Buy order placed: ${amount} @ ${price}`);
    } catch (error) {
      console.error('Error placing buy order:', error);
    }
  }

  // Place a sell order
  async placeSellOrder(price, amount) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SELL',
          coinPair: this.artistId,
          price,
          amount,
          userId: 'trading-bot', // Identifier for the bot
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to place sell order: ${response.statusText}`);
      }

      console.log(`Sell order placed: ${amount} @ ${price}`);
    } catch (error) {
      console.error('Error placing sell order:', error);
    }
  }

  // Update the coin price in the database
  async updateCoinPrice(newPrice) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/update-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: { artistId: this.artistId, newPrice } }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update price: ${response.statusText}`);
      }

      console.log(`Price updated to: ${newPrice}`);
    } catch (error) {
      console.error('Error updating coin price:', error);
    }
  }

  // Main function to run the trading bot
  async run() {
    console.log(`Starting trading bot for artistId: ${this.artistId}`);

    // Fetch orders for the artistId
    const orders = await this.fetchOrdersForArtist();

    // Calculate the best bid and ask prices
    const { bestBid, bestAsk } = this.calculateBestBidAndAsk(orders);

    if (bestBid === null || bestAsk === null) {
      console.warn('No valid bid or ask prices found. Skipping trading cycle.');
      return;
    }

    // Simple market-making strategy:
    // Place a buy order slightly below the best bid and a sell order slightly above the best ask
    const buyPrice = bestBid - 1; // Place buy order $1 below the best bid
    const sellPrice = bestAsk + 1; // Place sell order $1 above the best ask
    const amount = 1; // Trade 1 unit (adjust as needed)

    // Place buy and sell orders
    await this.placeBuyOrder(buyPrice, amount);
    await this.placeSellOrder(sellPrice, amount);

    // Update the coin price based on the new market conditions
    const marketPrice = (bestBid + bestAsk) / 2; // Midpoint of the bid-ask spread
    await this.updateCoinPrice(marketPrice);

    console.log(`Trading bot cycle completed for artistId: ${this.artistId}`);
  }
}

// Configuration
const API_BASE_URL = 'http://localhost:5001'; // Replace with your API base URL
const ARTIST_ID = '2'; // Replace with the artistId (coin pair) you want to trade

// Initialize and run the trading bot
const tradingBot = new TradingBot(API_BASE_URL, ARTIST_ID);

// Run the bot on an interval (e.g., every 5 seconds)
const TRADING_INTERVAL = 5000; // 5 seconds
setInterval(async () => {
  try {
    await tradingBot.run();
  } catch (error) {
    console.error('Error in trading bot cycle:', error);
  }
}, TRADING_INTERVAL);

console.log(`Trading bot started for artistId: ${ARTIST_ID}. Running every ${TRADING_INTERVAL / 1000} seconds...`);