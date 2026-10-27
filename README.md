# White Mist | Active Wash Liquid Detergent & E-Commerce CMS

A modern, highly interactive e-commerce and brand experience for **White Mist Active Wash Liquid Detergent**, featuring a full-screen Three.js WebGL 3D cleaning commercial experience, section-aware optical bubble physics, interactive product hot-spots, before/after stain comparison slider, orbital formula visualizer, full client-side shopping bag, and a **complete, secure administrator authentication system and dynamic content management dashboard (CMS)**.

---

## 🔐 Administrator Authentication & CMS Dashboard

White Mist now includes a full commercial content management suite designed to allow the store owner to manage all laundry products, pricing, stock levels, promotional banners, homepage sections, media assets, and customer orders dynamically without modifying source code.

### 🌟 Key Admin Features

1. **Secure Administrator Authentication (`/login`)**:
   - Branded login interface matching White Mist’s luxury dark aesthetic.
   - Cryptographically secured password hashing via Node.js native `scrypt`.
   - HMAC-SHA256 signed session tokens stored in secure `HttpOnly` cookies.
   - Brute-force rate limiting (locks after 5 failed attempts for 5 minutes).
   - Password visibility toggle (show/hide password).
   - Interactive password reset / forgot password flow.
   - Automatic redirection of unauthenticated users attempting to access `/admin/*`.

2. **Executive Admin Dashboard (`/admin`)**:
   - **Real-Time KPI Cards**: Total Products, Active Catalogue Items, Out-of-Stock Alerts, Total Orders Placed, and Total Revenue.
   - **Catalogue Distribution**: Real-time progress breakdown across detergent categories.
   - **Recent Orders Table**: Live order feed with customer details, order items, and status badges.
   - **Administrator Audit Trail**: Complete log of administrative actions, timestamps, and target entities.

3. **Dynamic Product Management (`/admin#products`)**:
   - Complete CRUD operations: Add new products, edit existing items, toggle active/draft status, and delete with confirmation.
   - Multi-tab product editor:
     - *General Info*: Name, SKU, Category, Slug, Subtitle, Fragrance notes.
     - *Sizes & Pricing*: Dynamically add/edit sizes (e.g. 500ml, 1L, 2L, 5L, Refill Pouches), MRP, sale prices, and default size selection.
     - *Inventory & Stock*: Manage stock quantities and availability flags.
     - *Formula & Dosage*: Machine compatibility (Front & Top load), regular dosage, heavy load dosage, and compatible fabric weaves.
     - *SEO & Badges*: Badges (Bestseller, Gentle Care, Tough Stain, Eco Saver), SEO meta titles, and descriptions.
   - Instant reflection: Updating a product immediately updates `index.html`, `shop.html`, and `product.html`.

4. **Homepage Content Management (`/admin#homepage`)**:
   - Real-time visual editor for:
     - Top Announcement Bar text and display toggle.
     - Hero headline, subtext, primary/secondary CTA labels, and links.
     - Hero bottle product variant selection (Ocean Blue, Floral Pink, Citrus Yellow).
     - Brand story highlights and numerical stats (Stain lift efficiency, formula stability).
     - FAQ Manager: Add, edit, remove, and reorder public FAQs.

5. **Promotional Banner Management (`/admin#banners`)**:
   - Create, publish, pause, or remove high-impact promotional banners.
   - Configure title, discount subtitle, badge, CTA destination URL, and banner graphic.
   - Only active banners appear on the public store.

6. **Centralized Media Library (`/admin#media`)**:
   - Drag-and-drop file uploader supporting PNG, JPG, WEBP, and SVG (up to 5MB).
   - Automatic file sanitization and persistent storage in `public/images/uploads/`.
   - Instant 1-click "Copy URL" button with clipboard feedback.

7. **Customer Order Management (`/admin#orders`)**:
   - Review incoming orders placed through the public checkout.
   - Inspect shipping addresses, ordered bottle sizes, customer phone/email, and payment method.
   - Update order status: *Confirmed & Processing*, *Shipped*, *Delivered*, or *Cancelled*.

8. **Customer Inquiries (`/admin#messages`)**:
   - Inquiries submitted via `contact.html` stream directly into the admin inbox.
   - Mark inquiries as *Replied* or *Archived*.

9. **Store Settings & Security (`/admin#settings`)**:
   - Configure free shipping threshold (default ₹499) and standard shipping charge (₹50).
   - Change administrator password with current password verification.
   - View full audit logs.

---

## 🔑 Default Administrator Credentials

Upon first initialization, White Mist creates a secure super-admin account:

- **Login URL**: `http://localhost:3000/login` or `https://your-domain.vercel.app/login`
- **Email**: `admin@whitemist.com`
- **Password**: `WhiteMist@Admin2026!`

*(You can change this password at any time inside the Admin Dashboard under **Settings & Security** or customize `INITIAL_ADMIN_PASSWORD` in your `.env` file).*

---

## 🚀 Running Locally

1. **Start the local server**:
   ```bash
   node server.js
   ```
   *(Or double-click `run.bat` on Windows).*

2. **Open your browser**:
   - Public Website: **`http://localhost:3000`**
   - Admin Login: **`http://localhost:3000/login`**
   - Admin Dashboard: **`http://localhost:3000/admin`**

3. **Run the automated test suite**:
   ```bash
   node test-suite.js
   node test-suite-server.js
   ```

---

## ☁️ Deployment on Vercel

The project is pre-configured with `vercel.json` for deployment on Vercel:

1. **Push to your GitHub repository** or deploy via Vercel CLI:
   ```bash
   vercel
   ```
2. **Environment Variables**:
   In your Vercel Project Settings $\rightarrow$ **Environment Variables**, set:
   - `JWT_SECRET`: A strong secret string for signing session tokens.
   - `INITIAL_ADMIN_PASSWORD`: Your desired default admin password.
   - *(Optional for cloud database)*: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 🗄️ Supabase PostgreSQL Integration

White Mist features a **hybrid persistence layer**:
- **Out of the box**: Operates on an atomic, thread-safe JSON database (`data/whitemist.json`) with zero external configuration required.
- **Supabase Cloud Database**: Fully configured to sync with Supabase PostgreSQL.

### Connecting to Supabase:
1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the entire script found in:
   ```
   supabase/schema.sql
   ```
   This provisions:
   - All 11 tables (`wm_admins`, `wm_products`, `wm_categories`, `wm_homepage`, `wm_banners`, `wm_pages`, `wm_media`, `wm_orders`, `wm_contact_messages`, `wm_settings`, `wm_audit_logs`).
   - Row Level Security (RLS) policies ensuring public read access to catalogue items while restricting modifications to authenticated administrators.
   - Indexes and initial seed data.
3. Add your Supabase credentials to `.env` or Vercel Environment Variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
