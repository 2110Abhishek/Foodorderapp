// backend/models/Restaurant.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
