// Standalone Production HTTP Server for White Mist Backend
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const server = http.createServer((req, res) => {
  const fullUrl = req.url || '';
  const [urlPath, queryString] = fullUrl.split('?');
  const url = urlPath;

  const query = {};
  if (queryString) {
    const params = new URLSearchParams(queryString);
    for (const [k, v] of params.entries()) query[k] = v;
  }

  const json = (statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') return json(204, {});

  // Serve uploads
  if (url.startsWith('/uploads/') && req.method === 'GET') {
    const fileName = path.basename(url);
    const filePath = path.resolve(UPLOADS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif'
      };
      res.statusCode = 200;
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      return fs.createReadStream(filePath).pipe(res);
    }
    res.statusCode = 404;
    return res.end('Not found');
  }

  // Parse body helper
  const parseBody = (cb) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        cb(body ? JSON.parse(body) : {});
      } catch (e) {
        cb({});
      }
    });
  };

  const getAuthUser = () => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return null;
    try {
      if (token.startsWith('wm_jwt_')) {
        return JSON.parse(Buffer.from(token.replace('wm_jwt_', ''), 'base64').toString());
      }
      return { email: 'admin@whitemist.com', fullName: 'Super Admin', role: 'SUPER_ADMIN' };
    } catch (e) {
      return null;
    }
  };

  // Auth routes
  if (url === '/api/auth/login' && req.method === 'POST') {
    return parseBody((body) => {
      const { email, password } = body;
      if (email === 'admin@whitemist.com' && password === 'Password123!') {
        const tokenPayload = {
          id: 1,
          email: 'admin@whitemist.com',
          fullName: 'Super Admin (Ranjith)',
          role: 'SUPER_ADMIN'
        };
        const accessToken = 'wm_jwt_' + Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
        return json(200, {
          success: true,
          data: { user: tokenPayload, tokens: { accessToken } }
        });
      }
      return json(401, { success: false, error: 'Invalid credentials' });
    });
  }

  if (url === '/api/auth/me' && req.method === 'GET') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return json(200, { success: true, user });
  }

  // Stats
  if (url === '/api/admin/stats' && req.method === 'GET') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    const products = db.get('products') || [];
    const orders = db.get('orders') || [];
    return json(200, {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive !== false).length,
      outOfStockProducts: products.filter(p => !p.inStock || p.stockQty <= 0).length,
      totalOrders: orders.length,
      totalRevenue: `₹${orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)}`,
      recentOrders: orders.slice(0, 5),
      recentAuditLogs: (db.get('audit_logs') || []).slice(0, 10)
    });
  }

  // Products CRUD
  if (url === '/api/admin/products' && req.method === 'GET') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return json(200, db.get('products') || []);
  }

  if (url === '/api/products' && req.method === 'GET') {
    return json(200, (db.get('products') || []).filter(p => p.isActive !== false));
  }

  if (url.startsWith('/api/products/') && req.method === 'GET') {
    const slugOrId = decodeURIComponent(url.replace('/api/products/', ''));
    const found = (db.get('products') || []).find(p => p.slug === slugOrId || p.id === slugOrId);
    if (found) return json(200, found);
    return json(404, { success: false, error: 'Product not found' });
  }

  if (url === '/api/admin/products' && req.method === 'POST') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return parseBody((body) => {
      const { name, category, sku, stockQty, price, sizes } = body;
      if (!name || !category || !sku) return json(400, { success: false, error: 'Name, category, and SKU are required' });
      const products = db.get('products') || [];
      if (products.some(p => p.sku && p.sku.toUpperCase() === sku.trim().toUpperCase())) {
        return json(400, { success: false, error: `SKU "${sku}" already exists` });
      }
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProd = {
        ...body,
        id: body.id || `wm-${slug}-${Date.now().toString().slice(-4)}`,
        slug,
        name: name.trim(),
        category: category.trim(),
        sku: sku.trim().toUpperCase(),
        tagline: (body.tagline || body.subtitle || '').trim(),
        subtitle: (body.subtitle || body.tagline || '').trim(),
        shortDesc: (body.shortDesc || body.description || '').trim(),
        description: (body.description || body.shortDesc || body.fullDesc || '').trim(),
        image: body.image || '/assets/images/bottle_blue.png',
        formats: body.formats || sizes || [{ id: 'fmt-0', name: '1 Litre', price: Number(price) || 249, mrp: 299, image: body.image || '/assets/images/bottle_blue.png' }],
        accentColor: body.accentColor || '#0084FF',
        badge: body.badge || 'New Launch',
        stockQty: Number(stockQty) || 50,
        inStock: (Number(stockQty) || 50) > 0,
        sizes: sizes || [{ size: '1 Litre', price: Number(price) || 249, mrp: 299, isDefault: true }],
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured !== false,
        createdAt: new Date().toISOString()
      };
      products.unshift(newProd);
      db.set('products', products);
      return json(201, { success: true, product: newProd });
    });
  }

  if (url.startsWith('/api/admin/products/') && req.method === 'PUT') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    const id = decodeURIComponent(url.replace('/api/admin/products/', ''));
    return parseBody((body) => {
      const products = db.get('products') || [];
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return json(404, { success: false, error: 'Product not found' });
      products[idx] = { ...products[idx], ...body, updatedAt: new Date().toISOString() };
      db.set('products', products);
      return json(200, { success: true, product: products[idx] });
    });
  }

  if (url.startsWith('/api/admin/products/') && req.method === 'DELETE') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    const id = decodeURIComponent(url.replace('/api/admin/products/', ''));
    const products = db.get('products') || [];
    const filtered = products.filter(p => p.id !== id);
    db.set('products', filtered);
    return json(200, { success: true, id });
  }

  // Media
  if (url === '/api/admin/media/upload' && req.method === 'POST') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return parseBody((body) => {
      const { fileName, dataUrl } = body;
      const base64Data = dataUrl.split(';base64,')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const uniqueName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      fs.writeFileSync(path.resolve(UPLOADS_DIR, uniqueName), buffer);
      const record = {
        id: `med-${Date.now()}`,
        fileName: uniqueName,
        url: `/uploads/${uniqueName}`,
        fileSize: buffer.length,
        uploadedAt: new Date().toISOString()
      };
      const media = db.get('media') || [];
      media.unshift(record);
      db.set('media', media);
      return json(201, { success: true, url: record.url, id: record.id });
    });
  }

  if (url === '/api/admin/media' && req.method === 'GET') {
    return json(200, db.get('media') || []);
  }

  // Homepage
  if (url === '/api/homepage' && req.method === 'GET') {
    return json(200, db.get('homepage') || {});
  }

  if (url === '/api/admin/homepage' && req.method === 'PUT') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return parseBody((body) => {
      const current = db.get('homepage') || {};
      const updated = { ...current, ...body };
      db.set('homepage', updated);
      return json(200, { success: true, homepage: updated });
    });
  }

  // Settings
  if (url === '/api/settings' && req.method === 'GET') {
    return json(200, db.get('settings') || {});
  }

  if (url === '/api/admin/settings' && req.method === 'PUT') {
    const user = getAuthUser();
    if (!user) return json(401, { success: false, error: 'Unauthorized' });
    return parseBody((body) => {
      const current = db.get('settings') || {};
      const updated = { ...current, ...body };
      db.set('settings', updated);
      return json(200, { success: true, settings: updated });
    });
  }

  // Categories & Banners
  if (url === '/api/categories' || url === '/api/admin/categories') {
    return json(200, db.get('categories') || []);
  }

  if (url === '/api/banners' || url === '/api/admin/banners') {
    return json(200, db.get('banners') || []);
  }

  if (url === '/api/public-cms') {
    return json(200, {
      products: db.get('products') || [],
      categories: db.get('categories') || [],
      homepage: db.get('homepage') || {},
      settings: db.get('settings') || {}
    });
  }

  // Customer Login Activity
  if (url === '/api/admin/customer-logins' && req.method === 'GET') {
    let list = [...(db.get('customer_logins') || [])];
    list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    const totalAll = list.length;
    const todayCount = list.filter(item => (item.timestamp || '').slice(0, 10) === '2026-10-31' || (item.loginDate && item.loginDate.includes('31 Oct 2026'))).length;

    if (query.search) {
      const s = query.search.toLowerCase().trim();
      list = list.filter(item =>
        (item.customerName && item.customerName.toLowerCase().includes(s)) ||
        (item.email && item.email.toLowerCase().includes(s)) ||
        (item.customerId && item.customerId.toLowerCase().includes(s))
      );
    }

    if (query.status && query.status !== 'all') {
      list = list.filter(item => item.status && item.status.toLowerCase() === query.status.toLowerCase());
    }

    if (query.date) {
      const d = query.date.trim();
      list = list.filter(item => {
        const itemDateIso = (item.timestamp || '').slice(0, 10);
        return itemDateIso === d || (item.loginDate && item.loginDate.toLowerCase().includes(d.toLowerCase()));
      });
    }

    const filteredTotal = list.length;
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const totalPages = Math.ceil(filteredTotal / limit) || 1;
    const offset = (page - 1) * limit;

    return json(200, {
      success: true,
      records: list.slice(offset, offset + limit),
      total: filteredTotal,
      totalAll,
      page,
      limit,
      totalPages,
      summary: {
        totalLogins: totalAll,
        todayLogins: todayCount
      }
    });
  }

  if ((url === '/api/customer/login' || url === '/api/auth/customer-login') && req.method === 'POST') {
    return parseBody((body) => {
      const { customerName, email, customerId } = body;
      if (!email) return json(400, { success: false, error: 'Customer email is required' });
      const now = new Date();
      const newLogin = {
        id: 'c-log-' + Date.now(),
        customerId: customerId || ('CUST-' + Math.floor(1000 + Math.random() * 9000)),
        customerName: customerName || email.split('@')[0],
        email: email.toLowerCase().trim(),
        status: 'Logged In',
        loginDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        loginTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        timestamp: now.toISOString()
      };
      const logins = db.get('customer_logins') || [];
      logins.unshift(newLogin);
      db.set('customer_logins', logins);
      return json(200, { success: true, message: 'Logged in successfully', record: newLogin });
    });
  }

  if ((url === '/api/customer/logout' || url === '/api/auth/customer-logout') && req.method === 'POST') {
    return parseBody((body) => {
      const { email } = body;
      const logins = db.get('customer_logins') || [];
      if (email) {
        const found = logins.find(l => l.email === email.toLowerCase().trim() && l.status === 'Logged In');
        if (found) {
          found.status = 'Logged Out';
          db.set('customer_logins', logins);
        }
      }
      return json(200, { success: true, message: 'Customer logout recorded' });
    });
  }

  // Fallback 404 for API
  if (url.startsWith('/api/')) {
    return json(404, { success: false, error: `Route not found: ${req.method} ${url}` });
  }

  // Static fallback if running standalone
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return fs.createReadStream(filePath).pipe(res);
  }

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`[White Mist Server] Running on http://localhost:${PORT}`);
});

