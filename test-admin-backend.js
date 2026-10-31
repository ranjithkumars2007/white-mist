// Integration test suite for White Mist Admin Backend and CRUD Operations
const BASE_URL = 'http://localhost:5173';

async function runTests() {
  console.log('====================================================');
  console.log('   WHITE MIST ADMIN BACKEND INTEGRATION TEST SUITE  ');
  console.log('====================================================\n');

  let token = '';
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, testName, details = '') {
    totalCount++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION & SECURITY
    // -------------------------------------------------------------------------
    console.log('--- TEST GROUP 1: AUTHENTICATION & SECURITY ---');

    // 1.1 Unauthorized access check
    const unauthRes = await fetch(`${BASE_URL}/api/admin/products`);
    assert(unauthRes.status === 401, 'Unauthorized request without token returns HTTP 401', `Status: ${unauthRes.status}`);

    // 1.2 Invalid credentials check
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@whitemist.com', password: 'WrongPassword!' })
    });
    assert(badLoginRes.status === 401, 'Invalid password returns HTTP 401', `Status: ${badLoginRes.status}`);

    // 1.3 Successful login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@whitemist.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.data?.tokens?.accessToken, 'Super admin login returns HTTP 200 and JWT accessToken');
    token = loginData.data.tokens.accessToken;

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 1.4 Auth verify /api/auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user?.email === 'admin@whitemist.com', 'GET /api/auth/me verifies valid admin session');

    // -------------------------------------------------------------------------
    // 2. STATS & DASHBOARD
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: DASHBOARD STATS ---');
    const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeaders });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.totalProducts >= 6, `GET /api/admin/stats returns valid metrics (Products: ${statsData.totalProducts}, Orders: ${statsData.totalOrders})`);

    // -------------------------------------------------------------------------
    // 3. PRODUCT MANAGEMENT (CRUD)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: PRODUCT MANAGEMENT (CRUD) ---');

    // 3.1 Initial products count
    const listRes = await fetch(`${BASE_URL}/api/admin/products`, { headers: authHeaders });
    const initialProducts = await listRes.json();
    assert(Array.isArray(initialProducts) && initialProducts.length >= 6, `GET /api/admin/products returns persistent products (Count: ${initialProducts.length})`);

    // 3.2 Create new product
    const testSku = 'WM-TEST-POD-' + Date.now().toString().slice(-4);
    const newProdPayload = {
      name: 'White Mist Ultra Bio-Action Detergent Pods',
      category: 'Daily Wash Liquid',
      sku: testSku,
      subtitle: 'Concentrated Single-Dose Laundry Pods',
      price: 399,
      mrp: 499,
      stockQty: 85,
      fragrance: 'Crisp Mountain Breeze',
      shortDesc: 'Pre-measured soluble pods with triple active enzyme action.',
      sizes: [
        { size: '30 Pods Box', price: 399, mrp: 499, isDefault: true },
        { size: '60 Pods Value Tub', price: 749, mrp: 949, isDefault: false }
      ]
    };

    const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(newProdPayload)
    });
    const createData = await createRes.json();
    assert(createRes.status === 201 && createData.product?.sku === testSku, `POST /api/admin/products creates product persistently with HTTP 201 (SKU: ${testSku})`);
    const createdId = createData.product?.id;

    // 3.3 SKU Uniqueness check
    const duplicateSkuRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ ...newProdPayload, name: 'Duplicate SKU Product' })
    });
    const dupData = await duplicateSkuRes.json();
    assert(duplicateSkuRes.status === 400 && dupData.error.includes('already exists'), 'Duplicate SKU is rejected with HTTP 400 and clear error message');

    // 3.4 Edit/Update product
    const updateRes = await fetch(`${BASE_URL}/api/admin/products/${createdId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        stockQty: 120,
        subtitle: 'Updated Subtitle: Commercial Grade Bio Pods',
        badge: 'Top Rated'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.product?.stockQty === 120 && updateData.product?.badge === 'Top Rated', 'PUT /api/admin/products/:id updates product fields and persists to disk');

    // 3.5 Verify single product public read
    const getSingleRes = await fetch(`${BASE_URL}/api/products/${createdId}`);
    const singleData = await getSingleRes.json();
    assert(getSingleRes.status === 200 && singleData.stockQty === 120, 'GET /api/products/:slugOrId retrieves updated product from persistent database');

    // 3.6 Delete product
    const delRes = await fetch(`${BASE_URL}/api/admin/products/${createdId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delRes.status === 200, 'DELETE /api/admin/products/:id deletes product with HTTP 200');

    // 3.7 Verify product is deleted
    const verifyDelRes = await fetch(`${BASE_URL}/api/products/${createdId}`);
    assert(verifyDelRes.status === 404, 'Verified deleted product returns HTTP 404');

    // -------------------------------------------------------------------------
    // 4. ASSET & IMAGE UPLOADS
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: ASSET & IMAGE UPLOADS ---');

    // 1x1 transparent PNG in base64
    const samplePngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const testFileName = `test_upload_${Date.now()}.png`;

    const uploadRes = await fetch(`${BASE_URL}/api/admin/media/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fileName: testFileName,
        dataUrl: samplePngBase64
      })
    });
    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 201 && uploadData.url.startsWith('/uploads/'), `POST /api/admin/media/upload saves image to disk and returns asset URL (URL: ${uploadData.url})`);

    // Verify static serving
    const staticServeRes = await fetch(`${BASE_URL}${uploadData.url}`);
    assert(staticServeRes.status === 200 && staticServeRes.headers.get('content-type')?.includes('image/png'), `GET ${uploadData.url} statically serves uploaded image with HTTP 200`);

    // Verify listed in media
    const mediaListRes = await fetch(`${BASE_URL}/api/admin/media`, { headers: authHeaders });
    const mediaList = await mediaListRes.json();
    assert(mediaList.some(m => m.id === uploadData.id), 'Uploaded asset is registered in persistent media library');

    // Clean up uploaded test media
    const delMediaRes = await fetch(`${BASE_URL}/api/admin/media/${uploadData.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delMediaRes.status === 200, 'DELETE /api/admin/media/:id successfully removes asset from library and disk');

    // -------------------------------------------------------------------------
    // 5. HOMEPAGE CONTENT MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: HOMEPAGE CONTENT MANAGEMENT ---');

    const getHpRes = await fetch(`${BASE_URL}/api/homepage`);
    const initialHp = await getHpRes.json();
    assert(getHpRes.status === 200 && initialHp.hero?.headline, 'GET /api/homepage retrieves live homepage content');

    const updatedHeadline = 'White Mist Bio-Enzyme Technology • Next-Gen Laundry Care';
    const putHpRes = await fetch(`${BASE_URL}/api/admin/homepage`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        hero: { headline: updatedHeadline },
        brandIntro: { heading: 'Engineered For Pure Fabric Longevity' }
      })
    });
    const putHpData = await putHpRes.json();
    assert(putHpRes.status === 200 && putHpData.homepage?.hero?.headline === updatedHeadline, 'PUT /api/admin/homepage updates homepage sections with HTTP 200');

    // Verify public homepage endpoint reflects change
    const verifyHpRes = await fetch(`${BASE_URL}/api/homepage`);
    const verifiedHp = await verifyHpRes.json();
    assert(verifiedHp.hero?.headline === updatedHeadline, 'Public /api/homepage endpoint immediately reflects published updates');

    // -------------------------------------------------------------------------
    // 6. STORE SETTINGS & ANNOUNCEMENTS
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 6: STORE SETTINGS & ANNOUNCEMENTS ---');

    const newAnnouncement = '✦ SPECIAL LAUNDRY OFFER • FLAT 25% OFF FAMILY COMBOS ✦';
    const putSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        announcementBarText: newAnnouncement,
        announcementBarEnabled: true,
        freeShippingThreshold: 599
      })
    });
    assert(putSettingsRes.status === 200, 'PUT /api/admin/settings persists store settings and announcement bar text');

    const getSettingsRes = await fetch(`${BASE_URL}/api/settings`);
    const settingsData = await getSettingsRes.json();
    assert(settingsData.announcementBarText === newAnnouncement && settingsData.freeShippingThreshold === 599, 'GET /api/settings returns updated announcement bar and shipping thresholds');

    // -------------------------------------------------------------------------
    // 7. PUBLIC STOREFRONT & HYDRATION
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 7: PUBLIC STOREFRONT & HYDRATION ---');

    const cmsRes = await fetch(`${BASE_URL}/api/public-cms`);
    const cmsData = await cmsRes.json();
    assert(cmsRes.status === 200 && cmsData.products.length >= 6 && cmsData.homepage && cmsData.settings, 'GET /api/public-cms returns complete dynamic bundle for instant hydration');

    const storefrontRes = await fetch(`${BASE_URL}/`);
    assert(storefrontRes.status === 200, 'GET / (Customer Storefront) serves HTTP 200');

    const adminHtmlRes = await fetch(`${BASE_URL}/admin.html`);
    assert(adminHtmlRes.status === 200, 'GET /admin.html (Admin Portal) serves HTTP 200');

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passedCount} / ${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
    console.log('====================================================');

    if (passedCount === totalCount) {
      console.log('\n>>> ALL ADMIN BACKEND AND CRUD OPERATIONS ARE 100% WORKING! <<<');
      process.exit(0);
    } else {
      console.error('\n>>> SOME TESTS FAILED <<<');
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

runTests();

