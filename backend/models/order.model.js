const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  coinPair: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  filled: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['OPEN', 'PARTIAL', 'FILLED', 'CANCELLED'],
    default: 'OPEN'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);