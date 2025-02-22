// server.js
import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import { initializeWebSocket } from './utils/websocket.utils.js';
import cors from 'cors';
import morgan from 'morgan';

// Import routes
import bigRoutes from "./routes/product.route.js";
import orderbookRoutes from "./routes/orderbook.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(morgan('dev')); // logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", bigRoutes);
app.use("/api/orderbook", orderbookRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, () => {
    connect(); // Connect to MongoDB
    console.log('Server is running on http://localhost:' + PORT);
});

// Initialize WebSocket
initializeWebSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
    server.close(() => process.exit(1));
});

export default app;