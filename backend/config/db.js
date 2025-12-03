// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in env');
    process.exit(1);
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
