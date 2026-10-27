/**
 * WHITE MIST — HTTP Server End-to-End Route Protection & API Test
 */

const http = require('http');
const assert = require('assert');

// Start server on test port 3088
process.env.PORT = '3088';
require('./server');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runHttpTests() {
  console.log('\n========================================================');
  console.log('  RUNNING END-TO-END HTTP SERVER TESTS (Port 3088)');
  console.log('========================================================\n');

  // Wait 100ms for server listen
  await new Promise(r => setTimeout(r, 200));

  // Test 1: Public Products Endpoint
  console.log('1. Testing GET /api/products...');
  const resProducts = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/api/products',
    method: 'GET'
  });
  assert.strictEqual(resProducts.statusCode, 200);
  const products = JSON.parse(resProducts.body);
  assert(products.length >= 6, 'Must return at least 6 products');
  console.log(`   ✓ 200 OK: Retrieved ${products.length} published products.`);

  // Test 2: Protected /admin without auth redirects to /login
  console.log('2. Testing Protected /admin route without credentials...');
  const resAdminUnauth = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/admin',
    method: 'GET'
  });
  assert.strictEqual(resAdminUnauth.statusCode, 302);
  assert(resAdminUnauth.headers.location.startsWith('/login'), 'Must redirect to /login');
  console.log(`   ✓ 302 Redirect: Protected /admin redirects unauthenticated user to ${resAdminUnauth.headers.location}`);

  // Test 3: Failed Login Attempt
  console.log('3. Testing POST /api/auth/login with invalid password...');
  const resFailedLogin = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@whitemist.com', password: 'InvalidPassword!' });
  assert.strictEqual(resFailedLogin.statusCode, 401);
  console.log('   ✓ 401 Unauthorized: Invalid password rejected correctly.');

  // Test 4: Successful Admin Login
  console.log('4. Testing POST /api/auth/login with valid credentials...');
  const resLogin = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@whitemist.com', password: 'WhiteMist@Admin2026!' });
  assert.strictEqual(resLogin.statusCode, 200);
  const loginBody = JSON.parse(resLogin.body);
  assert(loginBody.token, 'Response must include JWT session token');
  assert(resLogin.headers['set-cookie'], 'Response must set wm_admin_token cookie');
  const token = loginBody.token;
  const cookie = resLogin.headers['set-cookie'][0];
  console.log('   ✓ 200 OK: Authenticated successfully, received token and HttpOnly cookie.');

  // Test 5: Access Protected /api/admin/stats with Bearer Token
  console.log('5. Testing GET /api/admin/stats with Bearer token...');
  const resStats = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(resStats.statusCode, 200);
  const stats = JSON.parse(resStats.body);
  assert(stats.totalProducts > 0);
  assert(stats.totalOrders > 0);
  console.log(`   ✓ 200 OK: Accessed admin metrics: ${stats.totalProducts} products, ${stats.totalOrders} orders, revenue ₹${stats.totalRevenue}`);

  // Test 6: Access Protected /admin with HttpOnly Cookie
  console.log('6. Testing GET /admin with session cookie...');
  const resAdminAuth = await makeRequest({
    hostname: '127.0.0.1',
    port: 3088,
    path: '/admin',
    method: 'GET',
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  assert.strictEqual(resAdminAuth.statusCode, 200);
  assert(resAdminAuth.body.includes('Admin Dashboard'), 'Must serve admin.html page');
  console.log('   ✓ 200 OK: Admin portal successfully served to authenticated admin.');

  console.log('\n========================================================');
  console.log('  ALL HTTP INTEGRATION TESTS PASSED (100%)');
  console.log('========================================================\n');
  process.exit(0);
}

runHttpTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
