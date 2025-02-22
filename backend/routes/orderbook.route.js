// routes/orderbook.route.js
import express from 'express';
const router = express.Router();

// Add a root route handler
router.get('/', (req, res) => {
    res.json({ message: 'Orderbook API is working' });
});

router.post('/order', (req, res) => {
    res.json({ message: 'Order route working' });
});

router.get('/:coinPair', (req, res) => {
    res.json({ message: 'Orderbook fetch route working' });
});

export default router;