const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priceCents: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '', // Add default image
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    enum: ['Main', 'Starter', 'Dessert', 'Drink', 'Street', 'Snack', 'Salad', 'Soup'],
    default: 'Main',
  },
  cuisine: {
    type: String,
    enum: ['Indian', 'Italian', 'Chinese', 'American', 'Mexican', 'Japanese', 'Mediterranean', 'Fusion'],
    default: 'Indian',
  },
  tags: [{
    type: String,
  }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);