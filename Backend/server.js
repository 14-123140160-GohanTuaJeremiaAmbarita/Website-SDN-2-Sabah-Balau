// server.js
require('dotenv').config(); // Load environment variables dari .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // Izinkan CORS
app.use(express.json()); // Izinkan parsing JSON di body request

// Koneksi ke Database MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// Route Dasar (Untuk Testing)
app.get('/', (req, res) => {
  res.send('SDN 2 Sabah Balau Backend API is running!');
});

// TODO: Import dan gunakan router API di sini
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/materials', require('./routes/materials.js'));

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/videos', require('./routes/video.js')); // <--- ROUTE BARU

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});