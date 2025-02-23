// models/order.model.js
import mongoose from 'mongoose';

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
    userId: {
        type: String,  // Changed from ObjectId to String
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'PARTIAL', 'FILLED', 'CANCELLED'],
        default: 'OPEN'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', OrderSchema);