import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PHASE 4 CATALOGUE & PRICING TESTS ---');

  // 1. Fetch public pizzas
  const pizzasRes = await fetch(`${BASE_URL}/pizzas`);
  const pizzasData = await pizzasRes.json();
  console.log('[TEST 1] GET /pizzas:', pizzasRes.status, 'Total pizzas:', pizzasData.pizzas?.length);
  assert.strictEqual(pizzasRes.status, 200);
  assert.ok(pizzasData.pizzas.length >= 6);

  // 2. Fetch public options
  const optionsRes = await fetch(`${BASE_URL}/options`);
  const optionsData = await optionsRes.json();
  console.log('[TEST 2] GET /options:', optionsRes.status, 'Total options:', optionsData.options?.length);
  assert.strictEqual(optionsRes.status, 200);
  assert.ok(optionsData.options.length >= 15);

  const sizeMedium = optionsData.options.find(o => o.type === 'size' && o.name.includes('Medium'));
  const sauceAlfredo = optionsData.options.find(o => o.type === 'sauce' && o.name.includes('Alfredo'));
  const cheeseProvolone = optionsData.options.find(o => o.type === 'cheese' && o.name.includes('Provolone'));
  const toppingPepperoni = optionsData.options.find(o => o.type === 'topping' && o.name.includes('Pepperoni'));
  const toppingBasil = optionsData.options.find(o => o.type === 'topping' && o.name.includes('Basil'));
  const toppingTruffle = optionsData.options.find(o => o.type === 'topping' && o.name.includes('Truffle'));

  assert.ok(sizeMedium, 'Medium size option must exist');
  assert.ok(sauceAlfredo, 'Alfredo sauce option must exist');
  assert.ok(cheeseProvolone, 'Provolone cheese option must exist');
  assert.ok(toppingPepperoni, 'Pepperoni topping option must exist');

  // 3. Test Server-Side Pricing Calculation
  const calcRes = await fetch(`${BASE_URL}/pizzas/calculate-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sizeId: sizeMedium._id,
      sauceId: sauceAlfredo._id,
      cheeseId: cheeseProvolone._id,
      toppingIds: [toppingPepperoni._id, toppingBasil._id]
    })
  });
  const calcData = await calcRes.json();
  console.log('[TEST 3] POST /pizzas/calculate-price:', calcRes.status, 'Calculated Unit Price:', calcData.unitPrice, 'Available:', calcData.isAvailable);
  assert.strictEqual(calcRes.status, 200);
  // Medium (299) + Alfredo (40) + Provolone (50) + Pepperoni (75) + Basil (30) = 494
  assert.strictEqual(calcData.unitPrice, 494);
  assert.strictEqual(calcData.isAvailable, true);

  // 4. Test Out-of-Stock Item Enforcement in Pricing
  if (toppingTruffle) {
    const oosRes = await fetch(`${BASE_URL}/pizzas/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sizeId: sizeMedium._id,
        sauceId: sauceAlfredo._id,
        cheeseId: cheeseProvolone._id,
        toppingIds: [toppingPepperoni._id, toppingTruffle._id]
      })
    });
    const oosData = await oosRes.json();
    console.log('[TEST 4] Out-of-Stock Pricing Check:', oosRes.status, 'Is Available:', oosData.isAvailable, 'Errors:', oosData.errors);
    assert.strictEqual(oosData.isAvailable, false);
    assert.ok(oosData.errors.length > 0);
  }

  // 5. Admin Login for CRUD Tests
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

  // 6. Test RBAC: Unauthenticated / Customer attempt to create pizza
  const unauthRes = await fetch(`${BASE_URL}/pizzas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Unauthorized Pizza',
      description: 'Test',
      basePrice: 399,
      category: 'veg'
    })
  });
  console.log('[TEST 6] Unauthenticated POST /pizzas:', unauthRes.status);
  assert.strictEqual(unauthRes.status, 401);

  // 7. Admin Create Pizza
  const createRes = await fetch(`${BASE_URL}/pizzas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Chef Roman Special ' + Date.now(),
      description: 'Smoked burrata, roasted artichokes, and sundried tomato tapenade.',
      basePrice: 529,
      category: 'veg',
      image: 'roman-special'
    })
  });
  const createData = await createRes.json();
  console.log('[TEST 7] Admin POST /pizzas:', createRes.status, createData.message);
  assert.strictEqual(createRes.status, 201);
  const createdPizzaId = createData.pizza._id;

  // 8. Admin Update Pizza
  const updateRes = await fetch(`${BASE_URL}/pizzas/${createdPizzaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      basePrice: 559,
      description: 'Updated recipe description.'
    })
  });
  const updateData = await updateRes.json();
  console.log('[TEST 8] Admin PUT /pizzas/:id:', updateRes.status, 'New Price:', updateData.pizza?.basePrice);
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.pizza.basePrice, 559);

  // 9. Admin Delete Pizza
  const deleteRes = await fetch(`${BASE_URL}/pizzas/${createdPizzaId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('[TEST 9] Admin DELETE /pizzas/:id:', deleteRes.status);
  assert.strictEqual(deleteRes.status, 200);

  console.log('\n=============================================');
  console.log('ALL PHASE 4 CATALOGUE & PRICING TESTS PASSED!');
  console.log('=============================================\n');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
