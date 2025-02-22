import express from 'express';
import OrderController from '../controllers/order.controller.js'; // Import the OrderController

const router = express.Router();

// Add a root route handler
router.get('/', (req, res) => {
    res.json({ message: 'Orderbook API is working' });
});

// Use the createOrder method from OrderController for the /order route
router.post('/order', OrderController.createOrder);

// Use the getOrderbook method from OrderController for the /:coinPair route
router.get('/:coinPair', OrderController.getOrderbook);

export default router;