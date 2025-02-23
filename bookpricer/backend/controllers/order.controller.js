// controllers/order.controller.js
import Order from '../models/order.model.js';

class OrderController {
    // Create new order
    static async createOrder(req, res) {
        try {
            const { type, coinPair, price, amount, userId } = req.body;
            
            const newOrder = new Order({
                type,
                coinPair,
                price,
                amount,
                userId
            });

            const savedOrder = await newOrder.save();
            res.status(201).json(savedOrder);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all orders or filter by userId
    static async getOrders(req, res) {
        try {
            const { userId } = req.query;
            const filter = userId ? { userId } : {};
            
            const orders = await Order.find(filter).sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete order by ID
    static async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const deletedOrder = await Order.findByIdAndDelete(id);
            
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            res.json({ message: 'Order deleted successfully', order: deletedOrder });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default OrderController;