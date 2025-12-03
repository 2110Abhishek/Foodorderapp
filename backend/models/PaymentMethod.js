// backend/models/PaymentMethod.js
const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // admin can add global (null)
  type: { type: String, required: true }, // CARD/UPI etc.
  provider: String,
  last4: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
