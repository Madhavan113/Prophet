const Order = require('../models/Order');
const Price = require('../models/Price');

class OrderMatchingService {
  static async matchOrders(coinPair) {
    const buyOrders = await Order
      .find({ 
        coinPair,
        type: 'BUY',
        status: { $in: ['OPEN', 'PARTIAL'] }
      })
      .sort({ price: -1, createdAt: 1 });

    const sellOrders = await Order
      .find({ 
        coinPair,
        type: 'SELL',
        status: { $in: ['OPEN', 'PARTIAL'] }
      })
      .sort({ price: 1, createdAt: 1 });

    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.price >= sellOrder.price) {
          const matchAmount = Math.min(
            buyOrder.amount - buyOrder.filled,
            sellOrder.amount - sellOrder.filled
          );

          if (matchAmount > 0) {
            await this.updateMatchedOrders(buyOrder, sellOrder, matchAmount);
          }
        }
      }
    }
  }

  static async updateMatchedOrders(buyOrder, sellOrder, matchAmount) {
    buyOrder.filled += matchAmount;
    sellOrder.filled += matchAmount;

    buyOrder.status = buyOrder.filled === buyOrder.amount ? 'FILLED' : 'PARTIAL';
    sellOrder.status = sellOrder.filled === sellOrder.amount ? 'FILLED' : 'PARTIAL';

    await Promise.all([buyOrder.save(), sellOrder.save()]);
  }
}

module.exports = OrderMatchingService;
