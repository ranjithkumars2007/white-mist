const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

console.log('Original admin.html length:', content.length);

// 1. UPDATE CSS FOR INVOICE MODAL & PRINT & MODALS
const oldInvoiceCssTarget = `      /* INVOICE MODAL MOBILE RESPONSIVENESS */
      .invoice-modal-header {
        flex-direction: column !important;
        align-items: stretch !important;
        padding: 0.85rem 1rem !important;
        gap: 0.75rem !important;
      }
      .invoice-modal-title-row {
        justify-content: space-between !important;
        width: 100% !important;
      }
      .invoice-modal-title {
        font-size: 0.98rem !important;
        max-width: 210px !important;
      }
      .invoice-modal-btn-row {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 0.5rem !important;
        width: 100% !important;
      }
      .invoice-modal-btn-row button {
        width: 100% !important;
        justify-content: center !important;
        padding: 0.5rem 0.6rem !important;
        font-size: 0.8rem !important;
      }
      #adminInvoicePrintSheet {
        padding: 0.85rem 0.65rem !important;
      }
      .invoice-b2b-grid {
        grid-template-columns: 1fr !important;
        gap: 0.85rem !important;
        padding: 0.85rem !important;
      }
      .invoice-b2b-col-2 {
        border-left: none !important;
        border-top: 1px solid #E2E8F0 !important;
        padding-left: 0 !important;
        padding-top: 0.85rem !important;
      }
      .invoice-tax-meta-bar {
        flex-direction: column !important;
        gap: 0.35rem !important;
        align-items: flex-start !important;
        font-size: 0.72rem !important;
        padding: 0.5rem 0.75rem !important;
      }`;

const newInvoiceCss = `      /* INVOICE MODAL MOBILE RESPONSIVENESS */
      #adminInvoicePrintSheet {
        padding: 0.85rem 0.65rem !important;
      }
      .invoice-meta-grid {
        grid-template-columns: 1fr !important;
        gap: 0.85rem !important;
      }
      .invoice-products-desktop {
        display: none !important;
      }
      .invoice-products-mobile {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
        margin-bottom: 1.25rem !important;
      }
      .invoice-signatory-wrap {
        justify-content: center !important;
      }`;

if (content.includes(oldInvoiceCssTarget)) {
  content = content.replace(oldInvoiceCssTarget, newInvoiceCss);
  console.log('✓ Updated old mobile invoice CSS');
} else {
  console.log('⚠ Could not find exact oldInvoiceCssTarget');
}

