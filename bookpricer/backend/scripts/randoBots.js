import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api/orderbook';
const TRADE_INTERVAL = 100; // 500ms between trades
const BOT_CYCLE_TIME = 10; // 100ms for aggressive trading

class TradingBot {
    constructor(name, personality, isResolver = false) {
        this.name = name;
        this.personality = personality;
        this.isResolver = isResolver;
        this.lastAction = null;
        this.totalTrades = 0;
        this.isRunning = false;
        
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

            return {
                buyOrders,
                sellOrders,
                avgBuyPrice: this.calculateAverage(buyOrders.map(o => o.price)),
                avgSellPrice: this.calculateAverage(sellOrders.map(o => o.price)),
                spreadSize: this.calculateAverage(sellOrders.map(o => o.price)) - 
                          this.calculateAverage(buyOrders.map(o => o.price)),
                orderBookDepth: orders.length
            };
        } catch (error) {
            console.error(`[${this.name}] Orderbook analysis error:`, error.message);
            return null;
        }
    }

    calculateAverage(prices) {
        return prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    }

    async resolveOutstandingOrder(analysis) {
        if (!analysis || (!analysis.buyOrders.length && !analysis.sellOrders.length)) return null;

        const resolveBuy = Math.random() > 0.5 && analysis.buyOrders.length > 0;
        const ordersToChooseFrom = resolveBuy ? analysis.buyOrders : analysis.sellOrders;

        if (!ordersToChooseFrom.length) return null;

        const orderToResolve = ordersToChooseFrom[Math.floor(Math.random() * ordersToChooseFrom.length)];

        return {
            type: resolveBuy ? 'SELL' : 'BUY',
            price: orderToResolve.price,
            amount: orderToResolve.amount
        };
    }

    async makeTradeDecision(analysis) {
        if (!analysis) return null;

        if (this.isResolver) {
            return this.resolveOutstandingOrder(analysis);
        }

        const midPrice = (analysis.avgBuyPrice + analysis.avgSellPrice) / 2;
        const priceVariation = analysis.spreadSize * this.aggressiveness;
        const randomFactor = Math.random() * this.riskTolerance;

        const buyPressure = analysis.buyOrders.length / (analysis.orderBookDepth || 1);
        const decision = {
            type: Math.random() < this.trendFollowing ? 
                  (buyPressure > 0.5 ? 'BUY' : 'SELL') : 
                  (buyPressure > 0.5 ? 'SELL' : 'BUY'),
            price: midPrice,
            amount: (0.1 + (Math.random() * 0.9)) * this.orderSizePreference
        };

        decision.price += decision.type === 'BUY' ? 
                         -(priceVariation * randomFactor) : 
                         (priceVariation * randomFactor);

        this.lastAction = decision.type;
        return decision;
    }

    async placeTrade(decision) {
        if (!decision) return null;

        try {
            const order = {
                type: decision.type,
                coinPair: '2',
                price: parseFloat(decision.price.toFixed(2)),
                amount: parseFloat(decision.amount.toFixed(4)),
                userId: this.personality.userId
            };

            const response = await axios.post(`${API_URL}/order`, order);
            this.totalTrades++;
            console.log(`[${this.name}] ${decision.type} #${this.totalTrades}: ${order.amount} @ $${order.price}`);
            return response.data;
        } catch (error) {
            console.error(`[${this.name}] Trade placement error:`, error.message);
            return null;
        }
    }

    async tradingCycle() {
        if (!this.isRunning) return;

        const analysis = await this.analyzeOrderBook();
        if (analysis) {
            const decision = await this.makeTradeDecision(analysis);
            if (decision) {
                await this.placeTrade(decision);
            }
        }

        // Schedule next cycle with small random delay
        const delay = BOT_CYCLE_TIME + (Math.random() * TRADE_INTERVAL);
        setTimeout(() => this.tradingCycle(), delay);
    }

    start() {
        this.isRunning = true;
        this.tradingCycle();
    }

    stop() {
        this.isRunning = false;
    }
}

// Bot personalities with unique trading characteristics
const botPersonalities = [
    {
        name: "Resolver",
        personality: {
            userId: "67ba4f2338434f902d054c57",
            aggressiveness: 0.5,
            riskTolerance: 0.5,
            trendFollowing: 0.5,
            orderSizePreference: 0.5
        },
        isResolver: true
    },
    // Add 9 more diverse trading personalities...
    {
        name: "AggressiveTrader",
        personality: {
            userId: "67ba4f2338434f902d054c58",
            aggressiveness: 0.9,
            riskTolerance: 0.8,
            trendFollowing: 0.3,
            orderSizePreference: 0.9
        }
    },
    // ... (remaining bot personalities)
];

// Add random variation to personalities
const createRandomizedPersonality = (basePersonality) => {
    const randomize = (value) => {
        const variation = (Math.random() - 0.5) * 0.2;
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

const runParallelBotSystem = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB successfully');

        // Create and start all bots in parallel
        const bots = botPersonalities.map(base => {
            const randomized = createRandomizedPersonality(base);
            return new TradingBot(
                randomized.name, 
                randomized.personality,
                base.isResolver || false
            );
        });

        // Start all bots simultaneously
        console.log('Starting all trading bots in parallel...');
        bots.forEach(bot => bot.start());

        // Setup cleanup
        process.on('SIGINT', async () => {
            console.log('\nStopping all bots...');
            bots.forEach(bot => bot.stop());
            
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed');
                process.exit(0);
            } catch (err) {
                console.error('Error during shutdown:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('System initialization error:', error);
        process.exit(1);
    }
};

console.log('Initializing parallel trading system...');
runParallelBotSystem();