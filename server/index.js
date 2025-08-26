const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
require('dotenv').config({ silent: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public directory
app.use('/productImages', express.static(path.join(__dirname, 'public/productImages')));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully' });
});

// Admin routes mounted at /api/admin
app.use('/api/admin', adminRoutes);

async function checkDbConnection() {
  try {
    await db.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

async function startServer() {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Server failed to start due to database connection error.');
    process.exit(1);
  }
}

startServer();