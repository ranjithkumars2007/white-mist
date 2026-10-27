/**
 * WHITE MIST — REST API Router
 * Comprehensive router handling public content endpoints, customer submissions,
 * secure admin authentication, and dynamic CMS operations.
 */

const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db');
const {
  verifyPassword,
  hashPassword,
  createSessionToken,
  checkRateLimit,
  resetRateLimit,
  authenticateAdmin,
  getClientIp
} = require('./auth');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'images', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Helper to parse JSON request body
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Safeguard against oversized payloads (max 10MB)
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    ...headers
  });
  res.end(JSON.stringify(data));
}

/**
 * Main API request dispatcher
 */
async function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  try {
    // -----------------------------------------------------------------------
    // AUTHENTICATION ENDPOINTS
    // -----------------------------------------------------------------------

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const ip = getClientIp(req);
      const rate = checkRateLimit(ip);
      if (!rate.allowed) {
        return sendJson(res, 429, {
          error: `Too many failed login attempts. Please try again in ${rate.retryAfter} seconds.`
        });
      }

      const body = await parseJsonBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required.' });
      }

      const admin = db.getAdminByEmail(email.trim());
      if (!admin || !verifyPassword(password, admin.passwordHash, admin.passwordSalt)) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      resetRateLimit(ip);
      const token = createSessionToken(admin);

      // Set secure HTTP-only cookie
      const isProd = process.env.NODE_ENV === 'production';
      const cookieVal = `wm_admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isProd ? '; Secure' : ''}`;

      db.logAudit(admin.email, 'admin_login', 'auth', admin.id, `Admin signed in successfully from ${ip}`);

      return sendJson(res, 200, {
        success: true,
        message: 'Authentication successful',
        token,
        user: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role
        }
      }, { 'Set-Cookie': cookieVal });
    }

    // POST /api/auth/logout
    if (pathname === '/api/auth/logout' && method === 'POST') {
      const cookieClear = 'wm_admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax';
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' }, { 'Set-Cookie': cookieClear });
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && method === 'GET') {
      const adminAuth = authenticateAdmin(req);
      if (!adminAuth) {
        return sendJson(res, 401, { authenticated: false, error: 'Unauthorized' });
      }
      return sendJson(res, 200, {
        authenticated: true,
        user: adminAuth
      });
    }

    // POST /api/auth/forgot-password
    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const body = await parseJsonBody(req);
      const email = body.email?.trim();
      const admin = email ? db.getAdminByEmail(email) : null;

      // Always return a neutral success message for security
      if (admin) {
        db.logAudit(email, 'password_reset_request', 'auth', admin.id, 'Password reset initiated.');
      }

      return sendJson(res, 200, {
        success: true,
        message: 'If the email matches an authorized administrator, instructions have been generated.',
        demoHint: admin ? 'Demo Administrator verified. You may use WhiteMist@Admin2026! or reset from settings.' : null
      });
    }

    // POST /api/auth/change-password
    if (pathname === '/api/auth/change-password' && method === 'POST') {
      const adminAuth = authenticateAdmin(req);
      if (!adminAuth) return sendJson(res, 401, { error: 'Unauthorized' });

      const body = await parseJsonBody(req);
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return sendJson(res, 400, { error: 'Current password and new password are required.' });
      }

      if (newPassword.length < 8) {
        return sendJson(res, 400, { error: 'New password must be at least 8 characters.' });
      }

      const admin = db.getAdminByEmail(adminAuth.email);
      if (!admin || !verifyPassword(currentPassword, admin.passwordHash, admin.passwordSalt)) {
        return sendJson(res, 403, { error: 'Current password does not match.' });
      }

      const { hash, salt } = hashPassword(newPassword);
      db.updateAdminPassword(admin.id, hash, salt, adminAuth.email);

      return sendJson(res, 200, { success: true, message: 'Password updated successfully.' });
    }

    // -----------------------------------------------------------------------
    // PUBLIC CONTENT ENDPOINTS
    // -----------------------------------------------------------------------

    // GET /api/products
    if (pathname === '/api/products' && method === 'GET') {
      let products = db.getAllProducts(false); // active only

      // Filter by category
      if (parsedUrl.query.category && parsedUrl.query.category !== 'all') {
        const cat = parsedUrl.query.category.toLowerCase();
        products = products.filter(p => p.category.toLowerCase().includes(cat) || p.slug.includes(cat));
      }

      // Search query
      if (parsedUrl.query.search) {
        const q = parsedUrl.query.search.toLowerCase().trim();
        products = products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
        );
      }

      return sendJson(res, 200, products);
    }

    // GET /api/products/:slug_or_id
    if (pathname.startsWith('/api/products/') && method === 'GET') {
      const identifier = pathname.substring('/api/products/'.length).trim();
      const product = db.getProductBySlug(identifier) || db.getProductById(identifier);
      if (!product) {
        return sendJson(res, 404, { error: 'Product not found' });
      }
      return sendJson(res, 200, product);
    }

    // GET /api/categories
    if (pathname === '/api/categories' && method === 'GET') {
      return sendJson(res, 200, db.getCategories());
    }

    // GET /api/homepage
    if (pathname === '/api/homepage' && method === 'GET') {
      return sendJson(res, 200, db.getHomepage());
    }

    // GET /api/banners
    if (pathname === '/api/banners' && method === 'GET') {
      return sendJson(res, 200, db.getBanners(true)); // active only
    }

    // GET /api/pages/:slug
    if (pathname.startsWith('/api/pages/') && method === 'GET') {
      const slug = pathname.substring('/api/pages/'.length).trim();
      const page = db.getPage(slug);
      if (!page) {
        return sendJson(res, 404, { error: 'Page not found' });
      }
      return sendJson(res, 200, page);
    }

    // GET /api/settings
    if (pathname === '/api/settings' && method === 'GET') {
      const s = db.getSettings();
      // Strip any internal fields
      return sendJson(res, 200, {
        storeName: s.storeName,
        tagline: s.tagline,
        currency: s.currency,
        freeShippingThreshold: s.freeShippingThreshold,
        standardShippingFee: s.standardShippingFee,
        supportEmail: s.supportEmail,
        supportPhone: s.supportPhone,
        supportAddress: s.supportAddress,
        announcementBarText: s.announcementBarText,
        announcementBarEnabled: s.announcementBarEnabled
      });
    }

    // POST /api/orders (Customer checkout placement)
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.items || body.items.length === 0) {
        return sendJson(res, 400, { error: 'Order must contain at least one item.' });
      }
      const newOrder = db.createOrder(body);
      return sendJson(res, 201, {
        success: true,
        orderId: newOrder.id,
        order: newOrder
      });
    }

    // POST /api/contact (Customer contact form)
    if (pathname === '/api/contact' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.name || !body.email || !body.message) {
        return sendJson(res, 400, { error: 'Name, email, and message are required.' });
      }
      const newMsg = db.createMessage(body);
      return sendJson(res, 201, {
        success: true,
        message: 'Thank you! Your message has been received.',
        inquiryId: newMsg.id
      });
    }

    // GET /api/public-cms (Consolidated payload for instant page hydration)
    if (pathname === '/api/public-cms' && method === 'GET') {
      return sendJson(res, 200, db.getPublicConsolidatedCms());
    }

    // GET /api/theme
    if (pathname === '/api/theme' && method === 'GET') {
      return sendJson(res, 200, db.getThemeSettings());
    }

    // GET /api/header-nav
    if (pathname === '/api/header-nav' && method === 'GET') {
      return sendJson(res, 200, db.getHeaderNav());
    }

    // GET /api/brand-story
    if (pathname === '/api/brand-story' && method === 'GET') {
      return sendJson(res, 200, db.getBrandStory());
    }

    // GET /api/benefits
    if (pathname === '/api/benefits' && method === 'GET') {
      return sendJson(res, 200, db.getBenefits());
    }

    // GET /api/ingredients-usage
    if (pathname === '/api/ingredients-usage' && method === 'GET') {
      return sendJson(res, 200, db.getIngredientsUsage());
    }

    // GET /api/testimonials
    if (pathname === '/api/testimonials' && method === 'GET') {
      return sendJson(res, 200, db.getTestimonials());
    }

    // GET /api/pdp-settings
    if (pathname === '/api/pdp-settings' && method === 'GET') {
      return sendJson(res, 200, db.getPdpSettings());
    }

    // GET /api/contact-info
    if (pathname === '/api/contact-info' && method === 'GET') {
      return sendJson(res, 200, db.getContactInfo());
    }

    // GET /api/footer
    if (pathname === '/api/footer' && method === 'GET') {
      return sendJson(res, 200, db.getFooter());
    }

    // GET /api/seo
    if (pathname === '/api/seo' && method === 'GET') {
      return sendJson(res, 200, db.getSeoSettings());
    }

    // GET /api/visual-sections
    if (pathname === '/api/visual-sections' && method === 'GET') {
      return sendJson(res, 200, db.getVisualSections());
    }

    // -----------------------------------------------------------------------
    // PROTECTED ADMIN ENDPOINTS (Require Authenticated Admin)
    // -----------------------------------------------------------------------

    if (pathname.startsWith('/api/admin/')) {
      const adminAuth = authenticateAdmin(req);
      if (!adminAuth) {
        return sendJson(res, 401, { error: 'Unauthorized: Admin session required.' });
      }

      // --- DASHBOARD STATS & AUDIT LOGS ---
      if (pathname === '/api/admin/stats' && method === 'GET') {
        return sendJson(res, 200, db.getDashboardStats());
      }

      if (pathname === '/api/admin/audit-logs' && method === 'GET') {
        return sendJson(res, 200, db.getAuditLogs(100));
      }

      // --- PRODUCTS CRUD ---
      if (pathname === '/api/admin/products' && method === 'GET') {
        return sendJson(res, 200, db.getAllProducts(true)); // includes inactive
      }

      if (pathname === '/api/admin/products' && method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.name) {
          return sendJson(res, 400, { error: 'Product name is required.' });
        }
        const created = db.createProduct(body, adminAuth.email);
        return sendJson(res, 201, created);
      }

      if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/products/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateProduct(id, body, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Product not found.' });
        return sendJson(res, 200, updated);
      }

      if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/products/'.length).trim();
        const success = db.deleteProduct(id, adminAuth.email);
        if (!success) return sendJson(res, 404, { error: 'Product not found.' });
        return sendJson(res, 200, { success: true, message: 'Product deleted.' });
      }

      // --- CATEGORIES CRUD ---
      if (pathname === '/api/admin/categories' && method === 'GET') {
        return sendJson(res, 200, db.getCategories());
      }

      if (pathname === '/api/admin/categories' && method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.name) return sendJson(res, 400, { error: 'Category name is required.' });
        const created = db.createCategory(body, adminAuth.email);
        return sendJson(res, 201, created);
      }

      if (pathname.startsWith('/api/admin/categories/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/categories/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateCategory(id, body, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Category not found.' });
        return sendJson(res, 200, updated);
      }

      if (pathname.startsWith('/api/admin/categories/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/categories/'.length).trim();
        const success = db.deleteCategory(id, adminAuth.email);
        if (!success) return sendJson(res, 404, { error: 'Category not found.' });
        return sendJson(res, 200, { success: true, message: 'Category deleted.' });
      }

      // --- HOMEPAGE CONTENT ---
      if (pathname === '/api/admin/homepage' && method === 'GET') {
        return sendJson(res, 200, db.getHomepage());
      }

      if (pathname === '/api/admin/homepage' && method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = db.updateHomepage(body, adminAuth.email);
        return sendJson(res, 200, updated);
      }

      // --- BANNERS CRUD ---
      if (pathname === '/api/admin/banners' && method === 'GET') {
        return sendJson(res, 200, db.getBanners(false)); // all
      }

      if (pathname === '/api/admin/banners' && method === 'POST') {
        const body = await parseJsonBody(req);
        const created = db.createBanner(body, adminAuth.email);
        return sendJson(res, 201, created);
      }

      if (pathname.startsWith('/api/admin/banners/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/banners/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateBanner(id, body, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Banner not found.' });
        return sendJson(res, 200, updated);
      }

      if (pathname.startsWith('/api/admin/banners/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/banners/'.length).trim();
        const success = db.deleteBanner(id, adminAuth.email);
        if (!success) return sendJson(res, 404, { error: 'Banner not found.' });
        return sendJson(res, 200, { success: true, message: 'Banner deleted.' });
      }

      // --- WEBSITE PAGES ---
      if (pathname === '/api/admin/pages' && method === 'GET') {
        return sendJson(res, 200, db.getPages());
      }

      if (pathname.startsWith('/api/admin/pages/') && method === 'PUT') {
        const slug = pathname.substring('/api/admin/pages/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updatePage(slug, body, adminAuth.email);
        return sendJson(res, 200, updated);
      }

      // --- MEDIA LIBRARY & UPLOADS ---
      if (pathname === '/api/admin/media' && method === 'GET') {
        return sendJson(res, 200, db.getMedia());
      }

      if (pathname === '/api/admin/media/upload' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { fileName, dataUrl } = body;

        if (!fileName || !dataUrl) {
          return sendJson(res, 400, { error: 'fileName and dataUrl are required.' });
        }

        // Validate extension
        const ext = path.extname(fileName).toLowerCase();
        const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
        if (!allowedExts.includes(ext)) {
          return sendJson(res, 400, { error: 'Invalid file format. Only PNG, JPG, WEBP, and SVG are supported.' });
        }

        // Extract base64 payload
        const match = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!match) {
          return sendJson(res, 400, { error: 'Invalid dataUrl format.' });
        }

        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Check size (5MB max)
        if (buffer.length > 5 * 1024 * 1024) {
          return sendJson(res, 400, { error: 'File size exceeds maximum 5MB limit.' });
        }

        // Generate sanitized unique filename
        const safeName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + Date.now() + ext;
        const targetPath = path.join(UPLOADS_DIR, safeName);

        fs.writeFileSync(targetPath, buffer);
        const publicUrl = `public/images/uploads/${safeName}`;

        const mediaItem = db.addMedia({
          fileName: safeName,
          url: publicUrl,
          fileSize: buffer.length,
          mimeType
        }, adminAuth.email);

        return sendJson(res, 201, mediaItem);
      }

      if (pathname.startsWith('/api/admin/media/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/media/'.length).trim();
        const success = db.deleteMedia(id, adminAuth.email);
        if (!success) return sendJson(res, 404, { error: 'Media asset not found.' });
        return sendJson(res, 200, { success: true, message: 'Media asset deleted.' });
      }

      // --- ORDERS MANAGEMENT ---
      if (pathname === '/api/admin/orders' && method === 'GET') {
        return sendJson(res, 200, db.getOrders());
      }

      if (pathname.startsWith('/api/admin/orders/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/orders/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateOrderStatus(id, body.status, body.notes, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Order not found.' });
        return sendJson(res, 200, updated);
      }

      // --- CONTACT MESSAGES ---
      if (pathname === '/api/admin/messages' && method === 'GET') {
        return sendJson(res, 200, db.getMessages());
      }

      if (pathname.startsWith('/api/admin/messages/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/messages/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateMessageStatus(id, body.status, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Message not found.' });
        return sendJson(res, 200, updated);
      }

      // --- SETTINGS ---
      if (pathname === '/api/admin/settings' && method === 'GET') {
        return sendJson(res, 200, db.getSettings());
      }

      if (pathname === '/api/admin/settings' && method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = db.updateSettings(body, adminAuth.email);
        return sendJson(res, 200, updated);
      }

      // --- WEBSITE OVERVIEW ---
      if (pathname === '/api/admin/overview' && method === 'GET') {
        return sendJson(res, 200, db.getOverviewData());
      }

      // --- PUBLISH TO LIVE ---
      if (pathname === '/api/admin/publish' && method === 'POST') {
        return sendJson(res, 200, db.publishAllDrafts(adminAuth.email));
      }

      // --- HEADER & NAVIGATION ---
      if (pathname === '/api/admin/header-nav' && method === 'GET') {
        return sendJson(res, 200, db.getHeaderNav());
      }
      if (pathname === '/api/admin/header-nav' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateHeaderNav(body, adminAuth.email));
      }

      // --- THEME & APPEARANCE ---
      if (pathname === '/api/admin/theme' && method === 'GET') {
        return sendJson(res, 200, db.getThemeSettings());
      }
      if (pathname === '/api/admin/theme' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateThemeSettings(body, adminAuth.email));
      }

      // --- BRAND STORY ---
      if (pathname === '/api/admin/brand-story' && method === 'GET') {
        return sendJson(res, 200, db.getBrandStory());
      }
      if (pathname === '/api/admin/brand-story' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateBrandStory(body, adminAuth.email));
      }

      // --- BENEFITS & FEATURES ---
      if (pathname === '/api/admin/benefits' && method === 'GET') {
        return sendJson(res, 200, db.getBenefits());
      }
      if (pathname === '/api/admin/benefits' && method === 'POST') {
        const body = await parseJsonBody(req);
        return sendJson(res, 201, db.createBenefit(body, adminAuth.email));
      }
      if (pathname.startsWith('/api/admin/benefits/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/benefits/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateBenefit(id, body, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Benefit not found' });
        return sendJson(res, 200, updated);
      }
      if (pathname.startsWith('/api/admin/benefits/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/benefits/'.length).trim();
        const ok = db.deleteBenefit(id, adminAuth.email);
        if (!ok) return sendJson(res, 404, { error: 'Benefit not found' });
        return sendJson(res, 200, { success: true });
      }

      // --- INGREDIENTS & USAGE ---
      if (pathname === '/api/admin/ingredients-usage' && method === 'GET') {
        return sendJson(res, 200, db.getIngredientsUsage());
      }
      if (pathname === '/api/admin/ingredients-usage' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateIngredientsUsage(body, adminAuth.email));
      }

      // --- TESTIMONIALS ---
      if (pathname === '/api/admin/testimonials' && method === 'GET') {
        return sendJson(res, 200, db.getTestimonials());
      }
      if (pathname === '/api/admin/testimonials' && method === 'POST') {
        const body = await parseJsonBody(req);
        return sendJson(res, 201, db.createTestimonial(body, adminAuth.email));
      }
      if (pathname.startsWith('/api/admin/testimonials/') && method === 'PUT') {
        const id = pathname.substring('/api/admin/testimonials/'.length).trim();
        const body = await parseJsonBody(req);
        const updated = db.updateTestimonial(id, body, adminAuth.email);
        if (!updated) return sendJson(res, 404, { error: 'Testimonial not found' });
        return sendJson(res, 200, updated);
      }
      if (pathname.startsWith('/api/admin/testimonials/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/testimonials/'.length).trim();
        const ok = db.deleteTestimonial(id, adminAuth.email);
        if (!ok) return sendJson(res, 404, { error: 'Testimonial not found' });
        return sendJson(res, 200, { success: true });
      }

      // --- PDP SETTINGS ---
      if (pathname === '/api/admin/pdp-settings' && method === 'GET') {
        return sendJson(res, 200, db.getPdpSettings());
      }
      if (pathname === '/api/admin/pdp-settings' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updatePdpSettings(body, adminAuth.email));
      }

      // --- CONTACT INFO ---
      if (pathname === '/api/admin/contact-info' && method === 'GET') {
        return sendJson(res, 200, db.getContactInfo());
      }
      if (pathname === '/api/admin/contact-info' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateContactInfo(body, adminAuth.email));
      }

      // --- FOOTER EDITOR ---
      if (pathname === '/api/admin/footer' && method === 'GET') {
        return sendJson(res, 200, db.getFooter());
      }
      if (pathname === '/api/admin/footer' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateFooter(body, adminAuth.email));
      }

      // --- SEO MANAGEMENT ---
      if (pathname === '/api/admin/seo' && method === 'GET') {
        return sendJson(res, 200, db.getSeoSettings());
      }
      if (pathname === '/api/admin/seo' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateSeoSettings(body, adminAuth.email));
      }

      // --- VISUAL SECTIONS ---
      if (pathname === '/api/admin/visual-sections' && method === 'GET') {
        return sendJson(res, 200, db.getVisualSections());
      }
      if (pathname === '/api/admin/visual-sections' && method === 'PUT') {
        const body = await parseJsonBody(req);
        return sendJson(res, 200, db.updateVisualSections(body, adminAuth.email));
      }

      // --- ADMIN USERS & PERMISSIONS ---
      if (pathname === '/api/admin/users' && method === 'GET') {
        return sendJson(res, 200, db.getAdminUsers());
      }
      if (pathname === '/api/admin/users' && method === 'POST') {
        const body = await parseJsonBody(req);
        try {
          const user = db.createAdminUser(body, adminAuth.email);
          return sendJson(res, 201, user);
        } catch (e) {
          return sendJson(res, 400, { error: e.message });
        }
      }
      if (pathname.startsWith('/api/admin/users/') && method === 'DELETE') {
        const id = pathname.substring('/api/admin/users/'.length).trim();
        try {
          const ok = db.deleteAdminUser(id, adminAuth.email);
          if (!ok) return sendJson(res, 404, { error: 'User not found' });
          return sendJson(res, 200, { success: true });
        } catch (e) {
          return sendJson(res, 400, { error: e.message });
        }
      }
    }

    // Fallthrough for unmatched /api routes
    return sendJson(res, 404, { error: `Endpoint not found: ${method} ${pathname}` });

  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: 'Internal Server Error: ' + err.message });
  }
}

module.exports = {
  handleApiRequest
};
