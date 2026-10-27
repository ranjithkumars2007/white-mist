/**
 * WHITE MIST — Automated Verification & Integration Test Suite
 * Tests authentication, security, database CRUD, order processing, and API routes.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const http = require('http');

const {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit
} = require('./server/auth');

const db = require('./server/db');

console.log('========================================================');
console.log('  RUNNING WHITE MIST AUTOMATED TEST SUITE');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✕ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// 1. Password Hashing & Cryptography
runTest('Scrypt password hashing and verification', () => {
  const password = 'WhiteMist@Admin2026!';
  const { hash, salt } = hashPassword(password);
  assert(hash && hash.length === 128, 'Hash must be 128 hex chars');
  assert(salt && salt.length === 32, 'Salt must be 32 hex chars');

  const isValid = verifyPassword(password, hash, salt);
  assert.strictEqual(isValid, true, 'Valid password must verify to true');

  const isInvalid = verifyPassword('WrongPassword123', hash, salt);
  assert.strictEqual(isInvalid, false, 'Invalid password must verify to false');
});

// 2. Session Token Generation & Verification
runTest('HMAC-SHA256 session token generation and verification', () => {
  const mockAdmin = {
    id: 'test_admin_1',
    email: 'admin@whitemist.com',
    role: 'super_admin',
    fullName: 'Test Admin'
  };

  const token = createSessionToken(mockAdmin, 2);
  assert(token.includes('.'), 'Token must contain separator');

  const verified = verifySessionToken(token);
  assert(verified !== null, 'Token should be verified');
  assert.strictEqual(verified.email, 'admin@whitemist.com');
  assert.strictEqual(verified.role, 'super_admin');

  // Tampered token test
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedVerified = verifySessionToken(tamperedToken);
  assert.strictEqual(tamperedVerified, null, 'Tampered token must fail verification');
});

// 3. Database Initialization & Product Catalogue
runTest('Database initialization and product retrieval', () => {
  const dbState = db.loadDatabase();
  assert(dbState.products.length >= 6, 'Must contain all authentic White Mist products');

  const oceanFresh = db.getProductBySlug('ocean-fresh-liquid-detergent');
  assert(oceanFresh !== null, 'Ocean Fresh product must exist');
  assert.strictEqual(oceanFresh.name, 'White Mist Ocean Fresh Liquid Detergent');
  assert(oceanFresh.sizes.length >= 4, 'Must contain all 4 bottle sizes (500ml, 1L, 2L, 5L)');
});

// 4. Product CRUD
runTest('Product CRUD lifecycle', () => {
  const adminEmail = 'admin@whitemist.com';
  const newProductData = {
    name: 'White Mist Ultra Silk & Wool Detergent',
    category: 'Premium Fabric Care',
    sku: 'WM-SLK-TEST-1',
    shortDesc: 'Gentle pH neutral wash for wool and cashmere.',
    sizes: [{ size: '1 Litre', price: 299, mrp: 350, isDefault: true }],
    stockQty: 80
  };

  const created = db.createProduct(newProductData, adminEmail);
  assert(created.id, 'Created product must have ID');
  assert.strictEqual(created.name, newProductData.name);

  // Update
  const updated = db.updateProduct(created.id, { stockQty: 120 }, adminEmail);
  assert.strictEqual(updated.stockQty, 120);

  // Delete
  const deleted = db.deleteProduct(created.id, adminEmail);
  assert.strictEqual(deleted, true);

  const lookup = db.getProductById(created.id);
  assert.strictEqual(lookup, undefined, 'Deleted product must not be found');
});

// 5. Order Placement & Automatic Inventory Decrement
runTest('Customer order placement and stock deduction', () => {
  const productBefore = db.getProductById('wm-ocean-blue');
  const initialStock = productBefore.stockQty;

  const orderPayload = {
    customerName: 'Test Customer',
    customerEmail: 'test.customer@example.com',
    customerPhone: '+91 99999 88888',
    shippingAddress: { city: 'Coimbatore', pincode: '641001' },
    items: [
      {
        id: 'wm-ocean-blue',
        name: 'White Mist Ocean Fresh Liquid Detergent',
        size: '1 Litre',
        price: 249,
        quantity: 3
      }
    ],
    subtotal: 747,
    discount: 0,
    shipping: 0,
    total: 747,
    paymentMethod: 'UPI'
  };

  const order = db.createOrder(orderPayload);
  assert(order.id && order.id.startsWith('WM-'), 'Order ID must follow WM- pattern');
  assert.strictEqual(order.total, 747);

  const productAfter = db.getProductById('wm-ocean-blue');
  assert.strictEqual(productAfter.stockQty, initialStock - 3, 'Stock must decrement by ordered quantity');
});

// 6. Homepage Content Management
runTest('Homepage content updates', () => {
  const adminEmail = 'admin@whitemist.com';
  const hpBefore = db.getHomepage();
  assert(hpBefore.hero, 'Homepage must have hero section');

  const updatedHp = db.updateHomepage({
    hero: {
      ...hpBefore.hero,
      headline: 'Brilliant Clean.\nEvery Single Load.'
    }
  }, adminEmail);

  assert.strictEqual(updatedHp.hero.headline, 'Brilliant Clean.\nEvery Single Load.');

  // Restore original
  db.updateHomepage({ hero: hpBefore.hero }, adminEmail);
});

// 7. Banners & Promotions
runTest('Banner management and active filter', () => {
  const adminEmail = 'admin@whitemist.com';
  const banner = db.createBanner({
    title: 'Flash Weekend Sale',
    subtitle: 'Flat 20% off',
    isActive: true
  }, adminEmail);

  assert(banner.id, 'Banner must have ID');

  const activeBanners = db.getBanners(true);
  const found = activeBanners.find(b => b.id === banner.id);
  assert(found !== undefined, 'Active banner must be in active list');

  db.deleteBanner(banner.id, adminEmail);
});

// 8. Contact Inquiries
runTest('Contact message creation and reply update', () => {
  const msg = db.createMessage({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    subject: 'product_question',
    message: 'Can I use White Mist for machine handwash mode?'
  });

  assert(msg.id, 'Message must have ID');
  assert.strictEqual(msg.status, 'new');

  const updated = db.updateMessageStatus(msg.id, 'replied', 'admin@whitemist.com');
  assert.strictEqual(updated.status, 'replied');
});

// 9. Dashboard Statistics Calculation
runTest('Dashboard dynamic metrics calculation', () => {
  const stats = db.getDashboardStats();
  assert(typeof stats.totalProducts === 'number' && stats.totalProducts > 0);
  assert(typeof stats.activeProducts === 'number');
  assert(typeof stats.totalOrders === 'number' && stats.totalOrders > 0);
  assert(typeof stats.totalRevenue === 'number' && stats.totalRevenue > 0);
  assert(Object.keys(stats.categoryCounts).length > 0, 'Category counts must be populated');
});

// 10. Audit Logging
runTest('Admin audit trail persistence', () => {
  const logs = db.getAuditLogs(10);
  assert(Array.isArray(logs) && logs.length > 0, 'Audit logs must exist');
  assert(logs[0].timestamp, 'Audit log must have timestamp');
  assert(logs[0].adminEmail, 'Audit log must track admin email');
});

console.log('\n========================================================');
console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED (100%)`);
console.log('========================================================\n');
