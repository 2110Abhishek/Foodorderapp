// backend/routes/users.js
const router = require('express').Router();
const User = require('../models/User');
const Country = require('../models/Country');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

// GET /api/users - admin only: list users
router.get('/', auth, roles(['ADMIN']), async (req, res) => {
  try {
    const users = await User.find().populate('country').select('-passwordHash').lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users - admin only: create a user
router.post('/', auth, roles(['ADMIN']), async (req, res) => {
  try {
    const { email, password, displayName, role = 'MEMBER', countryCode = null } = req.body;
    if (!email || !password || !displayName) return res.status(400).json({ message: 'email, password, displayName required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    let country = null;
    if (countryCode) {
      country = await Country.findOne({ code: countryCode });
      if (!country) return res.status(400).json({ message: 'countryCode invalid' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash: hash,
      displayName,
      role,
      country: country ? country._id : null,
    });

    const out = await User.findById(user._id).select('-passwordHash').populate('country').lean();
    res.status(201).json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
