const Order = require('../models/Order');
const Price = require('../models/Price');

class PriceUpdateService {
  static async updatePrice(coinPair) {
    const latestFilled = await Order
      .find({ 
        coinPair,
        status: 'FILLED'
      })
      .sort({ createdAt: -1 })
      .limit(1);

    if (latestFilled.length > 0) {
      await Price.findOneAndUpdate(
        { coinPair },
        { 
          price: latestFilled[0].price,
          lastUpdated: Date.now()
        },
        { upsert: true }
      );
    }
  }
}

module.exports = PriceUpdateService;
