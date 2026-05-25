const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const enquiryRoutes = require('./routes/enquiryRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Voora Construction API is running 🏗️', status: 'OK' });
});

const MONGO_URI = process.env.MONGO_URI?.trim() || 'mongodb://127.0.0.1:27017/voora_db';
const PORT = parseInt(process.env.PORT, 10) || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

mongoose.set('strictQuery', true);

if (!process.env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI not set. Falling back to local MongoDB at', MONGO_URI);
} else {
  console.log('Using MongoDB URI from environment');
}

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
