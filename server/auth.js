/**
 * WHITE MIST — Authentication & Security Service
 * Zero-dependency, crypto-grounded authentication with scrypt hashing,
 * HMAC-SHA256 signed session tokens, and brute-force rate limiting.
 */

const crypto = require('crypto');

// Secret for signing session tokens (reads from env or generates a persistent fallback)
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'whitemist-laundry-secure-secret-key-2026-v2';

// In-memory rate limiter: tracks attempts per IP
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

// Clean up old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of loginAttempts.entries()) {
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
      loginAttempts.delete(ip);
    }
  }
}, 10 * 60 * 1000);

/**
 * Hash a password using scrypt
 */
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const key = crypto.scryptSync(password, salt, 64);
  return {
    hash: key.toString('hex'),
    salt: salt
  };
}

/**
 * Verify a plain password against the stored hash and salt
 */
function verifyPassword(plainPassword, storedHash, salt) {
  try {
    const key = crypto.scryptSync(plainPassword, salt, 64);
    const candidateHash = key.toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch (err) {
    return false;
  }
}

/**
 * Create a signed session token
 */
function createSessionToken(admin, durationHours = 24) {
  const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
  const payload = {
    userId: admin.id,
    email: admin.email,
    role: admin.role || 'administrator',
    fullName: admin.fullName || 'White Mist Administrator',
    exp: expiresAt
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verify a signed session token
 */
function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');

  if (signature.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Check and record login attempt rate limit
 */
function checkRateLimit(ip) {
  const now = Date.now();
  let record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, firstAttempt: now };
    loginAttempts.set(ip, record);
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  record.count += 1;
  if (record.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

/**
 * Reset rate limit counter on successful login
 */
function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}

/**
 * Extract token from Authorization header or Cookie
 */
function extractToken(req) {
  // Check Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check Cookie: wm_admin_token=<token>
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('wm_admin_token=')) {
        return decodeURIComponent(c.substring('wm_admin_token='.length));
      }
    }
  }

  return null;
}

/**
 * Authenticate incoming request for admin routes
 */
function authenticateAdmin(req) {
  const token = extractToken(req);
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Parse client IP from request
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.socket.remoteAddress ||
         '127.0.0.1';
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  resetRateLimit,
  extractToken,
  authenticateAdmin,
  getClientIp
};
