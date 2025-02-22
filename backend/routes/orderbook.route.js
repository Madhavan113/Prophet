const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');

router.post('/order', auth, OrderController.createOrder);
router.get('/orderbook/:coinPair', OrderController.getOrderbook);

module.exports = router;
