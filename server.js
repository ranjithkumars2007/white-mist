const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./server/api');
const { authenticateAdmin } = require('./server/auth');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // 1. API Route Delegation
  if (reqPath.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // Normalize root path
  if (reqPath === '/') reqPath = '/index.html';

  // 2. Authentication Route: /login
  if (reqPath === '/login' || reqPath === '/login.html') {
    const admin = authenticateAdmin(req);
    if (admin) {
      res.writeHead(302, { 'Location': '/admin' });
      return res.end();
    }
    const loginFilePath = path.join(__dirname, 'login.html');
    if (fs.existsSync(loginFilePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(loginFilePath).pipe(res);
    }
  }

  // 3. Protected Admin Routes: /admin and /admin/*
  if (reqPath === '/admin' || reqPath.startsWith('/admin/')) {
    const admin = authenticateAdmin(req);
    if (!admin) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(reqPath)}`;
      res.writeHead(302, { 'Location': redirectUrl });
      return res.end();
    }

    // Serve the Admin Dashboard single-page experience
    const adminFilePath = path.join(__dirname, 'admin.html');
    if (fs.existsSync(adminFilePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(adminFilePath).pipe(res);
    }
  }

  // 4. Static Files and Clean URLs
  let filePath = path.join(__dirname, reqPath);

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      const publicPath = path.join(__dirname, 'public', reqPath);
      if (fs.existsSync(publicPath)) {
        filePath = publicPath;
      } else if (fs.existsSync(publicPath + '.html')) {
        filePath = publicPath + '.html';
      }
    }
  }

  // SPA-like fallback for /product/:slug
  if (!fs.existsSync(filePath) && reqPath.startsWith('/product/')) {
    filePath = path.join(__dirname, 'product.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html>
<head>
  <title>404 Not Found | White Mist</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0414; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    h1 { font-size: 3rem; margin: 0 0 1rem; color: #00a6ff; }
    p { color: #94a3b8; font-size: 1.1rem; max-width: 480px; }
    a { color: #fff; text-decoration: none; margin-top: 24px; padding: 12px 28px; background: linear-gradient(135deg, #0084ff, #7c3aed); border-radius: 999px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>404</h1>
  <p>The page <code>${reqPath}</code> could not be found.</p>
  <a href="/">Return to White Mist Home</a>
</body>
</html>`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Error: ' + err.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': (ext === '.html' || ext === '.js' || ext === '.css') ? 'no-cache, must-revalidate' : 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  WHITE MIST — Premium Laundry Detergent`);
  console.log(`  Public Website:   http://localhost:${PORT}`);
  console.log(`  Admin Dashboard:  http://localhost:${PORT}/admin`);
  console.log(`  Admin Login:      http://localhost:${PORT}/login`);
  console.log(`  Direct IPv4:      http://127.0.0.1:${PORT}`);
  console.log(`========================================================`);
});