// Ensure the new complete Invoice & Print CSS is added before </style>
const additionalCss = `
    /* =========================================================================
       WHITE MIST INVOICE MODAL & A4 PRINT SYSTEM
       ========================================================================= */
    .invoice-modal-header {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding: 1.15rem 1.5rem;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      box-sizing: border-box;
    }
    .invoice-modal-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }
    .invoice-title-block {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .invoice-main-heading {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
    .invoice-number-tag {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #2563EB;
      white-space: nowrap;
      letter-spacing: 0.03em;
    }
    .invoice-header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .invoice-paid-badge {
      background: #DCFCE7 !important;
      color: #15803D !important;
      border: 1px solid #86EFAC !important;
      padding: 0.3rem 0.75rem !important;
      font-size: 0.75rem !important;
      font-weight: 800 !important;
      border-radius: 9999px !important;
      display: inline-flex !important;
      align-items: center !important;
      white-space: nowrap !important;
    }
    .invoice-close-btn {
      background: #EDF2F7;
      border: 1px solid #CBD5E1;
      color: #475569;
      font-size: 1.1rem;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .invoice-close-btn:hover {
      background: #E2E8F0;
      color: #0F172A;
    }
    .invoice-modal-actions-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      width: 100%;
    }
    .btn-invoice-download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #2563EB;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 0.65rem 1rem;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
      min-height: 42px;
      transition: background 0.15s ease;
    }
    .btn-invoice-download:hover {
      background: #1D4ED8;
    }
    .btn-invoice-print {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #FFFFFF;
      color: #1E293B;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 0.65rem 1rem;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 42px;
      transition: all 0.15s ease;
    }
    .btn-invoice-print:hover {
      background: #F1F5F9;
      border-color: #94A3B8;
    }

    /* INVOICE CONTENT STYLING */
    .invoice-tax-meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      padding: 0.55rem 1rem;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      font-size: 0.75rem;
      color: #475569;
      margin-bottom: 1.25rem;
    }
    .tax-meta-item {
      display: inline-flex;
      gap: 0.35rem;
      white-space: nowrap;
    }

    .invoice-meta-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .invoice-meta-card {
      padding: 1.15rem;
      background: #F8FAFC;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .invoice-card-heading {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748B;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .invoice-customer-name {
      font-size: 1.05rem;
      font-weight: 800;
      color: #0F172A;
    }
    .invoice-customer-addr {
      font-size: 0.82rem;
      color: #475569;
      line-height: 1.4;
    }
    .invoice-customer-meta {
      font-size: 0.82rem;
      color: #475569;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      margin-top: 0.25rem;
    }
    .invoice-customer-pos {
      font-size: 0.78rem;
      color: #64748B;
      margin-top: 0.25rem;
    }
    .invoice-pay-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: #334155;
      padding: 0.15rem 0;
    }
    .invoice-pay-row .pay-label {
      color: #64748B;
      font-weight: 600;
    }
    .invoice-pay-row .pay-val {
      font-weight: 700;
      color: #0F172A;
    }
    .invoice-pay-status-row {
      margin-top: 0.65rem;
      padding-top: 0.5rem;
      border-top: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    /* DUAL VIEW FOR INVOICE PRODUCTS */
    .invoice-products-desktop {
      display: block;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1.5rem;
      background: #FFFFFF;
    }
    .invoice-products-mobile {
      display: none;
    }

    /* MOBILE PRODUCT CARDS */
    .invoice-product-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .product-card-top {
      border-bottom: 1px solid #F1F5F9;
      padding-bottom: 0.5rem;
    }
    .product-card-title {
      font-size: 0.92rem;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.35;
    }
    .product-card-meta-line {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.35rem;
    }
    .meta-tag {
      font-size: 0.72rem;
      background: #F1F5F9;
      color: #475569;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
    }
    .product-card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 0.75rem;
    }
    .product-grid-item {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .product-grid-item .metric-label {
      font-size: 0.7rem;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 600;
    }
    .product-grid-item .metric-val {
      font-size: 0.85rem;
      color: #1E293B;
    }
    .product-grid-item.highlight {
      grid-column: span 2;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background: #EFF6FF;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      margin-top: 0.25rem;
    }
    .product-grid-item.highlight .metric-label {
      font-size: 0.8rem;
      color: #1E40AF;
      font-weight: 700;
    }
    .product-grid-item.highlight .metric-val {
      font-size: 1.05rem;
      font-weight: 900;
      color: #2563EB;
    }

    /* MOBILE PRICE SUMMARY CARD */
    .invoice-mobile-summary-card {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 1.15rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .summary-words-box {
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 0.75rem;
    }
    .words-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748B;
      margin-bottom: 0.25rem;
    }
    .words-text {
      font-size: 0.85rem;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.35;
    }
    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: #475569;
    }
    .summary-grand-total {
      background: #EFF6FF;
      border-top: 2px solid #2563EB;
      border-bottom: 2px solid #2563EB;
      padding: 0.65rem 0.75rem;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 800;
      color: #0F172A;
    }
    .grand-total-val {
      font-size: 1.25rem;
      font-weight: 900;
      color: #2563EB;
    }
    .summary-paid {
      color: #15803D;
      font-weight: 700;
      padding: 0 0.75rem;
    }
    .paid-val {
      color: #15803D;
      font-weight: 800;
    }
    .summary-balance {
      padding: 0 0.75rem;
      color: #64748B;
    }

    .invoice-signatory-wrap {
      display: flex;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #E2E8F0;
      margin-top: 1rem;
    }
    .signatory-box {
      text-align: center;
      min-width: 220px;
    }
    .signatory-org {
      font-size: 0.78rem;
      font-weight: 700;
      color: #475569;
    }
    .signatory-sig {
      font-size: 1.35rem;
      color: #2563EB;
      font-weight: 800;
      font-family: cursive;
      margin: 0.35rem 0;
    }
    .signatory-label {
      border-top: 1px solid #94A3B8;
      padding-top: 0.35rem;
      font-size: 0.75rem;
      color: #475569;
      font-weight: 700;
    }
    .invoice-terms-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-top: 1.25rem;
      font-size: 0.75rem;
      color: #475569;
    }
    .invoice-terms-box ul {
      margin: 0.35rem 0 0 1.25rem;
      padding: 0;
    }
    .invoice-terms-box li {
      margin-bottom: 0.2rem;
    }
    .invoice-footer-banner-wrap {
      margin-top: 1.25rem;
      border-radius: 6px;
      overflow: hidden;
      width: 100%;
      border: 1px solid #E2E8F0;
    }
    .invoice-footer-thankyou {
      text-align: center;
      font-size: 0.75rem;
      color: #64748B;
      margin-top: 0.75rem;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .invoice-tax-meta-bar {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.35rem !important;
        padding: 0.6rem 0.75rem !important;
      }
      .invoice-modal-header {
        padding: 0.85rem 0.75rem !important;
      }
      .invoice-main-heading {
        font-size: 1.05rem !important;
      }
      .invoice-number-tag {
        font-size: 0.88rem !important;
      }
    }

    @media (max-width: 360px) {
      #adminInvoicePrintSheet {
        padding: 0.65rem 0.45rem !important;
      }
      .invoice-modal-actions-bar {
        grid-template-columns: 1fr !important;
      }
    }

    /* A4 PRINT ISOLATION */
    @media print {
      body * {
        visibility: hidden !important;
      }
      .no-print, .modal-backdrop::before, .admin-sidebar, .admin-topbar, .ambient-orb {
        display: none !important;
      }
      .modal-backdrop {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: auto !important;
        background: transparent !important;
        padding: 0 !important;
        display: block !important;
      }
      .modal-box {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        width: 100% !important;
        max-height: none !important;
        overflow: visible !important;
      }
      #adminInvoicePrintSheet, #adminInvoicePrintSheet * {
        visibility: visible !important;
      }
      #adminInvoicePrintSheet {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        padding: 12mm 15mm !important;
        background: #FFFFFF !important;
      }
      .invoice-products-desktop {
        display: block !important;
      }
      .invoice-products-mobile {
        display: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  </style>`;

