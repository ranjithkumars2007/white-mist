-- =============================================================================
-- WHITE MIST — PRODUCTION SUPABASE POSTGRESQL SCHEMA & MIGRATIONS
-- Premium Liquid Laundry Detergent Brand E-Commerce & Content Management System
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean previous definitions if doing fresh installation
-- DROP TABLE IF EXISTS wm_audit_logs, wm_contact_messages, wm_orders, wm_media, wm_pages, wm_banners, wm_homepage, wm_products, wm_categories, wm_settings, wm_admins CASCADE;

-- -----------------------------------------------------------------------------
-- 1. ADMINISTRATOR USERS & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'administrator' CHECK (role IN ('super_admin', 'administrator', 'editor')),
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wm_admins_email ON wm_admins (LOWER(email));

-- -----------------------------------------------------------------------------
-- 2. PRODUCT CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS CATALOGUE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES wm_categories(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    subtitle TEXT,
    short_desc TEXT,
    full_desc TEXT,
    image TEXT NOT NULL,
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge TEXT,
    badge_type TEXT DEFAULT 'bestseller',
    rating NUMERIC(3,1) NOT NULL DEFAULT 4.9,
    review_count INT NOT NULL DEFAULT 0,
    fragrance TEXT,
    formula TEXT,
    machine_type TEXT,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    stock_qty INT NOT NULL DEFAULT 100,
    sku TEXT UNIQUE NOT NULL,
    dosage JSONB NOT NULL DEFAULT '{}'::jsonb,
    fabrics JSONB NOT NULL DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_desc TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wm_products_slug ON wm_products (slug);
CREATE INDEX IF NOT EXISTS idx_wm_products_category ON wm_products (category);
CREATE INDEX IF NOT EXISTS idx_wm_products_active ON wm_products (is_active);

-- -----------------------------------------------------------------------------
-- 4. HOMEPAGE CONTENT & SECTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_homepage (
    id TEXT PRIMARY KEY DEFAULT 'homepage_default',
    hero JSONB NOT NULL DEFAULT '{}'::jsonb,
    brand_intro JSONB NOT NULL DEFAULT '{}'::jsonb,
    cleaning_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. PROMOTIONAL BANNERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT NOT NULL DEFAULT 'Shop Now',
    cta_link TEXT NOT NULL DEFAULT 'shop.html',
    badge TEXT DEFAULT 'Offer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 1,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. WEBSITE PAGES CONTENT (CMS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_pages (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    hero_title TEXT,
    hero_subtitle TEXT,
    content TEXT NOT NULL,
    seo_title TEXT,
    seo_desc TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. MEDIA ASSETS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_media (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    url TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. CUSTOMER ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    status TEXT NOT NULL DEFAULT 'Confirmed & Processing',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wm_orders_created_at ON wm_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wm_orders_status ON wm_orders (status);

-- -----------------------------------------------------------------------------
-- 9. CONTACT INQUIRIES & MESSAGES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL DEFAULT 'general',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. GLOBAL STORE SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_settings (
    id TEXT PRIMARY KEY DEFAULT 'global_settings',
    store_name TEXT NOT NULL DEFAULT 'White Mist',
    tagline TEXT DEFAULT 'Premium Liquid Laundry Detergent & Fabric Care',
    currency TEXT NOT NULL DEFAULT '₹',
    free_shipping_threshold NUMERIC(10,2) NOT NULL DEFAULT 499,
    standard_shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 50,
    support_email TEXT DEFAULT 'support@whitemistcare.com',
    support_phone TEXT DEFAULT '+91 98765 43210',
    support_address TEXT DEFAULT '42, Textile Garden Avenue, Near Green Mills, Coimbatore, Tamil Nadu — 641001',
    announcement_bar_text TEXT DEFAULT '✦ FREE EXPRESS DELIVERY ACROSS INDIA ON ORDERS OVER ₹499 • 100% GENTLE BIO-ENZYME FORMULA ✦',
    announcement_bar_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wm_audit_logs (
    id TEXT PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wm_audit_timestamp ON wm_audit_logs (timestamp DESC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE wm_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wm_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can READ published products, categories, homepage, banners, pages, and settings
CREATE POLICY "Public Read Active Products" ON wm_products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Categories" ON wm_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Homepage" ON wm_homepage FOR SELECT USING (true);
CREATE POLICY "Public Read Active Banners" ON wm_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Pages" ON wm_pages FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON wm_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON wm_media FOR SELECT USING (true);

-- Public can INSERT orders (Checkout) and contact messages
CREATE POLICY "Public Place Orders" ON wm_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Submit Contact Messages" ON wm_contact_messages FOR INSERT WITH CHECK (true);

-- Service Role / Authorized Backend has full access to manage all tables
CREATE POLICY "Service Role Full Access Admins" ON wm_admins FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Products" ON wm_products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Categories" ON wm_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Homepage" ON wm_homepage FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Banners" ON wm_banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Pages" ON wm_pages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Media" ON wm_media FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Orders" ON wm_orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Messages" ON wm_contact_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Settings" ON wm_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access AuditLogs" ON wm_audit_logs FOR ALL USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- SEED DATA: DEFAULT ADMINISTRATOR & STORE SETTINGS
-- -----------------------------------------------------------------------------
-- Default admin credentials:
-- Email: admin@whitemist.com
-- Password: WhiteMist@Admin2026!
INSERT INTO wm_admins (email, full_name, role, password_hash, password_salt)
VALUES (
    'admin@whitemist.com',
    'White Mist Executive Administrator',
    'super_admin',
    '79da676fdf7c1a8501daef933bb974c45aafe4f83b190f842ee30a7b973ef0b22a07c4dcf9cba4ba81d9f43fc0bb314207ae48742880092d6e35cb35c9e2b109',
    '4a7e93b16cf29d8a14b581c7e928d103'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO wm_settings (id, store_name, tagline, currency, free_shipping_threshold, standard_shipping_fee)
VALUES ('global_settings', 'White Mist', 'Premium Liquid Laundry Detergent & Fabric Care', '₹', 499, 50)
ON CONFLICT (id) DO NOTHING;

-- Seed default categories
INSERT INTO wm_categories (id, name, slug, description, image, display_order)
VALUES
('cat_daily', 'Daily Wash Liquid', 'daily-wash-liquid', 'Everyday bio-enzyme cleansing for daily cottons, office shirts, and school uniforms.', 'public/images/bottle_blue.png', 1),
('cat_delicates', 'Premium Fabric Care', 'premium-fabric-care', 'Silk, chiffon, and delicate garment softening formula with botanical aroma.', 'public/images/bottle_pink.png', 2),
('cat_concentrated', 'Concentrated Detergent', 'concentrated-detergent', 'High performance grease-cutting formulation with natural citrus extracts.', 'public/images/bottle_yellow.png', 3),
('cat_refills', 'Family Value Pack', 'family-value-pack', 'Sustainable eco-refill pouches and money-saving bundle packs.', 'public/images/pouch_blue.png', 4)
ON CONFLICT (id) DO NOTHING;
