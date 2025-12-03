// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ['ADMIN','MANAGER','MEMBER'], default: 'MEMBER' },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', default: null }, // null => global (admin)
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