content = content.replace('  </style>', additionalCss);
console.log('✓ Added White Mist Invoice & Print CSS');

// 2. UPDATE TABLE HEADERS FOR S.NO (#) AND COLUMN WIDTHS
// Products Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Image</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Image</th>`
);

// Categories Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Category Name</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Category Name</th>`
);

// Orders Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Order ID</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Order ID</th>`
);

// Transactions Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Txn ID</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Txn ID</th>`
);

// Invoices Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Invoice Number</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Invoice Number</th>`
);

// Messages Table Header
content = content.replace(
  `            <thead>\n              <tr>\n                <th>Date</th>\n                <th>Customer Name</th>`,
  `            <thead>\n              <tr>\n                <th style="width: 45px; text-align: center;">#</th>\n                <th>Date</th>\n                <th>Customer Name</th>`
);

// Audit Logs Table Header
content = content.replace(
  `              <thead>\n                <tr>\n                  <th>Timestamp</th>`,
  `              <thead>\n                <tr>\n                  <th style="width: 45px; text-align: center;">#</th>\n                  <th>Timestamp</th>`
);
console.log('✓ Updated all table headers with # column');

// 3. ADD SUPER ADMIN TEAM MANAGEMENT PANEL IN SETTINGS
const oldSettingsAuditTrail = `        <!-- Full Audit Log Panel -->\n        <div class="card-panel" style="margin-top: 1.5rem;">`;
const newSuperAdminTeamPanel = `        <!-- Administrator Team & Role Management (Super Admin Control) -->
        <div class="card-panel" id="superAdminTeamPanel" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h2 class="card-panel-title" style="margin-bottom: 0.25rem;">Administrator Team & Role Management</h2>
              <p style="font-size: 0.8rem; color: var(--text-dim); margin: 0;">Super Administrator portal for provisioning, modifying privileges, and managing administrator access.</p>
            </div>
            <button type="button" class="btn-quick-add" onclick="openProvisionAdminModal()">
              + Provision Administrator
            </button>
          </div>
          <div class="table-container" style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 45px; text-align: center;">#</th>
                  <th>Administrator</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department / Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="adminUsersTableBody">
                <tr><td colspan="7" style="text-align: center; padding: 1.5rem; color: var(--text-dim);">Loading administrator team...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Full Audit Log Panel -->
        <div class="card-panel" style="margin-top: 1.5rem;">`;

if (content.includes(oldSettingsAuditTrail)) {
  content = content.replace(oldSettingsAuditTrail, newSuperAdminTeamPanel);
  console.log('✓ Added Super Admin Team Management panel in settings view');
} else {
  console.log('⚠ Could not find oldSettingsAuditTrail');
}

