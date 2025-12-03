// backend/controllers/authController.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });
  const user = await User.findOne({ email }).populate('country').lean();
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { id: user._id, email: user.email, role: user.role, countryId: user.country?._id ?? null };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ accessToken: token, user: { id: user._id, email: user.email, role: user.role, country: user.country } });
});

// Me endpoint
router.get('/me', require('../middlewares/auth'), async (req, res) => {
  const user = await User.findById(req.user.id).populate('country').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    country: user.country ? { id: user.country._id.toString(), code: user.country.code, name: user.country.name } : null
  });
});

module.exports = router;
