import express from 'express';
import PriceController from '../controllers/price.controller.js';

const router = express.Router();
const priceController = new PriceController();
await priceController.connect();

// Update price based on order book
router.post('/update-price', async (req, res) => {
  try {
    const { order } = req.body;
    await priceController.handleOrderUpdate(order);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current price
router.get('/:artistId/price', async (req, res) => {
  try {
    const { artistId } = req.params;
    const artistCoin = await priceController.db
      .collection('artists_coins')
      .findOne({ artistId }, { projection: { currentPrice: 1, priceChange: 1 } });
    res.json({ price: artistCoin.currentPrice, priceChange: artistCoin.priceChange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;