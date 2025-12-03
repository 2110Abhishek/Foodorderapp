// backend/controllers/restaurantController.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Country = require('../models/Country');

// GET /api/restaurants?country=IN
router.get('/', async (req, res) => {
  const { country } = req.query;
  let filter = { active: true };
  if (country) {
    const countryDoc = await Country.findOne({ code: country });
    if (!countryDoc) return res.status(400).json({ message: 'Unknown country code' });
    filter.country = countryDoc._id;
  }
  const list = await Restaurant.find(filter).populate('country').lean();
  res.json(list);
});

/*
 Enhanced GET /restaurants/:id/menu
 Supports query params:
  - cuisine
  - category
  - tag
  - minPrice (in cents)
  - maxPrice (in cents)
  - minRating (float)
  - q (search in name/description)
  - sort: price_asc | price_desc | rating_desc | rating_asc | newest
  - page, limit (pagination)
*/
router.get('/:id/menu', async (req, res) => {
  const { id } = req.params;
  const {
    cuisine, category, tag, minPrice, maxPrice, minRating,
    q, sort, page = 1, limit = 20, available
  } = req.query;

  const restaurant = await Restaurant.findById(id).populate('country').lean();
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  // build filter
  const filter = { restaurant: restaurant._id };
  if (cuisine) filter.cuisine = cuisine;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (typeof available !== 'undefined') filter.isAvailable = available === 'true' || available === '1';
  if (minPrice) filter.priceCents = { ...(filter.priceCents || {}), $gte: Number(minPrice) };
  if (maxPrice) filter.priceCents = { ...(filter.priceCents || {}), $lte: Number(maxPrice) };
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: regex }, { description: regex }];
  }

  // sorting
  let sortObj = { createdAt: -1 }; // newest by default
  if (sort === 'price_asc') sortObj = { priceCents: 1 };
  else if (sort === 'price_desc') sortObj = { priceCents: -1 };
  else if (sort === 'rating_desc') sortObj = { rating: -1 };
  else if (sort === 'rating_asc') sortObj = { rating: 1 };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(200, Number(limit) || 20);
  const skipNum = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    MenuItem.find(filter).sort(sortObj).skip(skipNum).limit(limitNum).lean(),
    MenuItem.countDocuments(filter)
  ]);

  res.json({
    restaurant,
    menu: items,
    meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
  });
});

module.exports = router;
