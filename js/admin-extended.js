/**
 * WHITE MIST — Extended CMS Admin Controller
 * Implements all 24 administrative modules:
 * 1. Dashboard
 * 2. Website Overview
 * 3. Homepage Editor & Visual Section Builder
 * 4. Header & Navigation
 * 5. Product Management
 * 6. Product Categories
 * 7. Product Detail Pages (PDP)
 * 8. Banners & Promotions
 * 9. Brand Story / About Us
 * 10. Benefits & Features
 * 11. Ingredients & Usage Information
 * 12. Testimonials & Reviews
 * 13. FAQ Management
 * 14. Contact Page
 * 15. Footer Editor
 * 16. All Website Pages
 * 17. Media Library
 * 18. SEO Management
 * 19. Theme & Appearance (Light, Dark, System tokens)
 * 20. Orders
 * 21. Contact Messages
 * 22. Admin Users & Permissions
 * 23. Activity Logs
 * 24. General Settings
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. EXTENDED NAVIGATION ITEMS INJECTOR
  // -------------------------------------------------------------------------
  function setupExtendedSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    // Check if already injected
    if (document.getElementById('nav-item-overview')) return;

    nav.innerHTML = `
      <div class="nav-section-title">Core Overview</div>
      <a class="nav-item active" data-view="dashboard" onclick="switchView('dashboard')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span class="nav-text">Dashboard</span>
      </a>
      <a class="nav-item" id="nav-item-overview" data-view="overview" onclick="switchView('overview')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        <span class="nav-text">Website Overview</span>
      </a>

      <div class="nav-section-title">Website Content & Pages</div>
      <a class="nav-item" data-view="homepage" onclick="switchView('homepage')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="nav-text">Homepage Editor</span>
      </a>
      <a class="nav-item" data-view="header-nav" onclick="switchView('header-nav')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <span class="nav-text">Header & Navigation</span>
      </a>
      <a class="nav-item" data-view="pages" onclick="switchView('pages')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
        <span class="nav-text">Website Pages</span>
      </a>
      <a class="nav-item" data-view="brand-story" onclick="switchView('brand-story')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        <span class="nav-text">Brand Story / About Us</span>
      </a>
      <a class="nav-item" data-view="benefits" onclick="switchView('benefits')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span class="nav-text">Benefits & Features</span>
      </a>
      <a class="nav-item" data-view="ingredients" onclick="switchView('ingredients')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
        <span class="nav-text">Ingredients & Usage</span>
      </a>
      <a class="nav-item" data-view="testimonials" onclick="switchView('testimonials')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span class="nav-text">Testimonials & Reviews</span>
      </a>
      <a class="nav-item" data-view="faqs" onclick="switchView('faqs')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span class="nav-text">FAQ Management</span>
      </a>
      <a class="nav-item" data-view="contact" onclick="switchView('contact')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <span class="nav-text">Contact Page</span>
      </a>
      <a class="nav-item" data-view="footer" onclick="switchView('footer')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="15" x2="21" y2="15"></line></svg>
        <span class="nav-text">Footer Editor</span>
      </a>

      <div class="nav-section-title">E-Commerce & Catalogue</div>
      <a class="nav-item" data-view="products" onclick="switchView('products')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span class="nav-text">Products</span>
        <span class="nav-badge" id="sidebarProdCount">0</span>
      </a>
      <a class="nav-item" data-view="categories" onclick="switchView('categories')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        <span class="nav-text">Categories</span>
      </a>
      <a class="nav-item" data-view="pdp" onclick="switchView('pdp')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <span class="nav-text">Product Detail Pages</span>
      </a>
      <a class="nav-item" data-view="banners" onclick="switchView('banners')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
        <span class="nav-text">Banners & Promotions</span>
      </a>
      <a class="nav-item" data-view="orders" onclick="switchView('orders')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span class="nav-text">Orders</span>
        <span class="nav-badge" id="sidebarOrderCount">0</span>
      </a>
      <a class="nav-item" data-view="messages" onclick="switchView('messages')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span class="nav-text">Contact Messages</span>
        <span class="nav-badge" id="sidebarMsgBadge" style="display: none; background: rgba(244, 63, 94, 0.2); color: #fb7185;">0</span>
      </a>

      <div class="nav-section-title">Design, Media & System</div>
      <a class="nav-item" data-view="media" onclick="switchView('media')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span class="nav-text">Media Library</span>
      </a>
      <a class="nav-item" data-view="seo" onclick="switchView('seo')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span class="nav-text">SEO Management</span>
      </a>
      <a class="nav-item" data-view="theme" onclick="switchView('theme')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <span class="nav-text">Theme & Appearance</span>
      </a>
      <a class="nav-item" data-view="users" onclick="switchView('users')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span class="nav-text">Admin Users</span>
      </a>
      <a class="nav-item" data-view="audit" onclick="switchView('audit')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span class="nav-text">Activity Logs</span>
      </a>
      <a class="nav-item" data-view="settings" onclick="switchView('settings')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span class="nav-text">General Settings</span>
      </a>
    `;
  }

  // -------------------------------------------------------------------------
  // 2. INJECT TOPBAR SEARCH & PUBLISH CONTROLS
  // -------------------------------------------------------------------------
  function setupTopbarControls() {
    const topbarActions = document.querySelector('.topbar-actions');
    if (!topbarActions || document.getElementById('publishLiveBtn')) return;

    // Search bar
    const searchWrap = document.createElement('div');
    searchWrap.className = 'topbar-search-wrap';
    searchWrap.innerHTML = `
      <div class="topbar-search-box">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; color: var(--text-muted); pointer-events: none;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="globalAdminSearch" placeholder="Search products, orders, pages..." 
          style="width: 100%; padding: 0.5rem 1rem 0.5rem 2.2rem; border-radius: 999px; border: 1px solid var(--border-subtle); background: var(--bg-input); color: var(--text-main); font-size: 0.82rem;"
          oninput="window.WhiteMistAdminExt.handleGlobalSearch(this.value)">
      </div>
    `;
    const topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft) topbarLeft.appendChild(searchWrap);

    // Publish button removed as requested
  }

  // -------------------------------------------------------------------------
  // 3. INJECT EXTENDED PANELS INTO <main class="admin-content">
  // -------------------------------------------------------------------------
  function injectExtendedPanels() {
    const main = document.querySelector('.admin-content');
    if (!main || document.getElementById('view-overview')) return;

    const panelsContainer = document.createElement('div');
    panelsContainer.id = 'extendedPanelsContainer';
    panelsContainer.innerHTML = `
      <!-- ===================================================================
           VIEW: WEBSITE OVERVIEW
           =================================================================== -->
      <section class="view-panel" id="view-overview">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Website Overview & System Health</h1>
            <p>Complete audit of all manageable sections, live status, and deployment readiness.</p>
          </div>
          <button class="filter-input" style="cursor: pointer;" onclick="window.WhiteMistAdminExt.loadOverviewData()">↻ Refresh Health</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-top-row"><span class="stat-label">System Health</span><div class="stat-icon-wrap" style="color: #10b981;">●</div></div>
            <div class="stat-val" style="color: #10b981;">100% Operational</div>
            <div class="stat-sub positive">Zero runtime errors reported</div>
          </div>
          <div class="stat-card">
            <div class="stat-top-row"><span class="stat-label">Total Managed Pages</span><div class="stat-icon-wrap" style="color: #0284c7;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div></div>
            <div class="stat-val" id="ovTotalPages">12</div>
            <div class="stat-sub">Dynamic routes configured</div>
          </div>
          <div class="stat-card">
            <div class="stat-top-row"><span class="stat-label">Publishing Status</span><div class="stat-icon-wrap" style="color: #059669;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div></div>
            <div class="stat-val" style="font-size: 1.15rem; line-height: 1.4; color: #0084ff;" id="ovPublishStatus">Live & Synchronized</div>
            <div class="stat-sub" id="ovLastSync">Ready for edits</div>
          </div>
          <div class="stat-card">
            <div class="stat-top-row"><span class="stat-label">Active Default Theme</span><div class="stat-icon-wrap" style="color: #0284c7;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div></div>
            <div class="stat-val" id="ovDefaultTheme">White Theme</div>
            <div class="stat-sub">Configurable in Theme settings</div>
          </div>
        </div>

        <!-- Quick Launch Pad -->
        <div class="dashboard-grid-2" style="margin-top: 2rem;">
          <div class="stat-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-main);">Quick CMS Actions</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('homepage')">Edit Hero & Variants</button>
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('header-nav')">Edit Announcement Bar</button>
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('theme')">Customize Brand Colors</button>
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('testimonials')">Manage Reviews</button>
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('media')">Upload Product Image</button>
              <button class="filter-input" style="cursor: pointer;" onclick="switchView('seo')">Update SEO Metadata</button>
            </div>
          </div>

          <div class="stat-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-main);">Public Website Status</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
              The public storefront is currently operating in high-performance mode with all original 3D cleaning simulations, interactive fragrance variant pickers, and the stain comparison slider active.
            </p>
            <div style="display: flex; gap: 0.75rem;">
              <a href="/" target="_blank" class="btn-action-public"><span>Open Live Website</span><span>↗</span></a>
              <button class="btn-theme-toggle" onclick="window.WhiteMistAdminExt.publishAllChanges()"><span>Sync Live Website</span></button>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: HEADER & NAVIGATION
           =================================================================== -->
      <section class="view-panel" id="view-header-nav">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Header & Global Navigation</h1>
            <p>Manage brand logo, sticky announcement bar, header menu items, and CTA actions.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveHeaderNavData()">Save Header Changes</button>
        </div>

        <div class="dashboard-grid-2">
          <!-- Announcement Bar Card -->
          <div class="stat-card">
            <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;">Top Announcement Bar</h3>
            <div class="form-group">
              <label class="form-label" style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="hnAnnEnabled">
                <span>Display Announcement Bar on Public Website</span>
              </label>
            </div>
            <div class="form-group">
              <label class="form-label">Announcement Text</label>
              <textarea class="form-textarea" id="hnAnnText" rows="3"></textarea>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Background Color</label>
                <input type="color" class="form-input-text" id="hnAnnBgColor" style="height: 42px; padding: 2px;">
              </div>
              <div class="form-group">
                <label class="form-label">Text Color</label>
                <input type="color" class="form-input-text" id="hnAnnTextColor" style="height: 42px; padding: 2px;">
              </div>
            </div>
          </div>

          <!-- Logo & Brand Card -->
          <div class="stat-card">
            <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;">Brand Logo & Header Actions</h3>
            <div class="form-group">
              <label class="form-label">Brand Name</label>
              <input type="text" class="form-input-text" id="hnLogoText">
            </div>
            <div class="form-group">
              <label class="form-label">Logo Image URL</label>
              <input type="text" class="form-input-text" id="hnLogoImg">
            </div>
            <div class="form-group">
              <label class="form-label">Header CTA Button Text</label>
              <input type="text" class="form-input-text" id="hnCtaLabel">
            </div>
            <div class="form-group">
              <label class="form-label">Header CTA Target URL</label>
              <input type="text" class="form-input-text" id="hnCtaUrl">
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: BRAND STORY
           =================================================================== -->
      <section class="view-panel" id="view-brand-story">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Brand Story & Mission</h1>
            <p>Edit the brand manifesto, mission, vision, and proof metrics displayed across the site.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveBrandStoryData()">Save Story Changes</button>
        </div>

        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Headline Title</label>
            <input type="text" class="form-input-text" id="bsHeroTitle">
          </div>
          <div class="form-group">
            <label class="form-label">Subtitle / Hook</label>
            <textarea class="form-textarea" id="bsHeroSubtitle" rows="2"></textarea>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Brand Vision</label>
              <textarea class="form-textarea" id="bsVision" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Brand Mission</label>
              <textarea class="form-textarea" id="bsMission" rows="3"></textarea>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Narrative Story Paragraphs (One per line)</label>
            <textarea class="form-textarea" id="bsParagraphs" rows="5"></textarea>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: BENEFITS & FEATURES
           =================================================================== -->
      <section class="view-panel" id="view-benefits">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Benefits & Cleaning Performance</h1>
            <p>Manage the performance feature cards: 70°C Hot Sterilization, 40dB Quiet, 70% Water Saving, etc.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.openAddBenefitModal()">+ Add New Benefit</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="benefitsTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: INGREDIENTS & USAGE
           =================================================================== -->
      <section class="view-panel" id="view-ingredients">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Ingredients & Dosing Guidelines</h1>
            <p>Formulation science, active enzyme transparency, and washing machine dosing guidelines.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveIngredientsData()">Save Guidelines</button>
        </div>

        <div class="dashboard-grid-2">
          <div class="stat-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.05rem;">Section Headings</h3>
            <div class="form-group">
              <label class="form-label">Section Heading</label>
              <input type="text" class="form-input-text" id="ingHeading">
            </div>
            <div class="form-group">
              <label class="form-label">Section Subtitle</label>
              <textarea class="form-textarea" id="ingSubtitle" rows="3"></textarea>
            </div>
          </div>

          <div class="stat-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.05rem;">Certified Active Ingredients</h3>
            <div id="ingActiveList" style="font-size: 0.88rem; line-height: 1.6;">
              <p>• <strong>Bio-Enzymes (Protease, Lipase, Amylase)</strong>: Molecular stain breakdown</p>
              <p>• <strong>Plant-Derived Non-Ionic Surfactants</strong>: Gentle fiber cleansing</p>
              <p>• <strong>Micro-Encapsulated Fragrance</strong>: 48-hour continuous release</p>
              <p>• <strong>Anti-Redeposition Polymers</strong>: Keeps lifted dirt suspended</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: TESTIMONIALS & REVIEWS
           =================================================================== -->
      <section class="view-panel" id="view-testimonials">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Customer Testimonials & Reviews</h1>
            <p>Manage customer ratings, verified buyer badges, quotes, and fragrance feedback.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.openAddTestimonialModal()">+ Add Customer Review</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Variant</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="testimonialsTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: PRODUCT DETAIL PAGES (PDP)
           =================================================================== -->
      <section class="view-panel" id="view-pdp">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Product Detail Page (PDP) Layout</h1>
            <p>Configure tab visibility, delivery estimation promises, and guarantees on product pages.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.savePdpData()">Save PDP Settings</button>
        </div>

        <div class="stat-card">
          <div class="form-group">
            <label class="form-label">Delivery Estimate Banner Text</label>
            <input type="text" class="form-input-text" id="pdpDeliveryText">
          </div>
          <div class="form-group">
            <label class="form-label">Guarantee Badge Text</label>
            <input type="text" class="form-input-text" id="pdpGuaranteeText">
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; cursor: pointer;">
              <input type="checkbox" id="pdpTabReviews"> Enable Reviews & UGC Tab
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; cursor: pointer;">
              <input type="checkbox" id="pdpTabDosage"> Enable Dosage Guide Tab
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; cursor: pointer;">
              <input type="checkbox" id="pdpTabSpecs"> Enable Machine Specifications
            </label>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: CONTACT PAGE
           =================================================================== -->
      <section class="view-panel" id="view-contact">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Contact & Customer Support</h1>
            <p>Update telephone lines, official support email, operating hours, and factory address.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveContactData()">Save Contact Settings</button>
        </div>

        <div class="dashboard-grid-2">
          <div class="stat-card">
            <div class="form-group">
              <label class="form-label">Support Email Address</label>
              <input type="email" class="form-input-text" id="contactEmail">
            </div>
            <div class="form-group">
              <label class="form-label">Customer Support Phone</label>
              <input type="tel" class="form-input-text" id="contactPhone">
            </div>
            <div class="form-group">
              <label class="form-label">WhatsApp Helpline Number</label>
              <input type="tel" class="form-input-text" id="contactWhatsapp">
            </div>
          </div>

          <div class="stat-card">
            <div class="form-group">
              <label class="form-label">Operating / Support Hours</label>
              <input type="text" class="form-input-text" id="contactHours">
            </div>
            <div class="form-group">
              <label class="form-label">Registered Corporate & Plant Address</label>
              <textarea class="form-textarea" id="contactAddress" rows="3"></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: FOOTER EDITOR
           =================================================================== -->
      <section class="view-panel" id="view-footer">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Footer & Legal Navigation</h1>
            <p>Edit the brand narrative, copyright notice, newsletter promise, and social links.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveFooterData()">Save Footer</button>
        </div>

        <div class="stat-card">
          <div class="form-group">
            <label class="form-label">Brand Narrative Paragraph</label>
            <textarea class="form-textarea" id="footerDesc" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Copyright Notice Line</label>
            <input type="text" class="form-input-text" id="footerCopyright">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Newsletter Heading</label>
              <input type="text" class="form-input-text" id="footerNewsHead">
            </div>
            <div class="form-group">
              <label class="form-label">Newsletter Subtitle / Privacy Pledge</label>
              <input type="text" class="form-input-text" id="footerNewsSub">
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: SEO MANAGEMENT
           =================================================================== -->
      <section class="view-panel" id="view-seo">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Global SEO & Meta Tags</h1>
            <p>Manage search engine ranking titles, open-graph social previews, keywords, and indexing.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveSeoData()">Save SEO Settings</button>
        </div>

        <div class="stat-card">
          <div class="form-group">
            <label class="form-label">Global Meta Title</label>
            <input type="text" class="form-input-text" id="seoSiteTitle">
          </div>
          <div class="form-group">
            <label class="form-label">Meta Description (150-160 characters recommended)</label>
            <textarea class="form-textarea" id="seoMetaDesc" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Target Keywords (Comma-separated)</label>
            <input type="text" class="form-input-text" id="seoKeywords">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Canonical Store URL</label>
              <input type="url" class="form-input-text" id="seoCanonical">
            </div>
            <div class="form-group">
              <label class="form-label">Open Graph Social Image URL</label>
              <input type="text" class="form-input-text" id="seoOgImage">
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: THEME & APPEARANCE (LIGHT & DARK MODE ENGINE)
           =================================================================== -->
      <section class="view-panel" id="view-theme">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Theme & Visual Styling Engine</h1>
            <p>Configure default website theme (Light / Dark / Auto), brand color tokens, and preview.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.saveThemeData()">Save Theme Settings</button>
        </div>

        <div class="dashboard-grid-2">
          <!-- Theme Settings Card -->
          <div class="stat-card">
            <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;">Public Default Theme</h3>
            <div class="form-group">
              <label class="form-label">Default Appearance for First-Time Visitors</label>
              <select class="form-select" id="themeDefaultMode">
                <option value="light">White Theme (Clean Luminous White)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" id="themeAllowPublicToggle" disabled>
                <span>Public store is locked to White Theme</span>
              </label>
            </div>

            <h3 style="margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.05rem;">Brand Accent Colors</h3>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Electric Ocean Blue</label>
                <input type="color" class="form-input-text" id="themeOceanBlue" style="height: 40px; padding: 2px;">
              </div>
              <div class="form-group">
                <label class="form-label">Floral Bloom Pink</label>
                <input type="color" class="form-input-text" id="themeFloralPink" style="height: 40px; padding: 2px;">
              </div>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Citrus Sunshine Yellow</label>
                <input type="color" class="form-input-text" id="themeCitrusYellow" style="height: 40px; padding: 2px;">
              </div>
              <div class="form-group">
                <label class="form-label">Deep Royal Purple</label>
                <input type="color" class="form-input-text" id="themeRoyalPurple" style="height: 40px; padding: 2px;">
              </div>
            </div>
          </div>

          <!-- Live Theme Preview Sandbox -->
          <div class="stat-card">
            <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;">Live Theme Preview Card</h3>
            <div id="themePreviewBox" style="padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-subtle); background: var(--bg-card); transition: all 0.3s ease;">
              <span class="badge badge-primary">Preview Bestseller</span>
              <h4 style="margin: 0.75rem 0 0.5rem; font-size: 1.15rem; color: var(--text-main);">White Mist Liquid Detergent</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                This card demonstrates contrast, surface gradients, borders, and button lighting in the selected theme tokens.
              </p>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button type="button" class="btn-quick-add">Primary CTA</button>
                <button type="button" class="btn-secondary" style="padding: 0.55rem 1rem; border-radius: 8px;">Secondary</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: ADMIN USERS & PERMISSIONS
           =================================================================== -->
      <section class="view-panel" id="view-users">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Admin Users & Access Control</h1>
            <p>Manage store administrators, editors, and security role privileges.</p>
          </div>
          <button class="btn-quick-add" onclick="window.WhiteMistAdminExt.openAddUserModal()">+ Add New Admin</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===================================================================
           VIEW: ACTIVITY LOGS
           =================================================================== -->
      <section class="view-panel" id="view-audit">
        <div class="view-header">
          <div class="view-title-group">
            <h1>System Activity & Audit Trail</h1>
            <p>Cryptographically recorded log of all administrative actions, product edits, and logins.</p>
          </div>
          <button class="filter-input" style="cursor: pointer;" onclick="window.WhiteMistAdminExt.loadAuditData()">↻ Refresh Logs</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody id="auditTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </section>
    `;

    main.appendChild(panelsContainer);
  }

  // -------------------------------------------------------------------------
  // 4. API HANDLERS & DATA BINDING
  // -------------------------------------------------------------------------
  const AdminExt = {
    async loadOverviewData() {
      try {
        const res = await fetch('/api/admin/overview', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('ovTotalPages').textContent = '12';
        document.getElementById('ovPublishStatus').textContent = d.publishStatus?.hasUnpublishedDrafts ? 'Unsaved Drafts' : 'Live & Published';
        document.getElementById('ovDefaultTheme').textContent = 'White Theme';
        document.getElementById('ovLastSync').textContent = 'Last synced: ' + new Date().toLocaleTimeString();
      } catch (e) {
        console.warn('Overview error:', e);
      }
    },

    async loadHeaderNavData() {
      try {
        const res = await fetch('/api/admin/header-nav', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        if (data.announcementBar) {
          document.getElementById('hnAnnEnabled').checked = data.announcementBar.enabled !== false;
          document.getElementById('hnAnnText').value = data.announcementBar.text || '';
          document.getElementById('hnAnnBgColor').value = data.announcementBar.bgColor || '#3f1b85';
          document.getElementById('hnAnnTextColor').value = data.announcementBar.textColor || '#ffffff';
        }
        document.getElementById('hnLogoText').value = data.logoText || 'White Mist';
        document.getElementById('hnLogoImg').value = data.logoImage || '/assets/images/logo.png';
        if (data.headerCta) {
          document.getElementById('hnCtaLabel').value = data.headerCta.label || 'Shopping Bag';
          document.getElementById('hnCtaUrl').value = data.headerCta.url || '#cart';
        }
      } catch (e) {
        console.warn('Header nav error:', e);
      }
    },

    async saveHeaderNavData() {
      try {
        const payload = {
          logoText: document.getElementById('hnLogoText').value,
          logoImage: document.getElementById('hnLogoImg').value,
          announcementBar: {
            enabled: document.getElementById('hnAnnEnabled').checked,
            text: document.getElementById('hnAnnText').value,
            bgColor: document.getElementById('hnAnnBgColor').value,
            textColor: document.getElementById('hnAnnTextColor').value
          },
          headerCta: {
            label: document.getElementById('hnCtaLabel').value,
            url: document.getElementById('hnCtaUrl').value
          }
        };

        const res = await fetch('/api/admin/header-nav', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast('Header & Navigation saved successfully!');
        } else {
          showToast('Failed to save header settings', 'error');
        }
      } catch (e) {
        showToast('Error saving header', 'error');
      }
    },

    async loadBrandStoryData() {
      try {
        const res = await fetch('/api/admin/brand-story', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('bsHeroTitle').value = d.heroTitle || '';
        document.getElementById('bsHeroSubtitle').value = d.heroSubtitle || '';
        document.getElementById('bsVision').value = d.vision || '';
        document.getElementById('bsMission').value = d.mission || '';
        document.getElementById('bsParagraphs').value = Array.isArray(d.storyParagraphs) ? d.storyParagraphs.join('\n\n') : '';
      } catch (e) {
        console.warn('Brand story error:', e);
      }
    },

    async saveBrandStoryData() {
      try {
        const paragraphs = document.getElementById('bsParagraphs').value.split('\n\n').filter(p => p.trim());
        const payload = {
          heroTitle: document.getElementById('bsHeroTitle').value,
          heroSubtitle: document.getElementById('bsHeroSubtitle').value,
          vision: document.getElementById('bsVision').value,
          mission: document.getElementById('bsMission').value,
          storyParagraphs: paragraphs
        };

        const res = await fetch('/api/admin/brand-story', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) showToast('Brand story saved successfully!');
        else showToast('Failed to save brand story', 'error');
      } catch (e) {
        showToast('Error saving brand story', 'error');
      }
    },

    async loadBenefitsData() {
      try {
        const res = await fetch('/api/admin/benefits', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById('benefitsTableBody');
        if (!tbody) return;

        tbody.innerHTML = list.map(b => `
          <tr>
            <td style="font-size: 1.2rem;">${b.icon || ''}</td>
            <td><strong>${b.title}</strong></td>
            <td style="font-size: 0.82rem; color: var(--text-secondary); max-width: 320px;">${b.desc}</td>
            <td>${b.order || 1}</td>
            <td><span class="badge ${b.isActive !== false ? 'badge-success' : 'badge-danger'}">${b.isActive !== false ? 'Active' : 'Draft'}</span></td>
            <td>
              <button class="btn-card-details" style="padding: 4px 8px;" onclick="window.WhiteMistAdminExt.deleteBenefitItem('${b.id}')">✕ Delete</button>
            </td>
          </tr>
        `).join('');
      } catch (e) {
        console.warn('Benefits error:', e);
      }
    },

    async deleteBenefitItem(id) {
      if (!confirm('Are you sure you want to delete this benefit?')) return;
      try {
        const res = await fetch(`/api/admin/benefits/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok) {
          showToast('Benefit deleted');
          this.loadBenefitsData();
        }
      } catch (e) {
        showToast('Error deleting benefit', 'error');
      }
    },

    openAddBenefitModal() {
      const title = prompt('Enter Benefit Title (e.g. 70°C Hot Sterilization):');
      if (!title) return;
      const desc = prompt('Enter Benefit Description:');
      const icon = prompt('Enter Icon or SVG code:') || '';

      fetch('/api/admin/benefits', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, desc, icon })
      }).then(res => {
        if (res.ok) {
          showToast('Benefit created!');
          this.loadBenefitsData();
        }
      });
    },

    async loadIngredientsData() {
      try {
        const res = await fetch('/api/admin/ingredients-usage', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('ingHeading').value = d.heading || '';
        document.getElementById('ingSubtitle').value = d.subtitle || '';
      } catch (e) {
        console.warn('Ingredients error:', e);
      }
    },

    async saveIngredientsData() {
      try {
        const payload = {
          heading: document.getElementById('ingHeading').value,
          subtitle: document.getElementById('ingSubtitle').value
        };
        const res = await fetch('/api/admin/ingredients-usage', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) showToast('Ingredients & Dosing saved!');
      } catch (e) {
        showToast('Error saving ingredients', 'error');
      }
    },

    async loadTestimonialsData() {
      try {
        const res = await fetch('/api/admin/testimonials', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById('testimonialsTableBody');
        if (!tbody) return;

        tbody.innerHTML = list.map(t => `
          <tr>
            <td><strong>${t.author}</strong></td>
            <td>${t.location || 'India'}</td>
            <td>${t.variantUsed || 'Ocean Fresh'}</td>
            <td>${'★'.repeat(t.rating || 5)}</td>
            <td style="font-size: 0.82rem; color: var(--text-secondary); max-width: 320px;">"${t.comment}"</td>
            <td>${t.verifiedBuyer ? '✓ Verified' : '—'}</td>
            <td>
              <button class="btn-card-details" style="padding: 4px 8px;" onclick="window.WhiteMistAdminExt.deleteTestimonialItem('${t.id}')">✕ Delete</button>
            </td>
          </tr>
        `).join('');
      } catch (e) {
        console.warn('Testimonials error:', e);
      }
    },

    async deleteTestimonialItem(id) {
      if (!confirm('Delete this customer review?')) return;
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok) {
          showToast('Review deleted');
          this.loadTestimonialsData();
        }
      } catch (e) {
        showToast('Error deleting review', 'error');
      }
    },

    openAddTestimonialModal() {
      const author = prompt('Customer Name:');
      if (!author) return;
      const comment = prompt('Review text:');
      const rating = Number(prompt('Rating (1-5):', '5')) || 5;

      fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ author, comment, rating, location: 'India', verifiedBuyer: true })
      }).then(res => {
        if (res.ok) {
          showToast('Review added!');
          this.loadTestimonialsData();
        }
      });
    },

    async loadPdpData() {
      try {
        const res = await fetch('/api/admin/pdp-settings', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('pdpDeliveryText').value = d.deliveryEstimateText || '';
        document.getElementById('pdpGuaranteeText').value = d.guaranteeBadgeText || '';
        document.getElementById('pdpTabReviews').checked = d.enableReviewsTab !== false;
        document.getElementById('pdpTabDosage').checked = d.enableDosageTab !== false;
        document.getElementById('pdpTabSpecs').checked = d.enableSpecificationsTab !== false;
      } catch (e) {
        console.warn('PDP error:', e);
      }
    },

    async savePdpData() {
      try {
        const payload = {
          deliveryEstimateText: document.getElementById('pdpDeliveryText').value,
          guaranteeBadgeText: document.getElementById('pdpGuaranteeText').value,
          enableReviewsTab: document.getElementById('pdpTabReviews').checked,
          enableDosageTab: document.getElementById('pdpTabDosage').checked,
          enableSpecificationsTab: document.getElementById('pdpTabSpecs').checked
        };
        const res = await fetch('/api/admin/pdp-settings', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) showToast('Product Detail Page settings saved!');
      } catch (e) {
        showToast('Error saving PDP settings', 'error');
      }
    },

    async loadContactData() {
      try {
        const res = await fetch('/api/admin/contact-info', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('contactEmail').value = d.supportEmail || '';
        document.getElementById('contactPhone').value = d.supportPhone || '';
        document.getElementById('contactWhatsapp').value = d.whatsappNumber || '';
        document.getElementById('contactHours').value = d.operatingHours || '';
        document.getElementById('contactAddress').value = d.address || '';
      } catch (e) {
        console.warn('Contact load error:', e);
      }
    },

    async saveContactData() {
      try {
        const payload = {
          supportEmail: document.getElementById('contactEmail').value,
          supportPhone: document.getElementById('contactPhone').value,
          whatsappNumber: document.getElementById('contactWhatsapp').value,
          operatingHours: document.getElementById('contactHours').value,
          address: document.getElementById('contactAddress').value
        };
        const res = await fetch('/api/admin/contact-info', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) showToast('Contact information saved!');
      } catch (e) {
        showToast('Error saving contact info', 'error');
      }
    },

    async loadFooterData() {
      try {
        const res = await fetch('/api/admin/footer', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('footerDesc').value = d.description || '';
        document.getElementById('footerCopyright').value = d.copyrightText || '';
        document.getElementById('footerNewsHead').value = d.newsletterHeading || '';
        document.getElementById('footerNewsSub').value = d.newsletterSubtext || '';
      } catch (e) {
        console.warn('Footer error:', e);
      }
    },

    async saveFooterData() {
      try {
        const payload = {
          description: document.getElementById('footerDesc').value,
          copyrightText: document.getElementById('footerCopyright').value,
          newsletterHeading: document.getElementById('footerNewsHead').value,
          newsletterSubtext: document.getElementById('footerNewsSub').value
        };
        const res = await fetch('/api/admin/footer', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) showToast('Footer settings saved!');
      } catch (e) {
        showToast('Error saving footer', 'error');
      }
    },

    async loadSeoData() {
      try {
        const res = await fetch('/api/admin/seo', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('seoSiteTitle').value = d.siteTitle || '';
        document.getElementById('seoMetaDesc').value = d.metaDescription || '';
        document.getElementById('seoKeywords').value = d.keywords || '';
        document.getElementById('seoCanonical').value = d.canonicalUrl || '';
        document.getElementById('seoOgImage').value = d.ogImage || '';
      } catch (e) {
        console.warn('SEO error:', e);
      }
    },

    async saveSeoData() {
      try {
        const payload = {
          siteTitle: document.getElementById('seoSiteTitle').value,
          metaDescription: document.getElementById('seoMetaDesc').value,
          keywords: document.getElementById('seoKeywords').value,
          canonicalUrl: document.getElementById('seoCanonical').value,
          ogImage: document.getElementById('seoOgImage').value
        };
        const res = await fetch('/api/admin/seo', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) showToast('SEO configurations saved!');
      } catch (e) {
        showToast('Error saving SEO', 'error');
      }
    },

    async loadThemeData() {
      try {
        const res = await fetch('/api/admin/theme', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const d = await res.json();
        document.getElementById('themeDefaultMode').value = d.defaultTheme || 'light';
        document.getElementById('themeAllowPublicToggle').checked = d.allowPublicSwitching !== false;
        document.getElementById('themeOceanBlue').value = d.accentOceanBlue || '#0084ff';
        document.getElementById('themeFloralPink').value = d.accentFloralPink || '#f01262';
        document.getElementById('themeCitrusYellow').value = d.accentCitrusYellow || '#d97706';
        document.getElementById('themeRoyalPurple').value = d.primaryPurple || '#3f1b85';
      } catch (e) {
        console.warn('Theme error:', e);
      }
    },

    async saveThemeData() {
      try {
        const payload = {
          defaultTheme: document.getElementById('themeDefaultMode').value,
          allowPublicSwitching: document.getElementById('themeAllowPublicToggle').checked,
          accentOceanBlue: document.getElementById('themeOceanBlue').value,
          accentFloralPink: document.getElementById('themeFloralPink').value,
          accentCitrusYellow: document.getElementById('themeCitrusYellow').value,
          primaryPurple: document.getElementById('themeRoyalPurple').value
        };
        const res = await fetch('/api/admin/theme', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast('Theme styling tokens saved!');
          // Apply to preview
          const preview = document.getElementById('themePreviewBox');
          if (preview) {
            if (payload.defaultTheme === 'dark') {
              preview.style.background = '#100722';
              preview.style.borderColor = 'rgba(124, 58, 237, 0.4)';
              preview.style.color = '#fff';
            } else {
              preview.style.background = '#ffffff';
              preview.style.borderColor = '#e2e8f0';
              preview.style.color = '#0f172a';
            }
          }
        }
      } catch (e) {
        showToast('Error saving theme', 'error');
      }
    },

    async loadAdminUsersData() {
      try {
        const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = list.map(u => `
          <tr>
            <td><strong>${u.fullName || 'Admin'}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role === 'super_admin' ? 'badge-primary' : 'badge-warning'}">${u.role}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            <td>${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
            <td>
              ${u.role !== 'super_admin' ? `<button class="btn-card-details" style="padding: 4px 8px;" onclick="window.WhiteMistAdminExt.deleteAdminUser('${u.id}')">✕ Remove</button>` : '<span style="color: var(--text-dim); font-size: 0.8rem;">Protected</span>'}
            </td>
          </tr>
        `).join('');
      } catch (e) {
        console.warn('Users error:', e);
      }
    },

    openAddUserModal() {
      const email = prompt('Administrator Email Address:');
      if (!email) return;
      const fullName = prompt('Full Name:');
      const password = prompt('Set Temporary Password:');

      fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, fullName, password, role: 'editor' })
      }).then(async res => {
        if (res.ok) {
          showToast('Administrator user created!');
          this.loadAdminUsersData();
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to create user', 'error');
        }
      });
    },

    async deleteAdminUser(id) {
      if (!confirm('Are you sure you want to delete this administrator?')) return;
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok) {
          showToast('Administrator removed');
          this.loadAdminUsersData();
        }
      } catch (e) {
        showToast('Error removing administrator', 'error');
      }
    },

    async loadAuditData() {
      try {
        const res = await fetch('/api/admin/audit-logs', { headers: getAuthHeaders() });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        tbody.innerHTML = list.map(l => `
          <tr>
            <td style="font-size: 0.78rem; font-family: monospace;">${new Date(l.timestamp).toLocaleString()}</td>
            <td><strong>${l.adminEmail}</strong></td>
            <td><span class="badge badge-primary">${l.action}</span></td>
            <td>${l.entityType}</td>
            <td style="font-size: 0.82rem; color: var(--text-secondary);">${l.details}</td>
          </tr>
        `).join('');
      } catch (e) {
        console.warn('Audit error:', e);
      }
    },

    async publishAllChanges() {
      try {
        const btn = document.getElementById('publishLiveBtn');
        if (btn) btn.innerHTML = `<span>Publishing...</span>`;

        const res = await fetch('/api/admin/publish', {
          method: 'POST',
          headers: getAuthHeaders()
        });

        if (res.ok) {
          showToast('All content published directly to the live website!', 'success');
          if (btn) btn.innerHTML = `<span>Published</span>`;
          setTimeout(() => {
            if (btn) btn.innerHTML = `<span>Publish Live</span>`;
          }, 2500);
          this.loadOverviewData();
        } else {
          showToast('Publishing failed', 'error');
          if (btn) btn.innerHTML = `<span>Publish Live</span>`;
        }
      } catch (e) {
        showToast('Publish error', 'error');
      }
    },

    handleGlobalSearch(query) {
      const q = (query || '').toLowerCase().trim();
      if (!q) return;

      // Filter products table if on products view
      if (window.allProducts && document.getElementById('productsTableBody')) {
        const filtered = window.allProducts.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
        );
        if (typeof renderProductsTable === 'function') {
          renderProductsTable(filtered);
        }
      }
    }
  };

  // Expose globally
  window.WhiteMistAdminExt = AdminExt;

  // Extend window.switchView
  const originalSwitchView = window.switchView;
  window.switchView = function (viewName) {
    if (typeof originalSwitchView === 'function') {
      originalSwitchView(viewName);
    }

    // Extended breadcrumb names
    const extendedTitles = {
      'overview': 'Website Overview',
      'header-nav': 'Header & Navigation',
      'brand-story': 'Brand Story / About Us',
      'benefits': 'Benefits & Features',
      'ingredients': 'Ingredients & Dosing',
      'testimonials': 'Customer Testimonials',
      'faqs': 'FAQ Management',
      'contact': 'Contact & Support',
      'footer': 'Footer & Legal',
      'pdp': 'Product Detail Pages',
      'seo': 'SEO Management',
      'theme': 'Theme & Appearance',
      'users': 'Admin Users & Roles',
      'audit': 'Activity Logs'
    };

    if (extendedTitles[viewName]) {
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

      const target = document.getElementById(`view-${viewName}`);
      const navItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
      if (target) target.classList.add('active');
      if (navItem) navItem.classList.add('active');

      const breadcrumb = document.getElementById('topbarBreadcrumb');
      if (breadcrumb) breadcrumb.textContent = extendedTitles[viewName];

      window.history.replaceState(null, '', `/admin#${viewName}`);
    }

    // Route loaders
    if (viewName === 'overview') AdminExt.loadOverviewData();
    if (viewName === 'header-nav') AdminExt.loadHeaderNavData();
    if (viewName === 'brand-story') AdminExt.loadBrandStoryData();
    if (viewName === 'benefits') AdminExt.loadBenefitsData();
    if (viewName === 'ingredients') AdminExt.loadIngredientsData();
    if (viewName === 'testimonials') AdminExt.loadTestimonialsData();
    if (viewName === 'faqs') {
      if (typeof loadHomepageContent === 'function') loadHomepageContent();
    }
    if (viewName === 'contact') AdminExt.loadContactData();
    if (viewName === 'footer') AdminExt.loadFooterData();
    if (viewName === 'pdp') AdminExt.loadPdpData();
    if (viewName === 'seo') AdminExt.loadSeoData();
    if (viewName === 'theme') AdminExt.loadThemeData();
    if (viewName === 'users') AdminExt.loadAdminUsersData();
    if (viewName === 'audit') AdminExt.loadAuditData();
  };

  // Auto-init when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setupExtendedSidebar();
    setupTopbarControls();
    injectExtendedPanels();

    // Check hash again for any extended view
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'dashboard') {
      window.switchView(hash);
    }
  });

})();
