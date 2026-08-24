import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';

const app = express();

// Middleware
app.use(cors({
  origin: env.clientUrl,
  credentials: true
}));
app.use(express.json());

// Base health check / ping endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({ ok: true });
});

// Database connection
connectDB();

// Start Server
const server = app.listen(env.port, () => {
  console.log(`[CRUST Server] Running in ${env.nodeEnv} mode on port ${env.port}`);
});

export default app;
export { server };
