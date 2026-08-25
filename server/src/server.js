import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';
import seedAdminUser from './utils/seedAdmin.js';
import seedCatalogue from './utils/seedCatalogue.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import optionRoutes from './routes/optionRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

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
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/options', optionRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Global 404 handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found.` });
});

// Start Express Server immediately
const server = app.listen(env.port, () => {
  console.log(`[CRUST Server] Running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Connect to MongoDB asynchronously & seed
connectDB().then(async (conn) => {
  if (conn) {
    await seedAdminUser();
    await seedCatalogue();
  }
});

export default app;
export { server };
