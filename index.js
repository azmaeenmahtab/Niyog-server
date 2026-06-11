require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { connectDB } = require('./db/db');
const jobPostRoute = require('./routes/formSubmit.route');
const jobsRoute = require('./routes/jobs.route');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/', jobPostRoute);
app.use('/', jobsRoute);

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