// backend/models/Country.js
const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // 'IN', 'US'
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema);