// 4. REPLACE INVOICE MODAL HEADER IN HTML
const oldInvoiceModalHeader = `      <div class="modal-header invoice-modal-header no-print">
        <div class="invoice-modal-title-row">
          <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
            <h3 class="modal-title invoice-modal-title" id="adminInvoiceModalTitle">White Mist Tax Invoice</h3>
            <span class="badge badge-success" id="adminInvoiceModalBadge" style="flex-shrink: 0;">PAID</span>
          </div>
          <button type="button" class="modal-close-btn" onclick="closeAdminInvoiceModal()">✕</button>
        </div>
        <div class="invoice-modal-btn-row">
          <button type="button" class="btn-quick-add" onclick="downloadAdminInvoicePdf()">
            ⭳ Download PDF
          </button>
          <button type="button" class="btn-action-public" onclick="printAdminInvoice()">
            🖨 Print Invoice
          </button>
        </div>
      </div>`;

const newInvoiceModalHeader = `      <div class="invoice-modal-header no-print">
        <div class="invoice-modal-top-bar">
          <div class="invoice-title-block">
            <div class="invoice-main-heading">Tax Invoice</div>
            <div class="invoice-number-tag" id="adminInvoiceModalNumber">WM-INV-2026-9910</div>
          </div>
          <div class="invoice-header-right">
            <span class="badge badge-success invoice-paid-badge" id="adminInvoiceModalBadge">✓ PAID</span>
            <button type="button" class="invoice-close-btn" onclick="closeAdminInvoiceModal()" aria-label="Close">✕</button>
          </div>
        </div>
        <div class="invoice-modal-actions-bar">
          <button type="button" class="btn-invoice-download" onclick="downloadAdminInvoicePdf()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download PDF</span>
          </button>
          <button type="button" class="btn-invoice-print" onclick="printAdminInvoice()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>`;

if (content.includes(oldInvoiceModalHeader)) {
  content = content.replace(oldInvoiceModalHeader, newInvoiceModalHeader);
  console.log('✓ Replaced invoice modal header with 2-row responsive design');
} else {
  console.log('⚠ Could not find oldInvoiceModalHeader');
}

// 5. ADD CATEGORY MODAL AND PROVISION ADMIN MODAL RIGHT AFTER BANNER MODAL
const bannerModalEnd = `  <!-- BANNER MODAL -->
  <div class="modal-backdrop" id="bannerModal">
    <div class="modal-box" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title" id="bannerModalTitle">Add Promotional Banner</h3>
        <button type="button" class="modal-close-btn" onclick="closeBannerModal()">✕</button>
      </div>
      <div class="modal-body">
        <form id="bannerEditForm">
          <input type="hidden" id="editBannerId">
          <div class="form-group">
            <label class="form-label">Banner Title</label>
            <input type="text" id="editBannerTitle" class="form-input-text" required placeholder="✦ FESTIVE LAUNDRY OFFER ✦">
          </div>
          <div class="form-group">
            <label class="form-label">Subtitle / Discount Details</label>
            <textarea id="editBannerSubtitle" class="form-textarea" rows="2" placeholder="Get 15% OFF on orders over ₹599..."></textarea>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Target View / Destination</label>
              <select id="editBannerLink" class="form-select">
                <option value="products">Products Page</option>
                <option value="cart">Cart Page</option>
                <option value="home">Home Top</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Display Order</label>
              <input type="number" id="editBannerOrder" class="form-input-text" value="1" min="1">
            </div>
          </div>
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-main); cursor: pointer;">
              <input type="checkbox" id="editBannerActive" checked style="accent-color: var(--color-primary);">
              <span>Active (Shown on Storefront)</span>
            </label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-action-public" onclick="closeBannerModal()">Cancel</button>
        <button type="button" class="btn-quick-add" onclick="saveBannerSubmit()">Save Banner</button>
      </div>
    </div>
  </div>`;

