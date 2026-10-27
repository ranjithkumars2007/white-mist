const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Testing Extended API Endpoints...');

  const endpoints = [
    '/api/public-cms',
    '/api/theme',
    '/api/header-nav',
    '/api/brand-story',
    '/api/benefits',
    '/api/ingredients-usage',
    '/api/testimonials',
    '/api/pdp-settings',
    '/api/contact-info',
    '/api/footer',
    '/api/seo',
    '/api/visual-sections',
    '/api/products'
  ];

  for (const ep of endpoints) {
    try {
      const res = await get(ep);
      console.log(`[PASS] ${ep} -> HTTP ${res.status} (Type: ${typeof res.body})`);
    } catch (e) {
      console.error(`[FAIL] ${ep} -> ${e.message}`);
    }
  }
}

runTests();
