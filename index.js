require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { connectDB } = require('./db/db');
const jobPostRoute = require('./routes/formSubmit.route');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/', jobPostRoute);

app.get('/', (req, res) => {
  res.send('API running');
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();