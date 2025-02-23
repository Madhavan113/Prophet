// routes/order.route.js
import express from 'express';
import OrderController from '../controllers/order.controller.js';

const router = express.Router();

// POST /api/orderbook/order - Create new order
router.post('/order', OrderController.createOrder);

// GET /api/orderbook - Get all orders or filter by userId
router.get('/', OrderController.getOrders);

// DELETE /api/orderbook/:id - Delete specific order
router.delete('/:id', OrderController.deleteOrder);

export default router;