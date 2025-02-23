import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import axios from 'axios';

class OrderMatchingService {
    static PRICE_UPDATE_URL = 'http://localhost:5000/api/coins/update-price';
    static ORDER_TIMEOUT = 60000; // 60 seconds in milliseconds

    static async cleanupOrders(session) {
        const timeoutThreshold = new Date(Date.now() - this.ORDER_TIMEOUT);
        
        try {
            // Delete orders that are either:
            // 1. Older than 60 seconds
            // 2. Have status FILLED
            const deleteResult = await Order.deleteMany({
                $or: [
                    { createdAt: { $lt: timeoutThreshold } },
                    { status: 'FILLED' }
                ]
            }).session(session);

            if (deleteResult.deletedCount > 0) {
                console.log(`Cleaned up ${deleteResult.deletedCount} orders (old or filled)`);
            }
        } catch (error) {
            console.error('Error during order cleanup:', error);
            throw error;
        }
    }

    static async calculateOrderBookPrice(buyOrders, sellOrders, targetVolume) {
        let totalVolume = 0;
        let volumeWeightedPrice = 0;
        
        for (let i = 0; i < sellOrders.length && totalVolume < targetVolume; i++) {
            const order = sellOrders[i];
            const volumeToConsider = Math.min(
                order.amount - (order.filled || 0),
                targetVolume - totalVolume
            );
            
            volumeWeightedPrice += order.price * volumeToConsider;
            totalVolume += volumeToConsider;
        }

        if (totalVolume === 0) return null;
        return volumeWeightedPrice / totalVolume;
    }

    static async updateCoinPrice(coinPair, price, volume) {
        try {
            await axios.post(this.PRICE_UPDATE_URL, {
                pair: coinPair,
                price: price,
                volume: volume,
                timestamp: Date.now()
            });
            console.log(`Updated price for ${coinPair}: ${price} (Volume: ${volume})`);
        } catch (error) {
            console.error(`Failed to update price for ${coinPair}:`, error.message);
        }
    }

    static async matchOrders() {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            console.log('Starting order matching process...');

            // Clean up old and filled orders first
            await this.cleanupOrders(session);

            // Get remaining valid orders
            const [buyOrders, sellOrders] = await Promise.all([
                Order.find({
                    type: 'BUY',
                    status: 'OPEN',
                    createdAt: { $gt: new Date(Date.now() - this.ORDER_TIMEOUT) }
                }).sort({ price: -1, createdAt: 1 }).session(session),

                Order.find({
                    type: 'SELL',
                    status: 'OPEN',
                    createdAt: { $gt: new Date(Date.now() - this.ORDER_TIMEOUT) }
                }).sort({ price: 1, createdAt: 1 }).session(session)
            ]);

            console.log(`Order book state: ${buyOrders.length} buys, ${sellOrders.length} sells`);

            const matchedOrderIds = new Set();
            const priceUpdates = new Map();

            // Process buy orders against the order book
            for (const buyOrder of buyOrders) {
                if (matchedOrderIds.has(buyOrder._id.toString())) continue;

                let remainingBuyAmount = buyOrder.amount - (buyOrder.filled || 0);
                if (remainingBuyAmount <= 0) continue;

                const orderBookPrice = await this.calculateOrderBookPrice(
                    buyOrders,
                    sellOrders,
                    remainingBuyAmount
                );

                if (!orderBookPrice) {
                    console.log(`No liquidity available for buy order ${buyOrder._id}`);
                    continue;
                }

                // Match against eligible sell orders
                for (const sellOrder of sellOrders) {
                    if (matchedOrderIds.has(sellOrder._id.toString())) continue;

                    if (buyOrder.price >= sellOrder.price) {
                        const remainingSellAmount = sellOrder.amount - (sellOrder.filled || 0);
                        const matchAmount = Math.min(remainingBuyAmount, remainingSellAmount);
                        const executionPrice = sellOrder.price;

                        // Update buy order
                        const newBuyFilled = (buyOrder.filled || 0) + matchAmount;
                        if (newBuyFilled === buyOrder.amount) {
                            await Order.findByIdAndDelete(buyOrder._id).session(session);
                            matchedOrderIds.add(buyOrder._id.toString());
                        } else {
                            await Order.findByIdAndUpdate(buyOrder._id, {
                                filled: newBuyFilled,
                                status: 'PARTIAL',
                                lastMatchPrice: executionPrice
                            }, { session });
                        }

                        // Update sell order
                        const newSellFilled = (sellOrder.filled || 0) + matchAmount;
                        if (newSellFilled === sellOrder.amount) {
                            await Order.findByIdAndDelete(sellOrder._id).session(session);
                            matchedOrderIds.add(sellOrder._id.toString());
                        } else {
                            await Order.findByIdAndUpdate(sellOrder._id, {
                                filled: newSellFilled,
                                status: 'PARTIAL',
                                lastMatchPrice: executionPrice
                            }, { session });
                        }

                        // Record the trade
                        await this.createTradeRecord({
                            buyOrderId: buyOrder._id,
                            sellOrderId: sellOrder._id,
                            amount: matchAmount,
                            price: executionPrice,
                            orderBookPrice: orderBookPrice,
                            timestamp: new Date(),
                            buyerId: buyOrder.userId,
                            sellerId: sellOrder.userId,
                            coinPair: buyOrder.coinPair
                        }, session);

                        // Accumulate price updates
                        const pairUpdates = priceUpdates.get(buyOrder.coinPair) || {
                            totalVolume: 0,
                            volumeWeightedPrice: 0
                        };
                        pairUpdates.totalVolume += matchAmount;
                        pairUpdates.volumeWeightedPrice += executionPrice * matchAmount;
                        priceUpdates.set(buyOrder.coinPair, pairUpdates);

                        console.log(`Matched ${matchAmount} units at ${executionPrice} (Order book price: ${orderBookPrice})`);

                        remainingBuyAmount -= matchAmount;
                        if (remainingBuyAmount <= 0) break;
                    }
                }
            }

            await session.commitTransaction();
            console.log('Order matching process completed successfully');

            // Send price updates after successful transaction
            for (const [coinPair, updates] of priceUpdates.entries()) {
                const avgPrice = updates.volumeWeightedPrice / updates.totalVolume;
                await this.updateCoinPrice(coinPair, avgPrice, updates.totalVolume);
            }

        } catch (error) {
            await session.abortTransaction();
            console.error('Error in order matching process:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async createTradeRecord(trade, session) {
        console.log('Trade executed:', trade);
        // Implement trade storage as needed
    }
}

export default OrderMatchingService;