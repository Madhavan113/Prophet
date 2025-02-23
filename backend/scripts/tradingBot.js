// scripts/tradingBot.js
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api/orderbook';
const BOT_USER_ID = '67ba4f2338434f902d054c58'; // Replace with your bot's user ID

class TradingBot {
    constructor() {
        this.lastAction = null;
        this.orderCount = 0;
        this.maxOrdersPerSession = 10;
    }

    async analyzeOrderBook() {
        try {
            const response = await axios.get(API_URL);
            const orders = response.data;

            // Get buy and sell orders
            const buyOrders = orders.filter(order => order.type === 'BUY');
            const sellOrders = orders.filter(order => order.type === 'SELL');

            // Calculate average prices
            const avgBuyPrice = this.calculateAverage(buyOrders.map(o => o.price));
            const avgSellPrice = this.calculateAverage(sellOrders.map(o => o.price));
            const spreadSize = avgSellPrice - avgBuyPrice;

            return {
                buyOrders,
                sellOrders,
                avgBuyPrice,
                avgSellPrice,
                spreadSize,
                orderBookDepth: orders.length
            };
        } catch (error) {
            console.error('Error analyzing orderbook:', error);
            return null;
        }
    }

    calculateAverage(prices) {
        if (prices.length === 0) return 0;
        return prices.reduce((a, b) => a + b, 0) / prices.length;
    }

    async makeTradeDecision(analysis) {
        if (!analysis) return null;

        // Random factors for unpredictability
        const randomFactor = Math.random();
        const volatilityPreference = Math.random();
        const aggressiveness = Math.random();

        // Base price calculations
        const midPrice = (analysis.avgBuyPrice + analysis.avgSellPrice) / 2;
        const priceVariation = analysis.spreadSize * 0.1; // 10% of spread

        // Decision making with random elements
        let decision = {
            type: null,
            price: midPrice,
            amount: 0
        };

        // More orders on one side might indicate trend
        const buyPressure = analysis.buyOrders.length / (analysis.orderBookDepth || 1);
        
        // Random strategy selection
        if (randomFactor < 0.3) {
            // Counter-trend strategy
            decision.type = buyPressure > 0.5 ? 'SELL' : 'BUY';
        } else if (randomFactor < 0.6) {
            // Trend-following strategy
            decision.type = buyPressure > 0.5 ? 'BUY' : 'SELL';
        } else {
            // Random strategy
            decision.type = Math.random() > 0.5 ? 'BUY' : 'SELL';
        }

        // Randomly adjust price based on aggressiveness
        if (decision.type === 'BUY') {
            decision.price = midPrice - (priceVariation * aggressiveness);
        } else {
            decision.price = midPrice + (priceVariation * aggressiveness);
        }

        // Random amount between 0.1 and 1.0
        decision.amount = 0.1 + (Math.random() * 0.9);

        // Don't place same type of order twice in a row
        if (this.lastAction === decision.type) {
            decision.type = decision.type === 'BUY' ? 'SELL' : 'BUY';
        }

        this.lastAction = decision.type;
        return decision;
    }

    async placeTrade(decision) {
        if (!decision) return;

        try {
            const order = {
                type: decision.type,
                coinPair: 'BTC-USD',
                price: parseFloat(decision.price.toFixed(2)),
                amount: parseFloat(decision.amount.toFixed(4)),
                userId: BOT_USER_ID
            };

            const response = await axios.post(`${API_URL}/order`, order);
            console.log(`Placed ${decision.type} order:`, order);
            this.orderCount++;
            return response.data;
        } catch (error) {
            console.error('Error placing trade:', error);
            return null;
        }
    }

    shouldContinueTrading() {
        return this.orderCount < this.maxOrdersPerSession;
    }
}

// Run the bot
const runBot = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB successfully');

        const bot = new TradingBot();
        
        // Trading loop
        const tradingInterval = setInterval(async () => {
            if (!bot.shouldContinueTrading()) {
                console.log('Reached maximum orders for session, stopping bot');
                clearInterval(tradingInterval);
                return;
            }

            console.log('\n=== Starting Trading Cycle ===');
            
            // Analyze market
            const analysis = await bot.analyzeOrderBook();
            if (analysis) {
                console.log('Market Analysis:', {
                    avgBuyPrice: analysis.avgBuyPrice.toFixed(2),
                    avgSellPrice: analysis.avgSellPrice.toFixed(2),
                    spread: analysis.spreadSize.toFixed(2),
                    depth: analysis.orderBookDepth
                });

                // Make and execute trading decision
                const decision = await bot.makeTradeDecision(analysis);
                if (decision) {
                    console.log('Trade Decision:', decision);
                    await bot.placeTrade(decision);
                }
            }

            console.log(`Orders placed this session: ${bot.orderCount}`);
        }, 10000); // Run every 10 seconds

    } catch (error) {
        console.error('Bot error:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

console.log('Starting trading bot...');
runBot();