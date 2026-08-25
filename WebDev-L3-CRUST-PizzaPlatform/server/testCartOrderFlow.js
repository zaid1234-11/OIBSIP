import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PHASE 5 CART & ORDER INTEGRATION TESTS ---');

  // 1. Register customer
  const email = `customer_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email,
      password: 'Password@123'
    })
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('[TEST 1] Registered customer:', email, 'Token issued:', !!token);
  assert.ok(token, 'Customer token must be issued');

  // 2. Fetch options
  const optRes = await fetch(`${BASE_URL}/options`);
  const optData = await optRes.json();
  const sizeLarge = optData.options.find(o => o.type === 'size' && o.name.includes('Large'));
  const sauceTomato = optData.options.find(o => o.type === 'sauce' && o.name.includes('San Marzano'));
  const cheeseMozzarella = optData.options.find(o => o.type === 'cheese' && o.name.includes('Mozzarella'));
  const toppingPepperoni = optData.options.find(o => o.type === 'topping' && o.name.includes('Pepperoni'));
  const toppingBasil = optData.options.find(o => o.type === 'topping' && o.name.includes('Basil'));

  assert.ok(sizeLarge && sauceTomato && cheeseMozzarella && toppingPepperoni, 'Required options must exist');

  // 3. Add Custom Pizza to Cart
  // Large (399) + Tomato (0) + Mozzarella (0) + Pepperoni (75) + Basil (30) = 504
  const addRes = await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      sizeId: sizeLarge._id,
      sauceId: sauceTomato._id,
      cheeseId: cheeseMozzarella._id,
      toppingIds: [toppingPepperoni._id, toppingBasil._id],
      quantity: 2
    })
  });
  const addData = await addRes.json();
  console.log('[TEST 3] Add to Cart:', addRes.status, 'Items count:', addData.cart?.items?.length, 'Subtotal:', addData.cart?.subtotal);
  assert.strictEqual(addRes.status, 200);
  assert.strictEqual(addData.cart.items.length, 1);
  assert.strictEqual(addData.cart.items[0].unitPrice, 504);
  assert.strictEqual(addData.cart.subtotal, 1008); // 504 * 2 = 1008
  const cartItemId = addData.cart.items[0]._id;

  // 4. Update Cart Item Quantity
  const updateRes = await fetch(`${BASE_URL}/cart/items/${cartItemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ quantity: 1 })
  });
  const updateData = await updateRes.json();
  console.log('[TEST 4] Update Quantity to 1:', updateRes.status, 'New Subtotal:', updateData.cart?.subtotal);
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.cart.subtotal, 504);

  // 5. Place Order (Convert Cart to Order)
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      deliveryAddress: {
        street: '42 Baker Street, Bandra West',
        city: 'Mumbai',
        pin: '400050'
      }
    })
  });
  const orderData = await orderRes.json();
  console.log('[TEST 5] Place Order:', orderRes.status, 'Order Code:', orderData.order?.orderCode, 'Total:', orderData.order?.total);
  assert.strictEqual(orderRes.status, 201);
  assert.ok(orderData.order.orderCode.startsWith('CR-'));
  assert.strictEqual(orderData.order.items[0].unitPrice, 504);
  assert.strictEqual(orderData.order.subtotal, 504);
  assert.strictEqual(orderData.order.deliveryFee, 40); // subtotal < 1000 => 40
  assert.strictEqual(orderData.order.tax, 25); // 5% of 504 = 25.2 => 25
  assert.strictEqual(orderData.order.total, 504 + 40 + 25); // 569
  assert.strictEqual(orderData.order.orderStatus, 'pending_payment');
  const createdOrderId = orderData.order._id;

  // 6. Verify User's Cart was Emptied
  const verifyCartRes = await fetch(`${BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const verifyCartData = await verifyCartRes.json();
  console.log('[TEST 6] Verify Cart Cleared after Order:', verifyCartData.cart?.items?.length);
  assert.strictEqual(verifyCartData.cart.items.length, 0);

  // 7. Get Customer Order History
  const myOrdersRes = await fetch(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const myOrdersData = await myOrdersRes.json();
  console.log('[TEST 7] GET /orders count:', myOrdersData.orders?.length);
  assert.strictEqual(myOrdersRes.status, 200);
  assert.strictEqual(myOrdersData.orders.length, 1);

  // 8. Get Order By ID / Code
  const detailRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const detailData = await detailRes.json();
  console.log('[TEST 8] GET /orders/:id:', detailRes.status, 'Order Code:', detailData.order?.orderCode);
  assert.strictEqual(detailRes.status, 200);
  assert.strictEqual(detailData.order.orderCode, orderData.order.orderCode);

  // 9. Customer Scoping (Second user attempts to access first user's order)
  const regRes2 = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Intruder User',
      email: `intruder_${Date.now()}@example.com`,
      password: 'Password@123'
    })
  });
  const regData2 = await regRes2.json();
  const token2 = regData2.token;

  const forbiddenRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${token2}` }
  });
  console.log('[TEST 9] Second user access attempt on first user order:', forbiddenRes.status);
  assert.strictEqual(forbiddenRes.status, 403);

  // 10. Admin Access to Order
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

  const adminOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('[TEST 10] Admin access to customer order:', adminOrderRes.status);
  assert.strictEqual(adminOrderRes.status, 200);

  console.log('\n=============================================');
  console.log('ALL PHASE 5 CART & ORDER INTEGRATION TESTS PASSED!');
  console.log('=============================================\n');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
