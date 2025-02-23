import { ArtistCoin, PriceHistory } from '../models/artistCoin.model.js';

class PriceController {
  constructor() {
    this.orderBook = new Map();
  }

  calculateMarketPrice(artistId) {
    const orders = Array.from(this.orderBook.get(artistId)) || [];
    const buyOrders = orders.filter((o) => o.type === 'BID').sort((a, b) => b.price - a.price);
    const sellOrders = orders.filter((o) => o.type === 'ASK').sort((a, b) => a.price - b.price);

    if (buyOrders.length === 0 || sellOrders.length === 0) return null;

    const bestBid = buyOrders[0].price;
    const bestAsk = sellOrders[0].price;
    return (bestBid + bestAsk) / 2;
  }

  async updateCoinPrice(artistId) {
    const newPrice = this.calculateMarketPrice(artistId);
    if (!newPrice) return;

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
  }

  async handleOrderUpdate(order) {
    if (!this.orderBook.has(order.artistId)) {
      this.orderBook.set(order.artistId, new Set());
    }
    const artistOrders = this.orderBook.get(order.artistId);

    if (order.status === 'CANCELLED') {
      artistOrders.delete(order);
    } else {
      artistOrders.add(order);
    }

    await this.updateCoinPrice(order.artistId);
  }
}

export default PriceController;