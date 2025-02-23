import express from 'express';
import PriceController from '../controllers/price.controller.js';
import { ArtistCoin } from '../models/artistCoin.model.js';

const router = express.Router();
const priceController = new PriceController();

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
    const coin = await ArtistCoin.findOne({ artistId }, 'currentPrice priceChange');
    if (!coin) {
      return res.status(404).json({ error: 'Artist coin not found' });
    }
    res.json({ price: coin.currentPrice, priceChange: coin.priceChange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;