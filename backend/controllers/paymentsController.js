// backend/controllers/paymentsController.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

const PaymentMethod = require('../models/PaymentMethod');

// Admin can list and create payment methods (global or user-scoped)
router.get('/', auth, roles(['ADMIN']), async (req, res) => {
  const list = await PaymentMethod.find().populate('user').lean();
  res.json(list);
});

router.post('/', auth, roles(['ADMIN']), async (req, res) => {
  const { userId = null, type, provider, last4 } = req.body;
  if (!type) return res.status(400).json({ message: 'type required' });
  const pm = await PaymentMethod.create({ user: userId, type, provider, last4 });
  res.json(pm);
});

module.exports = router;
