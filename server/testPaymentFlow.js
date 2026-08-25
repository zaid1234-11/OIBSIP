import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PHASE 6 RAZORPAY & PAYMENT INTEGRATION TESTS ---');

  // 1. Register test customer
  const email = `pay_customer_${Date.now()}@example.com`;
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
  assert.ok(token, 'Customer token must be issued');

  // 2. Fetch options & add item to cart
  const optRes = await fetch(`${BASE_URL}/options`);
  const optData = await optRes.json();
  const sizeMedium = optData.options.find(o => o.type === 'size' && o.name.includes('Medium'));
  const sauceTomato = optData.options.find(o => o.type === 'sauce' && o.name.includes('San Marzano'));
  const cheeseMozzarella = optData.options.find(o => o.type === 'cheese' && o.name.includes('Mozzarella'));

  const addCartRes = await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      sizeId: sizeMedium._id,
      sauceId: sauceTomato._id,
      cheeseId: cheeseMozzarella._id,
      quantity: 1
    })
  });
  assert.strictEqual(addCartRes.status, 200);

  // 3. Place Order
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      deliveryAddress: {
        street: '104 Marine Drive, Nariman Point',
        city: 'Mumbai',
        pin: '400021'
      }
    })
  });
  const orderData = await orderRes.json();
  assert.strictEqual(orderRes.status, 201);
  const createdOrderId = orderData.order._id;
  console.log('[TEST 3] Placed order in pending_payment state:', orderData.order.orderCode);

  // 4. POST /payments/create-order
  const createPaymentRes = await fetch(`${BASE_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderId: createdOrderId })
  });
  const createPaymentData = await createPaymentRes.json();
  console.log('[TEST 4] POST /payments/create-order:', createPaymentRes.status, 'Is Mock:', createPaymentData.isMock, 'Mock Order ID:', createPaymentData.id);
  assert.strictEqual(createPaymentRes.status, 200);
  assert.ok(createPaymentData.id.startsWith('order_mock_'));
  assert.strictEqual(createPaymentData.isMock, true);

  // 5. Test Payment Verification - Failure Path (mockSuccess: false)
  const verifyFailRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      razorpay_order_id: createPaymentData.id,
      razorpay_payment_id: 'failed',
      razorpay_signature: 'failed',
      mockSuccess: false
    })
  });
  const verifyFailData = await verifyFailRes.json();
  console.log('[TEST 5] Verify Payment Failure Path:', verifyFailRes.status, 'Error:', verifyFailData.error);
  assert.strictEqual(verifyFailRes.status, 400);

  // Verify CRUST Order status is 'failed'
  const checkFailOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const checkFailOrderData = await checkFailOrderRes.json();
  console.log('[TEST 5b] CRUST Order Payment Status:', checkFailOrderData.order?.paymentStatus, 'Order Status:', checkFailOrderData.order?.orderStatus);
  assert.strictEqual(checkFailOrderData.order.paymentStatus, 'failed');
  assert.strictEqual(checkFailOrderData.order.orderStatus, 'pending_payment');

  // 6. Test Payment Verification - Success Path (mockSuccess: true)
  const verifySuccessRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      razorpay_order_id: createPaymentData.id,
      razorpay_payment_id: 'pay_mock_success_123',
      razorpay_signature: 'sig_mock_success_123',
      mockSuccess: true
    })
  });
  const verifySuccessData = await verifySuccessRes.json();
  console.log('[TEST 6] Verify Payment Success Path:', verifySuccessRes.status, 'Message:', verifySuccessData.message);
  assert.strictEqual(verifySuccessRes.status, 200);

  // Verify CRUST Order status is updated to 'paid' and 'ordered'
  const checkSuccessOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const checkSuccessOrderData = await checkSuccessOrderRes.json();
  console.log('[TEST 6b] CRUST Order Payment Status:', checkSuccessOrderData.order?.paymentStatus, 'Order Status:', checkSuccessOrderData.order?.orderStatus);
  assert.strictEqual(checkSuccessOrderData.order.paymentStatus, 'paid');
  assert.strictEqual(checkSuccessOrderData.order.orderStatus, 'ordered');
  assert.strictEqual(checkSuccessOrderData.order.statusHistory[1].status, 'ordered');

  // 7. Scoping Check - Another user trying to verify payment on this order
  const regRes2 = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Intruder User',
      email: `pay_intruder_${Date.now()}@example.com`,
      password: 'Password@123'
    })
  });
  const regData2 = await regRes2.json();
  const token2 = regData2.token;

  const forbiddenVerifyRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token2}`
    },
    body: JSON.stringify({
      orderId: createdOrderId,
      razorpay_order_id: createPaymentData.id,
      mockSuccess: true
    })
  });
  console.log('[TEST 7] Customer scoping verification check:', forbiddenVerifyRes.status);
  assert.strictEqual(forbiddenVerifyRes.status, 403);

  console.log('\n===================================================');
  console.log('ALL PHASE 6 RAZORPAY & PAYMENT INTEGRATION TESTS PASSED!');
  console.log('===================================================\n');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
