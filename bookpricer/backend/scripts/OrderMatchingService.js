import mongoose from 'mongoose';
import fetch from 'node-fetch'; // Ensure node-fetch is installed (npm install node-fetch)
import Order from '../models/order.model.js'; // Import the Order model
import ArtistCoin from '../models/artist.model.js';
import PriceHistory from '../models/pricehist.model.js';

class OrderMatchingService {
  static async matchOrders() {
    try {
      // Fetch all orders from the orderbook
      const orders = await this.fetchOrdersFromOrderBook();

      // Process orders and match them
      const matchedOrders = await this.processOrders(orders);

      // Update the holdings of each user based on matched orders
      await this.updateUserHoldings(matchedOrders);

      // Update the prices of the coins based on the matched orders
      await this.updateCoinPrices(matchedOrders);

      console.log('Orders matched and prices updated successfully');
    } catch (error) {
      console.error('Error in matching orders:', error);
      throw error;
    }
  }

  // Fetch all orders from the orderbook
  static async fetchOrdersFromOrderBook() {
    try {
      const response = await fetch('http://localhost:5000/api/orderbook', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Process and match orders
  static async processOrders(orders) {
    const matchedOrders = [];

    // Separate buy and sell orders
    const buyOrders = orders.filter(order => order.type === 'BUY');
    const sellOrders = orders.filter(order => order.type === 'SELL');

    // Sort buy orders in descending order of price (highest bid first)
    buyOrders.sort((a, b) => b.price - a.price);

    // Sort sell orders in ascending order of price (lowest ask first)
    sellOrders.sort((a, b) => a.price - b.price);

    // Match buy and sell orders
    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.price >= sellOrder.price && buyOrder.amount > 0 && sellOrder.amount > 0) {
          // Determine the matched amount
          const matchedAmount = Math.min(buyOrder.amount, sellOrder.amount);

          // Add the matched orders to the result
          matchedOrders.push({
            buyOrderId: buyOrder._id,
            sellOrderId: sellOrder._id,
            artistId: buyOrder.coinPair, // Assuming coinPair is the artistId
            price: sellOrder.price, // Use the sell order price as the matched price
            amount: matchedAmount,
          });

          // Update the remaining amounts in the orders
          buyOrder.amount -= matchedAmount;
          sellOrder.amount -= matchedAmount;

          // Remove fully matched orders from the database
          // if (buyOrder.amount === 0) {
          //   await Order.findByIdAndDelete(buyOrder._id);
          // }
          // if (sellOrder.amount === 0) {
          //   await Order.findByIdAndDelete(sellOrder._id);
          // }
        }
      }
    }

    return matchedOrders;
  }

  // Update the holdings of each user based on matched orders
  static async updateUserHoldings(matchedOrders) {
    for (const matchedOrder of matchedOrders) {
      const { buyOrderId, sellOrderId, artistId, price, amount } = matchedOrder;

      // Fetch the buy and sell orders from the database
      const buyOrder = await Order.findById(buyOrderId);
      const sellOrder = await Order.findById(sellOrderId);
      Order.findByIdAndDelete(buyOrder._id);
      Order.findByIdAndDelete(sellOrder._id);
      // Update user holdings (placeholder logic)
      console.log(`Updating holdings for users: Buyer ${buyOrder.userId}, Seller ${sellOrder.userId}`);
      // Add your logic here to update user holdings in the database
      // After you do your update logic, delete if needed
      if (buyOrder && buyOrder.amount === 0) {
        await Order.findByIdAndDelete(buyOrderId);
      }
      if (sellOrder && sellOrder.amount === 0) {
        await Order.findByIdAndDelete(sellOrderId);
      }
    }
  }

  // Update the prices of the coins based on the matched orders
  static async updateCoinPrices(matchedOrders) {
    for (const matchedOrder of matchedOrders) {
      const { artistId, price } = matchedOrder;
      await this.updateCoinPrice(artistId, price);
    }
  }

  // Update the price of a specific coin
  static async updateCoinPrice(artistId, newPrice) {
    try {
      const artistCoin = await ArtistCoin.findOne({ artistId });
      if (!artistCoin) throw new Error('Artist coin not found');

      const priceChange = ((newPrice - artistCoin.currentPrice) / artistCoin.currentPrice) * 100;

      artistCoin.currentPrice = newPrice;
      artistCoin.priceChange = priceChange;
      artistCoin.lastUpdated = new Date();
      await artistCoin.save();

      await PriceHistory.create({
        coinId: artistId,
        price: newPrice,
        priceChange: priceChange,
      });

      // Send a POST request to update the price in the coin price database
      await this.sendPriceUpdateRequest(artistId, newPrice);
    } catch (error) {
      console.error(`Error updating coin price for artistId ${artistId}:`, error);
    }
  }

  // Send a POST request to update the price in the coin price database
  static async sendPriceUpdateRequest(artistId, newPrice) {
    try {
      const response = await fetch('http://localhost:3000/update-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: { artistId, newPrice } }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      console.log(`Price update request sent successfully for artistId: ${artistId}`);
    } catch (error) {
      console.error('Error sending price update request:', error);
    }
  }
}

export default OrderMatchingService;