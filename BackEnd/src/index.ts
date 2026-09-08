import connectDB from '@/config/db.js';
import { CLIENT_URL, PORT, validateEnv } from '@/constants/env.js';
import { errorHandler } from '@/middleware/errorHandler.js';
import routes from '@/routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Validate required environment variables
validateEnv();

// Create Express app
const app = express();

app.use(helmet());


// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Connect to PostgreSQL
connectDB();

const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: 'Too many requests',
});

app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AuthVault API is running',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AuthVault server running on port ${PORT}`);
});
