import Order from '../models/Order.js';
import User from '../models/User.js';
import Ingredient from '../models/Ingredient.js';

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Today's orders count
    const todayOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    const totalOrdersCount = await Order.countDocuments();

    // 2. Revenue aggregation (from paid orders)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const todayRevenue = revenueResult[0]?.totalRevenue || 0;

    // 3. Registered customers count
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Low stock ingredients count (currentStock <= minimumStock)
    const lowStockCount = await Ingredient.countDocuments({
      $expr: { $lte: ['$currentStock', '$minimumStock'] }
    });

    // 5. Status distribution counts
    const [pendingCount, orderedCount, kitchenCount, deliveryCount, deliveredCount, cancelledCount] = await Promise.all([
      Order.countDocuments({ orderStatus: 'pending_payment' }),
      Order.countDocuments({ orderStatus: 'ordered' }),
      Order.countDocuments({ orderStatus: 'kitchen' }),
      Order.countDocuments({ orderStatus: 'out_for_delivery' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' })
    ]);

    // 6. Recent active orders for the live table
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      stats: {
        todayOrders: todayOrdersCount || totalOrdersCount,
        totalOrders: totalOrdersCount,
        todayRevenue,
        totalCustomers,
        lowStockCount,
        statusCounts: {
          pending_payment: pendingCount,
          ordered: orderedCount,
          kitchen: kitchenCount,
          out_for_delivery: deliveryCount,
          delivered: deliveredCount,
          cancelled: cancelledCount
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('[getDashboardStats Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin dashboard stats.' });
  }
};

// GET /api/admin/orders (Full order queue filterable by status)
export const getAdminOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.orderStatus = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('[getAdminOrders Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch admin order queue.' });
  }
};

// PATCH /api/orders/:id/status (or /api/admin/orders/:id/status)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending_payment', 'ordered', 'kitchen', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      changedAt: new Date()
    });

    // If marked ordered or delivered and payment was pending, admin manual override marks it paid
    if ((status === 'ordered' || status === 'kitchen' || status === 'delivered') && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    return res.status(200).json({
      message: `Order status moved to '${status}' successfully.`,
      order
    });
  } catch (error) {
    console.error('[updateOrderStatus Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to update order status.' });
  }
};

export default {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus
};