const newModalsBlock = `${bannerModalEnd}

  <!-- =======================================================================
       CREATE NEW PRODUCT CATEGORY MODAL (Matching Image 2)
       ======================================================================= -->
  <div class="modal-backdrop" id="categoryModal" style="display: none; z-index: 99999;">
    <div class="modal-box" style="max-width: 540px; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      <div class="modal-header" style="background: #FAFCFF; border-bottom: 1px solid #E2E8F0; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>Create New Product Category</span>
          </h3>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0.25rem 0 0 0;">
            Define a new detergent taxonomy for storefront navigation and catalog filtering.
          </p>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeAddCategoryModal()" aria-label="Close dialog">✕</button>
      </div>

      <form id="categoryCreateForm" onsubmit="event.preventDefault(); handleCreateCategorySubmit();" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            Category Name *
          </label>
          <input
            type="text"
            id="newCatName"
            required
            placeholder="e.g. Fabric Softeners & Conditioners"
            class="form-input-text"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
            oninput="autoGenerateCategorySlug(this.value)"
          >
        </div>

        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            URL Slug
          </label>
          <input
            type="text"
            id="newCatSlug"
            placeholder="e.g. fabric-softeners"
            class="form-input-text"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
          >
          <span style="font-size: 0.74rem; color: #64748B; margin-top: 3px; display: block;">
            Will be accessible at <code id="newCatSlugPreview">/category/fabric-softeners</code>
          </span>
        </div>

        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            Description
          </label>
          <textarea
            id="newCatDesc"
            rows="3"
            placeholder="Brief summary of products in this category..."
            class="form-textarea"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem; font-family: inherit;"
          ></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid #E2E8F0;">
          <button
            type="button"
            onclick="closeAddCategoryModal()"
            style="background: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; padding: 0.55rem 1.15rem; border-radius: 8px; font-size: 0.84rem; font-weight: 600; cursor: pointer;"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btnSubmitCreateCategory"
            style="background: #0284C7; color: #FFFFFF; border: none; padding: 0.55rem 1.35rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);"
          >
            Create Category
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- =======================================================================
       SUPER ADMIN: PROVISION ADMINISTRATOR MODAL
       ======================================================================= -->
  <div class="modal-backdrop" id="provisionAdminModal" style="display: none; z-index: 99999;">
    <div class="modal-box" style="max-width: 520px; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      <div class="modal-header" style="background: #FAFCFF; border-bottom: 1px solid #E2E8F0; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Provision Administrator Account</span>
          </h3>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0.25rem 0 0 0;">
            Super Admin credential issuance for store operations, inventory, and order dispatch teams.
          </p>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeProvisionAdminModal()" aria-label="Close dialog">✕</button>
      </div>

      <form id="provisionAdminForm" onsubmit="event.preventDefault(); handleCreateAdminUser();" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            Full Name *
          </label>
          <input
            type="text"
            id="newAdminName"
            required
            placeholder="e.g. Ranjith Kumar"
            class="form-input-text"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
          >
        </div>

        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            Official Email Address *
          </label>
          <input
            type="email"
            id="newAdminEmail"
            required
            placeholder="e.g. ranjith.admin@whitemistcare.com"
            class="form-input-text"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
          >
        </div>

        <div class="form-grid-2">
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
              Access Role *
            </label>
            <select id="newAdminRole" class="form-select" style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem; background: #FFF;">
              <option value="ADMIN">Administrator (Store Ops)</option>
              <option value="SUPER_ADMIN">Super Administrator (Full Root)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
              Department / Title
            </label>
            <input
              type="text"
              id="newAdminTitle"
              placeholder="e.g. Fulfillment & Ops"
              class="form-input-text"
              style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
            >
          </div>
        </div>

        <div>
          <label style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block; margin-bottom: 4px;">
            Security Password (min 8 chars) *
          </label>
          <input
            type="password"
            id="newAdminPassword"
            required
            minlength="8"
            placeholder="••••••••••••"
            class="form-input-text"
            style="width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.88rem;"
          >
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid #E2E8F0;">
          <button
            type="button"
            onclick="closeProvisionAdminModal()"
            style="background: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; padding: 0.55rem 1.15rem; border-radius: 8px; font-size: 0.84rem; font-weight: 600; cursor: pointer;"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btnSubmitProvisionAdmin"
            style="background: #2563EB; color: #FFFFFF; border: none; padding: 0.55rem 1.35rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);"
          >
            Provision Administrator
          </button>
        </div>
      </form>
    </div>
  </div>`;

if (content.includes(bannerModalEnd)) {
  content = content.replace(bannerModalEnd, newModalsBlock);
  console.log('✓ Added Category Modal and Provision Admin Modal');
} else {
  console.log('⚠ Could not find bannerModalEnd');
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Saved admin.html (Stage 1). Length:', content.length);
