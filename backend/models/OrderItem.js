// backend/models/OrderItem.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true },
  unitPriceCents: { type: Number, required: true },
});

module.exports = OrderItemSchema; // subdocument schema
