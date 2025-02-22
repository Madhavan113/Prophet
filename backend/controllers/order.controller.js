const Order = require('../models/Order');
const OrderMatchingService = require('../services/OrderMatchingService');
const PriceUpdateService = require('../services/PriceUpdateService');
const { emitOrderbookUpdate } = require('../utils/websocket');

class OrderController {
  static async createOrder(req, res) {
    try {
      const { type, coinPair, price, amount } = req.body;
      const userId = req.user.id;

      const newOrder = new Order({
        type,
        coinPair,
        price,
        amount,
        userId
      });

      await newOrder.save();
      await OrderMatchingService.matchOrders(coinPair);
      await PriceUpdateService.updatePrice(coinPair);

      emitOrderbookUpdate(coinPair);

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderbook(req, res) {
    try {
      const { coinPair } = req.params;
      
      const buyOrders = await Order
        .find({ coinPair, type: 'BUY', status: { $in: ['OPEN', 'PARTIAL'] } })
        .sort({ price: -1 });

      const sellOrders = await Order
        .find({ coinPair, type: 'SELL', status: { $in: ['OPEN', 'PARTIAL'] } })
        .sort({ price: 1 });

      res.json({ buyOrders, sellOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
