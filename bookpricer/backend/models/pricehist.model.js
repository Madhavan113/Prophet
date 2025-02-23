// models/priceHistory.model.js
import mongoose from 'mongoose';

const PriceHistorySchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  priceChange: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);
export default PriceHistory;
