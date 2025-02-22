const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  coinPair: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Price', PriceSchema);