// backend/routes/payments.js
const router = require('express').Router();
const paymentsController = require('../controllers/paymentsController');
router.use('/', paymentsController);
module.exports = router;
