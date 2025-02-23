// scripts/multiTradingBot.js
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api/orderbook';

class TradingBot {
    constructor(name, personality) {
        this.name = name;
        this.personality = personality;
        this.lastAction = null;
        this.totalTrades = 0;
        
        // Personality traits (0-1 scale)
        this.aggressiveness = personality.aggressiveness;
        this.riskTolerance = personality.riskTolerance;
        this.trendFollowing = personality.trendFollowing;
        this.orderSizePreference = personality.orderSizePreference;
    }

    async analyzeOrderBook() {
        try {
            const response = await axios.get(API_URL);
            const orders = response.data;

            const buyOrders = orders.filter(order => order.type === 'BUY');
            const sellOrders = orders.filter(order => order.type === 'SELL');

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
            console.error(`[${this.name}] Error analyzing orderbook:`, error);
            return null;
        }
    }

    calculateAverage(prices) {
        if (prices.length === 0) return 0;
        return prices.reduce((a, b) => a + b, 0) / prices.length;
    }

    async makeTradeDecision(analysis) {
        if (!analysis) return null;

        // Personality-influenced randomness
        const randomFactor = Math.random() * this.riskTolerance;
        const volatilityPreference = Math.random() * this.aggressiveness;
        
        const midPrice = (analysis.avgBuyPrice + analysis.avgSellPrice) / 2;
        const priceVariation = analysis.spreadSize * this.aggressiveness;

        let decision = {
            type: null,
            price: midPrice,
            amount: 0
        };

        const buyPressure = analysis.buyOrders.length / (analysis.orderBookDepth || 1);
        
        // Personality-based strategy selection
        if (Math.random() < this.trendFollowing) {
            // Trend-following
            decision.type = buyPressure > 0.5 ? 'BUY' : 'SELL';
        } else {
            // Counter-trend
            decision.type = buyPressure > 0.5 ? 'SELL' : 'BUY';
        }

        // Add some randomness to prevent all bots doing the same thing
        if (Math.random() > 0.7) {
            decision.type = decision.type === 'BUY' ? 'SELL' : 'BUY';
        }

        // Price calculation based on personality
        if (decision.type === 'BUY') {
            decision.price = midPrice - (priceVariation * randomFactor);
        } else {
            decision.price = midPrice + (priceVariation * randomFactor);
        }

        // Amount based on personality
        const baseAmount = 0.1 + (Math.random() * 0.9);
        decision.amount = baseAmount * this.orderSizePreference;

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
                userId: this.personality.userId
            };

            const response = await axios.post(`${API_URL}/order`, order);
            this.totalTrades++;
            console.log(`[${this.name}] Placed ${decision.type} order #${this.totalTrades}:`, order);
            return response.data;
        } catch (error) {
            console.error(`[${this.name}] Error placing trade:`, error);
            return null;
        }
    }
}

// Bot personality templates
const botPersonalities = [
    {
        name: "Aggressive Trader",
        personality: {
            userId: "67ba4f2338434f902d054c58",
            aggressiveness: 0.8,
            riskTolerance: 0.7,
            trendFollowing: 0.3,
            orderSizePreference: 0.9
        }
    },
    {
        name: "Conservative Trader",
        personality: {
            userId: "67ba4f2338434f902d054c59",
            aggressiveness: 0.3,
            riskTolerance: 0.4,
            trendFollowing: 0.7,
            orderSizePreference: 0.4
        }
    },
    {
        name: "Random Trader",
        personality: {
            userId: "67ba4f2338434f902d054c5a",
            aggressiveness: 0.5,
            riskTolerance: 0.5,
            trendFollowing: 0.5,
            orderSizePreference: 0.5
        }
    }
];

// Function to add random variation to personality traits
const createRandomizedPersonality = (basePersonality) => {
    const randomize = (value) => {
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        return Math.max(0.1, Math.min(0.9, value + variation));
    };

    return {
        ...basePersonality,
        personality: {
            ...basePersonality.personality,
            aggressiveness: randomize(basePersonality.personality.aggressiveness),
            riskTolerance: randomize(basePersonality.personality.riskTolerance),
            trendFollowing: randomize(basePersonality.personality.trendFollowing),
            orderSizePreference: randomize(basePersonality.personality.orderSizePreference)
        }
    };
};

// Run multiple bots
const runMultiBotSystem = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB successfully');

        // Create bots with randomized personalities
        const bots = botPersonalities.map(base => {
            const randomized = createRandomizedPersonality(base);
            return new TradingBot(randomized.name, randomized.personality);
        });

        // Trading loop for each bot
        bots.forEach((bot, index) => {
            // Different interval for each bot to prevent simultaneous trades
            const interval = 5000 + (index * 1000); // Stagger bot actions
            
            setInterval(async () => {
                console.log(`\n=== ${bot.name} Trading Cycle ===`);
                
                const analysis = await bot.analyzeOrderBook();
                if (analysis) {
                    console.log(`[${bot.name}] Market Analysis:`, {
                        avgBuyPrice: analysis.avgBuyPrice.toFixed(2),
                        avgSellPrice: analysis.avgSellPrice.toFixed(2),
                        spread: analysis.spreadSize.toFixed(2),
                        depth: analysis.orderBookDepth
                    });

                    const decision = await bot.makeTradeDecision(analysis);
                    if (decision) {
                        await bot.placeTrade(decision);
                    }
                }
            }, interval);
        });

    } catch (error) {
        console.error('System error:', error);
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

console.log('Starting multi-bot trading system...');
runMultiBotSystem();