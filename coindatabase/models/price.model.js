import mongoose from 'mongoose';

const artistCoinSchema = new mongoose.Schema({
  artistId: { type: String, required: true, unique: true },
  currentPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  priceChange: { type: mongoose.Schema.Types.Decimal128, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const priceHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  coinId: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  priceChange: { type: mongoose.Schema.Types.Decimal128, required: true },
});

// Create models
const ArtistCoin = mongoose.model('ArtistCoin', artistCoinSchema);
const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

export { ArtistCoin, PriceHistory };