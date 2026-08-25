import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PHASE 7 ADMIN DASHBOARD & QUEUE TESTS ---');

  // 1. Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@crustpizza.com',
      password: 'Admin@12345'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  console.log('[TEST 1] Admin logged in. Token issued:', !!adminToken);
  assert.ok(adminToken);

  // 2. Customer Registration for RBAC & Order Testing
  const customerEmail = `dashboard_user_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Simran Kaur',
      email: customerEmail,
      password: 'Password@123'
    })
  });
  const regData = await regRes.json();
  const customerToken = regData.token;
  assert.ok(customerToken);

  // 3. Create a test order
  const optRes = await fetch(`${BASE_URL}/options`);
  const optData = await optRes.json();
  const sizeMedium = optData.options.find(o => o.type === 'size');
  const sauceTomato = optData.options.find(o => o.type === 'sauce');
  const cheeseMozzarella = optData.options.find(o => o.type === 'cheese');

  await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      sizeId: sizeMedium._id,
      sauceId: sauceTomato._id,
      cheeseId: cheeseMozzarella._id,
      quantity: 1
    })
  });

  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      deliveryAddress: {
        street: '88 Juhu Tara Road',
        city: 'Mumbai',
        pin: '400049'
      }
    })
  });
  const orderData = await orderRes.json();
  const testOrderId = orderData.order._id;
  console.log('[TEST 3] Created order for testing:', orderData.order.orderCode, 'ID:', testOrderId);

  // 4. Test GET /api/admin/dashboard/stats
  const statsRes = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const statsData = await statsRes.json();
  console.log('[TEST 4] Admin Dashboard Stats:');
  console.log(' - Today Orders:', statsData.stats?.todayOrders);
  console.log(' - Today Revenue:', statsData.stats?.todayRevenue);
  console.log(' - Total Customers:', statsData.stats?.totalCustomers);
  console.log(' - Low Stock Count:', statsData.stats?.lowStockCount);
  assert.strictEqual(statsRes.status, 200);
  assert.ok(typeof statsData.stats.todayOrders === 'number');
  assert.ok(typeof statsData.stats.totalCustomers === 'number');
  assert.ok(statsData.stats.lowStockCount >= 1, 'White Truffle oil should trigger low stock count');

  // 5. Test GET /api/admin/orders
  const allOrdersRes = await fetch(`${BASE_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const allOrdersData = await allOrdersRes.json();
  console.log('[TEST 5] Total Admin Orders in Queue:', allOrdersData.orders?.length);
  assert.strictEqual(allOrdersRes.status, 200);
  assert.ok(allOrdersData.orders.length > 0);

  // 6. Test PATCH /api/orders/:id/status (Workflow state machine)
  // Advance to 'ordered'
  const step1 = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'ordered' })
  });
  const step1Data = await step1.json();
  console.log('[TEST 6a] Moved to "ordered":', step1.status, step1Data.order?.orderStatus);
  assert.strictEqual(step1.status, 200);
  assert.strictEqual(step1Data.order.orderStatus, 'ordered');

  // Advance to 'kitchen'
  const step2 = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'kitchen' })
  });
  const step2Data = await step2.json();
  console.log('[TEST 6b] Moved to "kitchen":', step2.status, step2Data.order?.orderStatus);
  assert.strictEqual(step2.status, 200);
  assert.strictEqual(step2Data.order.orderStatus, 'kitchen');

  // Advance to 'out_for_delivery'
  const step3 = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'out_for_delivery' })
  });
  const step3Data = await step3.json();
  console.log('[TEST 6c] Moved to "out_for_delivery":', step3.status, step3Data.order?.orderStatus);
  assert.strictEqual(step3.status, 200);
  assert.strictEqual(step3Data.order.orderStatus, 'out_for_delivery');

  // Advance to 'delivered'
  const step4 = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'delivered' })
  });
  const step4Data = await step4.json();
  console.log('[TEST 6d] Moved to "delivered":', step4.status, step4Data.order?.orderStatus);
  assert.strictEqual(step4.status, 200);
  assert.strictEqual(step4Data.order.orderStatus, 'delivered');
  assert.ok(step4Data.order.statusHistory.length >= 4, 'Status history should contain all transitions');

  // 7. Test RBAC: Customer attempt to update order status
  const unauthRes = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({ status: 'kitchen' })
  });
  console.log('[TEST 7] Customer unauthorized status update attempt:', unauthRes.status);
  assert.strictEqual(unauthRes.status, 403);

  console.log('\n======================================================');
  console.log('ALL PHASE 7 ADMIN DASHBOARD & QUEUE TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
