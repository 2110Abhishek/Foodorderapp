// backend/server.js
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// Connect DB
connectDB().catch(err => {
  console.error('DB connection error', err);
  process.exit(1);
});

// Routes (load after DB connect)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.send('Food-order API running'));

// Create HTTP server and attach socket.io
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' } // tighten this in production
});

// Make io accessible from Express handlers
app.set('io', io);

// Socket auth helper
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('Authentication error: token required'));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload; // { id, email, role, countryId }
    return next();
  } catch (err) {
    return next(new Error('Authentication error: invalid token'));
  }
});

io.on('connection', (socket) => {
  const user = socket.user;
  console.log('socket connected:', user?.email || 'unknown');

  // join user room
  socket.join(`user:${user.id}`);

  // join admin room if admin
  if (user.role === 'ADMIN') socket.join('admin');

  // join country room if user has a country
  if (user.countryId) socket.join(`country:${user.countryId}`);

  // optional: client can ask to join additional rooms (restaurant-specific)
  socket.on('join_restaurant', (restaurantId) => {
    if (!restaurantId) return;
    socket.join(`restaurant:${restaurantId}`);
  });

  socket.on('leave_restaurant', (restaurantId) => {
    if (!restaurantId) return;
    socket.leave(`restaurant:${restaurantId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('socket disconnected:', user?.email, reason);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
