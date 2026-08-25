import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  const testEmail = `rohan_${Date.now()}@test.com`;
  console.log('--- STARTING PHASE 3 AUTHENTICATION TESTS ---');

  // 1. Register customer
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: testEmail,
      password: 'Password@123'
    })
  });
  const regData = await regRes.json();
  console.log('[TEST 1] Register:', regRes.status, regData.message);
  assert.strictEqual(regRes.status, 201);
  assert.ok(regData.token);
  assert.ok(regData.verificationToken);
  assert.strictEqual(regData.user.isEmailVerified, false);
  assert.strictEqual(regData.user.role, 'customer');

  const verificationToken = regData.verificationToken;

  // 2. Verify Email
  const verifyRes = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: verificationToken })
  });
  const verifyData = await verifyRes.json();
  console.log('[TEST 2] Verify Email:', verifyRes.status, verifyData.message);
  assert.strictEqual(verifyRes.status, 200);
  assert.strictEqual(verifyData.isEmailVerified, true);

  // 3. Login customer
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password@123'
    })
  });
  const loginData = await loginRes.json();
  console.log('[TEST 3] Customer Login:', loginRes.status, 'JWT issued for role:', loginData.user.role);
  assert.strictEqual(loginRes.status, 200);
  assert.ok(loginData.token);
  const customerToken = loginData.token;

  // 4. Hit protected customer route /api/auth/me
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const meData = await meRes.json();
  console.log('[TEST 4] Protected /auth/me:', meRes.status, 'User:', meData.user.name, meData.user.email);
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meData.user.email, testEmail);

  // 5. Test Server-side RBAC Rejection: Hit /api/admin/test with customer token
  const rbacRejectRes = await fetch(`${BASE_URL}/admin/test`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const rbacRejectData = await rbacRejectRes.json();
  console.log('[TEST 5] RBAC Protection (Customer -> Admin Route):', rbacRejectRes.status, rbacRejectData.error);
  assert.strictEqual(rbacRejectRes.status, 403, 'Customer token must be rejected with 403 on admin route');

  // 6. Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@crustpizza.com',
      password: 'Admin@12345'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('[TEST 6] Admin Login:', adminLoginRes.status, 'Role:', adminLoginData.user.role);
  assert.strictEqual(adminLoginRes.status, 200);
  assert.strictEqual(adminLoginData.user.role, 'admin');
  const adminToken = adminLoginData.token;

  // 7. Hit /api/admin/test with admin token
  const adminAccessRes = await fetch(`${BASE_URL}/admin/test`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminAccessData = await adminAccessRes.json();
  console.log('[TEST 7] Admin Access /admin/test:', adminAccessRes.status, adminAccessData.message);
  assert.strictEqual(adminAccessRes.status, 200);
  assert.strictEqual(adminAccessData.admin, true);

  // 8. Forgot Password
  const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail })
  });
  const forgotData = await forgotRes.json();
  console.log('[TEST 8] Forgot Password:', forgotRes.status, forgotData.message);
  assert.strictEqual(forgotRes.status, 200);
  assert.ok(forgotData.resetToken);
  const resetToken = forgotData.resetToken;

  // 9. Reset Password
  const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: resetToken,
      newPassword: 'NewPassword@456'
    })
  });
  const resetData = await resetRes.json();
  console.log('[TEST 9] Reset Password:', resetRes.status, resetData.message);
  assert.strictEqual(resetRes.status, 200);

  // 10. Login with new password
  const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'NewPassword@456'
    })
  });
  const newLoginData = await newLoginRes.json();
  console.log('[TEST 10] Login with New Password:', newLoginRes.status, 'Success!');
  assert.strictEqual(newLoginRes.status, 200);

  console.log('\n========================================');
  console.log('ALL 10 AUTHENTICATION & RBAC TESTS PASSED!');
  console.log('========================================\n');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
