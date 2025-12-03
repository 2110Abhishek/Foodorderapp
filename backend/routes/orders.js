// backend/routes/orders.js
const router = require('express').Router();
const orderController = require('../controllers/orderController');
router.use('/', orderController);
module.exports = router;
