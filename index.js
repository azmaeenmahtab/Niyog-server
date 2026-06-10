// import { client, connectDB } from './db/db';
require('dotenv').config();
const { connectDB } = require('./db/db');
const { client } = require('./db/db');



const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function startServer() {

  await connectDB();

  app.get('/', (req, res) => res.send('API running'));

  app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer().catch(console.error);