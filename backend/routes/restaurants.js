// backend/routes/restaurants.js
const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
router.use('/', restaurantController);
module.exports = router;
