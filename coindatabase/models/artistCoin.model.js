import mongoose from 'mongoose';

const artistCoinSchema = new mongoose.Schema({
  artistId: { type: String, required: true, unique: true },
  currentPrice: { type: Number, default: 0 },
  priceChange: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export const ArtistCoin = mongoose.model('ArtistCoin', artistCoinSchema);

const priceHistorySchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  price: { type: Number, required: true },
  priceChange: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);