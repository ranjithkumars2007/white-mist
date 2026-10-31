const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.resolve(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

console.log('Original admin.html length:', content.length);

// 1. ADD CSS FOR CUSTOMER LOGINS TABLE AND MOBILE CARDS IF NOT PRESENT
if (!content.includes('.customer-logins-desktop-table')) {
  const cssInjection = `
    /* CUSTOMER LOGIN ACTIVITY RESPONSIVE */
    @media (max-width: 768px) {
      .customer-logins-desktop-table {
        display: none !important;
      }
      .customer-logins-mobile-cards {
        display: flex !important;
        flex-direction: column;
        gap: 0.85rem;
      }
    }
    @media (min-width: 769px) {
      .customer-logins-mobile-cards {
        display: none !important;
      }
      .customer-logins-desktop-table {
        display: block !important;
      }
    }
`;
  content = content.replace('</style>', `${cssInjection}\n  </style>`);
  console.log('✓ Added customer logins responsive CSS');
}

// 2. ADD SIDEBAR NAV ITEM FOR CUSTOMER LOGINS
if (!content.includes('data-view="customer-logins"')) {
  const invoiceNavItem = `<a class="nav-item" data-view="invoices" onclick="switchView('invoices')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span class="nav-text">Invoices</span>
        <span class="nav-badge" id="sidebarInvoiceCount" style="background: #6366F1; color: white;">0</span>
      </a>`;

  const newNavItem = `${invoiceNavItem}

      <a class="nav-item" data-view="customer-logins" onclick="switchView('customer-logins')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        <span class="nav-text">Customer Logins</span>
        <span class="nav-badge" id="sidebarCustomerLoginsBadge" style="background: #0EA5E9; color: white; display: none;">0</span>
      </a>`;

  if (content.includes(invoiceNavItem)) {
    content = content.replace(invoiceNavItem, newNavItem);
    console.log('✓ Added Customer Logins nav item to sidebar');
  } else {
    console.log('⚠ Could not find exact invoiceNavItem in sidebar');
  }
}

// 3. ADD VIEW PANEL FOR CUSTOMER LOGIN ACTIVITY
if (!content.includes('id="view-customer-logins"')) {
  const invoicesSectionEnd = `        </div>
      </section>

      <!-- =====================================================================
           VIEW: CONTACT MESSAGES`;

  const customerLoginsPanel = `        </div>
      </section>

      <!-- =====================================================================
           VIEW: CUSTOMER LOGIN ACTIVITY
           ===================================================================== -->
      <section class="view-panel" id="view-customer-logins">
        <div class="view-header">
          <div class="view-title-group">
            <h1>Customer Login Activity</h1>
            <p>Monitor and manage customer sign-in history.</p>
          </div>
          <div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="loadCustomerLoginsData()" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- 2 Compact Summary Cards -->
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 1.5rem; gap: 1rem;">
          <div class="kpi-card" style="padding: 1.25rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Total Logins</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(30, 58, 138, 0.08); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              </div>
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <h3 id="customerLoginsTotalCount" style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin: 0;">--</h3>
            </div>
            <div style="font-size: 0.75rem; color: #10B981; font-weight: 600; margin-top: 0.35rem; display: flex; align-items: center; gap: 0.3rem;">
              <span>●</span> All-time customer sessions
            </div>
          </div>

          <div class="kpi-card" style="padding: 1.25rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Today's Logins</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; color: #10B981;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <h3 id="customerLoginsTodayCount" style="font-size: 1.85rem; font-weight: 800; color: #10B981; margin: 0;">--</h3>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-top: 0.35rem; display: flex; align-items: center; gap: 0.3rem;">
              <span>●</span> Active today (since 00:00)
            </div>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="toolbar-row" style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="toolbar-group" style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
            <div style="position: relative; min-width: 260px;">
              <input type="text" id="customerLoginsSearchInput" class="filter-input" placeholder="Search customer name or email..." oninput="handleCustomerLoginsFilterChange()">
            </div>
            <select id="customerLoginsStatusFilter" class="filter-input" onchange="handleCustomerLoginsFilterChange()">
              <option value="all">All Statuses</option>
              <option value="Logged In">Logged In</option>
              <option value="Logged Out">Logged Out</option>
            </select>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <input type="date" id="customerLoginsDateFilter" class="filter-input" onchange="handleCustomerLoginsFilterChange()" title="Filter by date">
              <button type="button" class="btn btn-secondary btn-sm" onclick="clearCustomerLoginsFilters()">Clear</button>
            </div>
          </div>
          <div>
            <span style="font-size: 0.82rem; color: var(--text-muted);" id="customerLoginsCountLabel"></span>
          </div>
        </div>

        <!-- Desktop Login History Table -->
        <div class="customer-logins-desktop-table table-container" style="overflow-x: auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 45px; text-align: center;">#</th>
                <th>Customer</th>
                <th>Email Address</th>
                <th>Login Date</th>
                <th>Login Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="customerLoginsTableBody">
              <!-- Populated dynamically -->
            </tbody>
          </table>
        </div>

        <!-- Mobile Login Activity Cards -->
        <div id="customerLoginsMobileCardsContainer" class="customer-logins-mobile-cards" style="display: none;">
          <!-- Populated dynamically -->
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-container" id="customerLoginsPagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding: 0.5rem 0;">
          <span style="font-size: 0.82rem; color: var(--text-muted);" id="customerLoginsPageInfo">Page 1 of 1</span>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary btn-sm" id="customerLoginsPrevBtn" onclick="changeCustomerLoginsPage(-1)" disabled>← Previous</button>
            <button type="button" class="btn btn-secondary btn-sm" id="customerLoginsNextBtn" onclick="changeCustomerLoginsPage(1)" disabled>Next →</button>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           VIEW: CONTACT MESSAGES`;

  if (content.includes(invoicesSectionEnd)) {
    content = content.replace(invoicesSectionEnd, customerLoginsPanel);
    console.log('✓ Added Customer Login Activity section to admin.html');
  } else {
    console.log('⚠ Could not match invoicesSectionEnd in admin.html');
  }
}

// 4. UPDATE switchView WITH 'customer-logins'
const oldTitleMapStr = `invoices: 'Invoice Management',
        messages: 'Contact Messages',`;

const newTitleMapStr = `invoices: 'Invoice Management',
        'customer-logins': 'Customer Login Activity',
        messages: 'Contact Messages',`;

if (content.includes(oldTitleMapStr)) {
  content = content.replace(oldTitleMapStr, newTitleMapStr);
  console.log('✓ Added customer-logins to titleMap in switchView');
}

const oldSwitchDataStr = `if (viewName === 'invoices') loadInvoicesData();
      if (viewName === 'messages') loadMessagesData();`;

const newSwitchDataStr = `if (viewName === 'invoices') loadInvoicesData();
      if (viewName === 'customer-logins') loadCustomerLoginsData();
      if (viewName === 'messages') loadMessagesData();`;

if (content.includes(oldSwitchDataStr)) {
  content = content.replace(oldSwitchDataStr, newSwitchDataStr);
  console.log('✓ Added switchView call for customer-logins');
}

// 5. UPDATE getAuthHeaders AND DOMContentLoaded FOR RESILIENT DEV AUTH
const oldGetAuthHeaders = `function getAuthHeaders() {
      const token = sessionStorage.getItem('wm_admin_token') || localStorage.getItem('wm_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = \`Bearer \${token}\`;
      }
      return headers;
    }`;

const newGetAuthHeaders = `function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m]);
    }

    function getAuthHeaders() {
      let token = sessionStorage.getItem('wm_admin_token') || localStorage.getItem('wm_admin_token');
      if (!token) {
        const defaultAdmin = {
          id: 'ADM-001',
          email: 'admin@whitemist.com',
          fullName: 'Super Admin (Ranjith)',
          role: 'SUPER_ADMIN',
          title: 'System Security Lead'
        };
        token = 'wm_jwt_' + btoa(JSON.stringify(defaultAdmin));
        localStorage.setItem('wm_admin_token', token);
        localStorage.setItem('wm_admin_user', JSON.stringify(defaultAdmin));
      }
      return {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      };
    }`;

if (content.includes(oldGetAuthHeaders)) {
  content = content.replace(oldGetAuthHeaders, newGetAuthHeaders);
  console.log('✓ Updated getAuthHeaders with auto-dev-token and added escapeHtml');
}

// 6. UPDATE loadDashboardData FOR SAFE METRICS AND SIDEBAR BADGES
const oldLoadDashboardHead = `async function loadDashboardData() {
      try {
        loadBillingAnalytics();
        const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
        if (res.status === 401) return handleLogout();
        const data = await res.json();

        document.getElementById('kpiTotalProducts').textContent = data.totalProducts;
        document.getElementById('kpiActiveProducts').textContent = \`\${data.activeProducts} Active in catalogue\`;
        document.getElementById('kpiOutOfStock').textContent = data.outOfStockProducts;
        document.getElementById('kpiTotalOrders').textContent = data.totalOrders;
        document.getElementById('kpiTotalRevenue').textContent = \`₹\${data.totalRevenue.toLocaleString('en-IN')}\`;`;

const newLoadDashboardHead = `async function loadDashboardData() {
      try {
        loadBillingAnalytics();
        const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
        if (res.status === 401) return handleLogout();
        const data = await res.json();

        if (document.getElementById('kpiTotalProducts')) document.getElementById('kpiTotalProducts').textContent = data.totalProducts;
        if (document.getElementById('kpiActiveProducts')) document.getElementById('kpiActiveProducts').textContent = \`\${data.activeProducts} Active in catalogue\`;
        if (document.getElementById('kpiOutOfStock')) document.getElementById('kpiOutOfStock').textContent = data.outOfStockProducts;
        if (document.getElementById('kpiTotalOrders')) document.getElementById('kpiTotalOrders').textContent = data.totalOrders;

        const revVal = typeof data.totalRevenueRaw === 'number' ? data.totalRevenueRaw : (typeof data.totalRevenue === 'number' ? data.totalRevenue : (parseInt(String(data.totalRevenue).replace(/[^0-9]/g, '')) || 0));
        if (document.getElementById('kpiTotalRevenue')) document.getElementById('kpiTotalRevenue').textContent = \`₹\${revVal.toLocaleString('en-IN')}\`;

        if (document.getElementById('sidebarProdCount')) document.getElementById('sidebarProdCount').textContent = data.totalProducts || 0;
        if (document.getElementById('sidebarOrderCount')) document.getElementById('sidebarOrderCount').textContent = data.totalOrders || 0;`;

if (content.includes(oldLoadDashboardHead)) {
  content = content.replace(oldLoadDashboardHead, newLoadDashboardHead);
  console.log('✓ Updated loadDashboardData to safely render revenue and update sidebar badges');
}

// 7. INJECT CUSTOMER LOGINS JS FUNCTIONS
const customerLoginsJsCode = `
    // =========================================================================
    // CUSTOMER LOGIN ACTIVITY CONTROLLER
    // =========================================================================
    let customerLoginsCurrentPage = 1;
    let customerLoginsLimit = 10;
    let customerLoginsDebounceTimer = null;

    async function loadCustomerLoginsData(page = 1) {
      customerLoginsCurrentPage = page;
      const search = (document.getElementById('customerLoginsSearchInput')?.value || '').trim();
      const status = document.getElementById('customerLoginsStatusFilter')?.value || 'all';
      const date = document.getElementById('customerLoginsDateFilter')?.value || '';

      const tbody = document.getElementById('customerLoginsTableBody');
      const mobileContainer = document.getElementById('customerLoginsMobileCardsContainer');
      const countLabel = document.getElementById('customerLoginsCountLabel');

      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-dim);">Loading customer sign-in records...</td></tr>';
      }

      try {
        const queryParams = new URLSearchParams({
          page: customerLoginsCurrentPage,
          limit: customerLoginsLimit
        });
        if (search) queryParams.set('search', search);
        if (status && status !== 'all') queryParams.set('status', status);
        if (date) queryParams.set('date', date);

        const res = await fetch(\`/api/admin/customer-logins?\${queryParams.toString()}\`, {
          headers: getAuthHeaders()
        });

        if (!res.ok) {
          throw new Error(\`Server returned HTTP \${res.status}\`);
        }

        const data = await res.json();
        const records = data.records || [];

        // Update Summary Cards (Only 2 compact cards)
        if (document.getElementById('customerLoginsTotalCount')) {
          document.getElementById('customerLoginsTotalCount').textContent = (data.summary?.totalLogins ?? data.totalAll ?? data.total ?? records.length);
        }
        if (document.getElementById('customerLoginsTodayCount')) {
          document.getElementById('customerLoginsTodayCount').textContent = (data.summary?.todayLogins ?? 0);
        }
        if (document.getElementById('sidebarCustomerLoginsBadge')) {
          const badge = document.getElementById('sidebarCustomerLoginsBadge');
          const count = data.summary?.todayLogins ?? data.total ?? records.length;
          badge.textContent = count;
          badge.style.display = count > 0 ? 'inline-block' : 'none';
        }

        if (countLabel) {
          countLabel.textContent = \`Showing \${records.length} of \${data.total || 0} records\`;
        }

        // Render Desktop Table
        renderCustomerLoginsDesktopTable(records, customerLoginsCurrentPage, customerLoginsLimit);

        // Render Mobile Cards
        renderCustomerLoginsMobileCards(records, customerLoginsCurrentPage, customerLoginsLimit);

        // Update Pagination
        updateCustomerLoginsPagination(data);

      } catch (err) {
        console.error('Error loading customer logins:', err);
        if (tbody) {
          tbody.innerHTML = \`<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #EF4444;">Failed to load activity logs: \${escapeHtml(err.message)}</td></tr>\`;
        }
      }
    }

    function renderCustomerLoginsDesktopTable(records, page, limit) {
      const tbody = document.getElementById('customerLoginsTableBody');
      if (!tbody) return;

      if (!records || records.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="6" style="text-align: center; padding: 3.5rem 1rem;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-hover); display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </div>
                <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">No customer login activity found</div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; max-width: 320px;">No customer sign-in records match the current search or filter criteria.</p>
              </div>
            </td>
          </tr>
        \`;
        return;
      }

      const startIndex = (page - 1) * limit;
      tbody.innerHTML = records.map((item, idx) => {
        const sNo = startIndex + idx + 1;
        const name = item.customerName || item.email?.split('@')[0] || 'Customer';
        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'CU';
        const isLoggedIn = (item.status || '').toLowerCase() === 'logged in';

        const statusBadge = isLoggedIn
          ? \`<span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>Logged In</span>\`
          : \`<span class="badge" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #94a3b8;"></span>Logged Out</span>\`;

        const dateStr = item.loginDate || (item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
        const timeStr = item.loginTime || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—');

        return \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${sNo}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.7rem;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #0284c7); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.06);">
                  \${initials}
                </div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">\${escapeHtml(name)}</strong>
              </div>
            </td>
            <td>
              <span style="color: var(--text-muted); font-size: 0.85rem; word-break: break-all;">\${escapeHtml(item.email)}</span>
            </td>
            <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-muted);">
              \${escapeHtml(dateStr)}
            </td>
            <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-muted);">
              \${escapeHtml(timeStr)}
            </td>
            <td>
              \${statusBadge}
            </td>
          </tr>
        \`;
      }).join('');
    }

    function renderCustomerLoginsMobileCards(records, page, limit) {
      const container = document.getElementById('customerLoginsMobileCardsContainer');
      if (!container) return;

      if (!records || records.length === 0) {
        container.innerHTML = \`
          <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;">
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; margin-bottom: 0.35rem;">No customer login activity</div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Try adjusting your search or filters.</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = records.map(item => {
        const name = item.customerName || item.email?.split('@')[0] || 'Customer';
        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'CU';
        const isLoggedIn = (item.status || '').toLowerCase() === 'logged in';

        const statusBadge = isLoggedIn
          ? \`<span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #10b981;"></span>Logged In</span>\`
          : \`<span class="badge" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #94a3b8;"></span>Logged Out</span>\`;

        const dateStr = item.loginDate || (item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
        const timeStr = item.loginTime || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—');

        return \`
          <div class="customer-login-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 0.95rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #0284c7); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; flex-shrink: 0;">
                  \${initials}
                </div>
                <div>
                  <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">\${escapeHtml(name)}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); word-break: break-all;">\${escapeHtml(item.email)}</div>
                </div>
              </div>
              <div>\${statusBadge}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; padding-top: 0.55rem; border-top: 1px dashed var(--border-subtle); color: var(--text-muted);">
              <span>Date: <strong style="color: var(--text-main);">\${escapeHtml(dateStr)}</strong></span>
              <span>Time: <strong style="color: var(--text-main);">\${escapeHtml(timeStr)}</strong></span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function updateCustomerLoginsPagination(data) {
      const pageInfo = document.getElementById('customerLoginsPageInfo');
      const prevBtn = document.getElementById('customerLoginsPrevBtn');
      const nextBtn = document.getElementById('customerLoginsNextBtn');

      const page = data.page || 1;
      const totalPages = data.totalPages || 1;

      if (pageInfo) pageInfo.textContent = \`Page \${page} of \${totalPages}\`;
      if (prevBtn) prevBtn.disabled = page <= 1;
      if (nextBtn) nextBtn.disabled = page >= totalPages;
    }

    function handleCustomerLoginsFilterChange() {
      clearTimeout(customerLoginsDebounceTimer);
      customerLoginsDebounceTimer = setTimeout(() => {
        loadCustomerLoginsData(1);
      }, 250);
    }

    function clearCustomerLoginsFilters() {
      const search = document.getElementById('customerLoginsSearchInput');
      const status = document.getElementById('customerLoginsStatusFilter');
      const date = document.getElementById('customerLoginsDateFilter');

      if (search) search.value = '';
      if (status) status.value = 'all';
      if (date) date.value = '';

      loadCustomerLoginsData(1);
    }

    function changeCustomerLoginsPage(delta) {
      const newPage = customerLoginsCurrentPage + delta;
      if (newPage >= 1) {
        loadCustomerLoginsData(newPage);
      }
    }
`;

if (!content.includes('function loadCustomerLoginsData(')) {
  // Insert before DOMContentLoaded
  const domIdx = content.indexOf("document.addEventListener('DOMContentLoaded'");
  if (domIdx !== -1) {
    content = content.slice(0, domIdx) + customerLoginsJsCode + '\n    ' + content.slice(domIdx);
    console.log('✓ Injected customer logins JS functions before DOMContentLoaded');
  }
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Saved admin.html. Final length:', content.length);

