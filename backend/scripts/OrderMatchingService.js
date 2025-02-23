// services/OrderMatchingService.js
import mongoose from 'mongoose';
import Order from '../models/order.model.js';

class OrderMatchingService {
    static async matchOrders() {
        try {
            console.log('Starting order matching process...');

            // Get all open buy orders, sorted by highest price first
            const buyOrders = await Order.find({
                type: 'BUY',
                status: 'OPEN'
            }).sort({ price: -1 });

            // Get all open sell orders, sorted by lowest price first
            const sellOrders = await Order.find({
                type: 'SELL',
                status: 'OPEN'
            }).sort({ price: 1 });

            console.log(`Found ${buyOrders.length} buy orders and ${sellOrders.length} sell orders`);

            // Match orders
            for (const buyOrder of buyOrders) {
                for (const sellOrder of sellOrders) {
                    // Skip if orders are already filled
                    if (buyOrder.status === 'FILLED' || sellOrder.status === 'FILLED') {
                        continue;
                    }

                    // Check if prices match (buy price >= sell price)
                    if (buyOrder.price >= sellOrder.price) {
                        console.log(`Matching buy order ${buyOrder._id} with sell order ${sellOrder._id}`);

                        // Calculate match amount
                        const remainingBuyAmount = buyOrder.amount - (buyOrder.filled || 0);
                        const remainingSellAmount = sellOrder.amount - (sellOrder.filled || 0);
                        const matchAmount = Math.min(remainingBuyAmount, remainingSellAmount);

                        // Update buy order
                        const newBuyFilled = (buyOrder.filled || 0) + matchAmount;
                        const buyStatus = newBuyFilled === buyOrder.amount ? 'FILLED' : 'PARTIAL';

                        await Order.findByIdAndUpdate(buyOrder._id, {
                            filled: newBuyFilled,
                            status: buyStatus
                        });

                        // Update sell order
                        const newSellFilled = (sellOrder.filled || 0) + matchAmount;
                        const sellStatus = newSellFilled === sellOrder.amount ? 'FILLED' : 'PARTIAL';

                        await Order.findByIdAndUpdate(sellOrder._id, {
                            filled: newSellFilled,
                            status: sellStatus
                        });

                        console.log(`Matched ${matchAmount} units at price ${sellOrder.price}`);

                        // Create trade record (optional)
                        await this.createTradeRecord(buyOrder, sellOrder, matchAmount, sellOrder.price);

                        // If buy order is filled, move to next buy order
                        if (buyStatus === 'FILLED') {
                            break;
                        }
                    }
                }
            }

            console.log('Order matching process completed');
        } catch (error) {
            console.error('Error in order matching process:', error);
        }
    }

    static async createTradeRecord(buyOrder, sellOrder, amount, price) {
        // You could create a Trade model to store trade history
        const trade = {
            buyOrderId: buyOrder._id,
            sellOrderId: sellOrder._id,
            amount: amount,
            price: price,
            timestamp: new Date(),
            buyerId: buyOrder.userId,
            sellerId: sellOrder.userId
        };

        console.log('Trade executed:', trade);
        // Implement trade record storage if needed
    }
}

// Example usage:
/*
// Run matching process every minute
setInterval(() => {
    OrderMatchingService.matchOrders();
}, 60000);

// Or trigger manually
await OrderMatchingService.matchOrders();
*/

export default OrderMatchingService;