import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';
import seedAdminUser from './utils/seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

// Mount Routes per Spec Section 5
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found.` });
});

// Start Express Server immediately so it never hangs
const server = app.listen(env.port, () => {
  console.log(`[CRUST Server] Running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Connect to MongoDB asynchronously
connectDB().then(async (conn) => {
  if (conn) {
    await seedAdminUser();
  }
});

export default app;
export { server };
