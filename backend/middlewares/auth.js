// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains: id, email, role, countryId
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
