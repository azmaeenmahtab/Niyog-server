import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import express, { Request, Response } from 'express';
import { connectDB } from './db/db';
import jobPostRoute from './routes/formSubmit.route';
import jobsRoute from './routes/jobs.route';
import CompanyRoute from './routes/company.route';
import userRoute from './routes/user.route';
import applicationRoute from './routes/application.route'


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} — query:`, req.query, "— body keys:", req.body ? Object.keys(req.body) : null);
  next();
});

// Routes
app.use('/', jobPostRoute);
app.use('/', jobsRoute);
app.use('/api', CompanyRoute);
app.use('/api/user', userRoute);
app.use('/api/applications', applicationRoute);


app.get('/', (req: Request, res: Response) => {
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
