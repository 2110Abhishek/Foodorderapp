// backend/models/Order.js
const mongoose = require('mongoose');
const OrderItemSchema = require('./OrderItem');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  status: { type: String, enum: ['CREATED','PAID','CANCELLED'], default: 'CREATED' },
  totalCents: { type: Number, required: true },
  items: [OrderItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
