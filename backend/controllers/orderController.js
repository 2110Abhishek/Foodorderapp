// backend/controllers/orderController.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Country = require('../models/Country');

function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
}

// Create order (any authenticated user)
router.post('/', auth, async (req, res) => {
  const user = req.user;
  const io = req.app.get('io');
  const { restaurantId, items } = req.body;
  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'restaurantId and items[] required' });
  }

  const restaurant = await Restaurant.findById(restaurantId).populate('country').lean();
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  if (user.countryId && restaurant.country._id.toString() !== user.countryId.toString()) {
    return res.status(403).json({ message: 'Restaurant not in your country' });
  }

  const orderItems = [];
  for (const it of items) {
    const menu = await MenuItem.findById(it.menuItemId).lean();
    if (!menu) return res.status(400).json({ message: `Menu item ${it.menuItemId} not found` });
    if (!menu.isAvailable) return res.status(400).json({ message: `Menu item ${menu.name} not available` });
    if (menu.restaurant.toString() !== restaurant._id.toString()) return res.status(400).json({ message: 'Menu item does not belong to restaurant' });

    orderItems.push({ menuItem: menu._id, quantity: Number(it.quantity), unitPriceCents: menu.priceCents });
  }

  const total = calcTotal(orderItems);
  const order = await Order.create({ user: user.id, restaurant: restaurant._id, items: orderItems, totalCents: total });

  const populated = await Order.findById(order._id).populate('restaurant').populate('user').lean();

  // Emit to restaurant room (restaurant listeners) and country managers and user
  io.to(`restaurant:${restaurant._id.toString()}`).emit('order:created', populated);
  if (restaurant.country && restaurant.country._id) io.to(`country:${restaurant.country._id.toString()}`).emit('order:created', populated);
  io.to(`user:${user.id}`).emit('order:created', populated);
  io.to('admin').emit('order:created', populated);

  res.json(populated);
});

// Checkout - Admin and Manager only
router.post('/:id/checkout', auth, roles(['ADMIN','MANAGER']), async (req, res) => {
  const user = req.user;
  const io = req.app.get('io');
  const { id } = req.params;
  const order = await Order.findById(id).populate({ path:'restaurant', populate: { path: 'country' } }).populate('user').lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (user.countryId && order.restaurant.country._id.toString() !== user.countryId.toString()) {
    return res.status(403).json({ message: 'Order not in your country' });
  }

  if (order.status !== 'CREATED') return res.status(400).json({ message: 'Order not in CREATED state' });

  await Order.findByIdAndUpdate(id, { status: 'PAID' });
  const updated = await Order.findById(id).populate('restaurant').populate('user').lean();

  // Emit update to relevant rooms
  io.to(`restaurant:${order.restaurant._id.toString()}`).emit('order:updated', updated);
  if (order.restaurant.country && order.restaurant.country._id) io.to(`country:${order.restaurant.country._id.toString()}`).emit('order:updated', updated);
  io.to(`user:${order.user._id.toString()}`).emit('order:updated', updated);
  io.to('admin').emit('order:updated', updated);

  res.json({ message: 'Order paid', orderId: id });
});

// Cancel - Admin and Manager only
router.post('/:id/cancel', auth, roles(['ADMIN','MANAGER']), async (req, res) => {
  const user = req.user;
  const io = req.app.get('io');
  const { id } = req.params;
  const order = await Order.findById(id).populate({ path:'restaurant', populate: { path: 'country' } }).populate('user').lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (user.countryId && order.restaurant.country._id.toString() !== user.countryId.toString()) {
    return res.status(403).json({ message: 'Order not in your country' });
  }

  if (order.status === 'CANCELLED') return res.status(400).json({ message: 'Already cancelled' });
  await Order.findByIdAndUpdate(id, { status: 'CANCELLED' });
  const updated = await Order.findById(id).populate('restaurant').populate('user').lean();

  // Emit cancellation
  io.to(`restaurant:${order.restaurant._id.toString()}`).emit('order:cancelled', updated);
  if (order.restaurant.country && order.restaurant.country._id) io.to(`country:${order.restaurant.country._id.toString()}`).emit('order:cancelled', updated);
  io.to(`user:${order.user._id.toString()}`).emit('order:cancelled', updated);
  io.to('admin').emit('order:cancelled', updated);

  res.json({ message: 'Order cancelled', orderId: id });
});

module.exports = router;
